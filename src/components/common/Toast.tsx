import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import tw from 'twin.macro';

type Props = {
  title: string;
  onClose: () => void;
  label?: string;
  onClick?: () => void;
  shows: boolean;
};
export const Toast = ({ title, onClose, label, onClick, shows }: Props) => {
  const $el = useRef(document.createElement('div'));
  useEffect(() => {
    const current = $el.current;
    document.body.appendChild(current);
    return () => {
      document.body.removeChild(current);
    };
  }, []);
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    if (shows) {
      setHidden(false);
    }
  }, [shows]);

  return createPortal(
    hidden ? null : (
      <div
        onClick={onClose}
        css={[
          tw`flex fixed justify-between w-72 right-0 bottom-3`,
          tw`bg-gray-900 dark:bg-gray-500 text-white bg-opacity-90 shadow-md rounded-md`,
          shows
            ? tw`opacity-100`
            : tw`opacity-0 duration-200 ease-out transition-opacity`,
        ]}
        onTransitionEnd={() => {
          setHidden(true);
        }}
      >
        <span tw="pl-6 py-3">{title}</span>
        {label && (
          <span
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <button
              onClick={onClick}
              tw="border-l border-white my-3 px-4 bg-transparent text-blue-500 dark:text-blue-300 font-bold focus:outline-none"
            >
              {label}
            </button>
          </span>
        )}
      </div>
    ),
    $el.current
  );
};

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
