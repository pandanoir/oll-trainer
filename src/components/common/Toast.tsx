import { useRef, useEffect, useState, memo } from 'react';
import { createPortal } from 'react-dom';
import tw from 'twin.macro';
import { usePortalRoot } from '../../utils/hooks/usePortalRoot';
import { usePreventDefault } from '../../utils/hooks/usePreventDefault';

type Props = {
  title: string;
  onClose: () => void;
  label?: string;
  onClick?: () => void;
  shows: boolean;
};
// 横スワイプで削除できるトースト
// 消えるときは右へスライドしながら消える
const ToastRaw = ({ title, onClose, label, onClick, shows }: Props) => {
  const $el = usePortalRoot();
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    if (shows) {
      setHidden(false);
    }
  }, [shows]);
  const [initialCursorX, setInitialCursorX] = useState<number | null>(null);
  const [cursorX, setCursorX] = useState<number | null>(null);
  const identifier = useRef<null | number>(null);
  const touching = initialCursorX !== null;

  const ref = usePreventDefault<HTMLDivElement>('touchend', cursorX !== null);

  return createPortal(
    hidden ? null : (
      <div
        css={[
          tw`flex fixed justify-between w-72 right-0 bottom-3`,
          tw`bg-gray-900 dark:bg-gray-500 text-white bg-opacity-90 shadow-md rounded-md`,
          shows
            ? ''
            : tw`transform translate-x-full duration-2000 transition-all`,
          touching ? '' : tw`transition-all`,
        ]}
        style={{
          touchAction: 'none',
          ...(typeof initialCursorX === 'number' &&
            typeof cursorX === 'number' && {
              transform: `translateX(${cursorX - initialCursorX}px)`,
            }),
        }}
        onTransitionEnd={() => {
          if (!shows) {
            setHidden(true);
          }
        }}
        ref={ref}
        onTouchStart={(e) => {
          if (identifier.current !== null) {
            return;
          }
          identifier.current = e.touches[0].identifier;
          setInitialCursorX(e.touches[0].pageX);
        }}
        onTouchMove={(e) => {
          for (let i = 0, len = e.touches.length; i < len; i++) {
            if (e.touches[i].identifier !== identifier.current) {
              continue;
            }
            setCursorX(e.touches[i].pageX);
          }
        }}
        onTouchEnd={() => {
          if (
            typeof cursorX === 'number' &&
            typeof initialCursorX === 'number' &&
            cursorX - initialCursorX >= 80
          ) {
            onClose();
          }

          setInitialCursorX(null);
          setCursorX(null);
          identifier.current = null;
        }}
        onMouseDown={(e) => {
          setInitialCursorX(e.pageX);
        }}
        onMouseMove={(e) => {
          if (initialCursorX !== null) {
            setCursorX(e.pageX);
          }
        }}
        onMouseUp={() => {
          // mouseup -> click の順でイベントが発火するが、ステートのリセットを click のあとに行いたいのでsetTimeoutをはさんでいる
          setTimeout(() => {
            if (
              typeof cursorX === 'number' &&
              typeof initialCursorX === 'number' &&
              cursorX - initialCursorX >= 80
            ) {
              onClose();
            }
            setInitialCursorX(null);
            setCursorX(null);
          }, 0);
        }}
      >
        <span tw="pl-6 py-3">{title}</span>
        {label && (
          <button
            onClick={onClick}
            tw="border-l border-white my-3 px-4 bg-transparent text-blue-500 dark:text-blue-300 font-bold focus:outline-none"
          >
            {label}
          </button>
        )}
      </div>
    ),
    $el.current
  );
};
export const Toast = memo(ToastRaw);

export const useToast = () => {
  const [shows, setShows] = useState(false);
  const [toastProps, setToastProps] = useState<Omit<Props, 'shows'>>({
    title: '',
    label: '',
    onClose: () => void 0,
    onClick: () => void 0,
  });
  const [timeout, setTimeoutState] = useState<number | null>(null);
  useEffect(() => {
    if (shows && timeout !== null) {
      const id = setTimeout(closeToast, timeout);
      return () => {
        clearTimeout(id);
        setTimeoutState(null);
      };
    }
  }, [timeout, shows]);

  const openToast = ({
    title,
    buttonLabel,
    callback,
    timeout,
  }: {
    title: string;
    buttonLabel?: string;
    callback?: () => void;
    timeout?: number;
  }) => {
    setShows(true);
    if (typeof timeout === 'number') {
      setTimeoutState(timeout);
    }
    setToastProps({
      title,
      label: buttonLabel,
      onClose: closeToast,
      onClick: callback,
    });
  };
  const closeToast = () => {
    setShows(false);
  };
  return { shows, ...toastProps, openToast, closeToast } as const;
};
