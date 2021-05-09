import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props =
  | { title: string; onClose: () => void }
  | { title: string; onClose: () => void; label: string; onClick: () => void };
export const Toast = ({ title, onClose, ...props }: Props) => {
  const $el = useRef(document.createElement('div'));
  useEffect(() => {
    const current = $el.current;
    document.body.appendChild(current);
    return () => {
      document.body.removeChild(current);
    };
  }, []);

  return createPortal(
    <div
      onClick={onClose}
      className="flex fixed justify-between w-72 right-0 bottom-3 bg-gray-900 text-white bg-opacity-90 shadow-md rounded-md"
    >
      <span className="pl-6 py-3">{title}</span>
      {'label' in props && (
        <span
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <button
            onClick={props.onClick}
            className="border-l border-white my-3 px-4 bg-transparent text-blue-500 font-bold focus:outline-none"
          >
            {props.label}
          </button>
        </span>
      )}
    </div>,
    $el.current
  );
};

export const useToast = () => {
  const [showsToast, setShowsToast] = useState(false);
  const [toastProps, setToastProps] = useState<Props>({
    title: '',
    label: '',
    onClose: () => void 0,
    onClick: () => void 0,
  });
  const openToast = (
    title: string,
    buttonLabel: string,
    callback: () => void
  ) => {
    setShowsToast(true);
    setToastProps({
      title,
      label: buttonLabel,
      onClose: closeToast,
      onClick: callback,
    });
  };
  const closeToast = () => {
    setShowsToast(false);
  };
  return { showsToast, toastProps, openToast, closeToast } as const;
};
