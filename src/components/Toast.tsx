import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props =
  | { title: string }
  | { title: string; label: string; onClick: () => void };
export const Toast = ({ title, ...props }: Props) => {
  const $el = useRef(document.createElement('div'));
  useEffect(() => {
    const current = $el.current;
    document.body.appendChild(current);
    return () => {
      document.body.removeChild(current);
    };
  }, []);
  return createPortal(
    <div className="flex fixed justify-between w-72 px-6 py-3 right-0 bottom-3 bg-gray-900 text-white bg-opacity-90 shadow-md rounded-md">
      <span>{title}</span>
      {'label' in props && (
        <span>
          <button
            onClick={props.onClick}
            className="border-none bg-transparent text-blue-500 font-bold"
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
    onClick: () => void 0,
  });
  const openToast = (
    title: string,
    buttonLabel: string,
    callback: () => void
  ) => {
    setShowsToast(true);
    setToastProps({ title, label: buttonLabel, onClick: callback });
  };
  const closeToast = () => {
    setShowsToast(false);
  };
  return { showsToast, toastProps, openToast, closeToast } as const;
};
