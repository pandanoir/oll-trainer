import {
  PropsWithChildren,
  useRef,
  useEffect,
  useCallback,
  useState,
  FC,
} from 'react';
import { createPortal } from 'react-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import 'twin.macro';
import { clickAway } from '../../utils/clickAway';
import { usePortalRoot } from '../../utils/hooks/usePortalRoot';

export const Modal: FC<
  PropsWithChildren<{
    onClose: () => void;
    ariaLabel: string;
    className?: string;
  }>
> = ({ onClose, className, children, ariaLabel }) => {
  const $el = usePortalRoot();
  const $modal = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ($modal.current) {
      return clickAway($modal.current, onClose);
    }
  }, [onClose]);
  useHotkeys('esc', () => {
    onClose();
  });

  return createPortal(
    <div
      role="dialog"
      aria-label={ariaLabel}
      tw="flex fixed inset-0 w-full h-full bg-gray-400 bg-opacity-60 dark:bg-gray-900 dark:bg-opacity-60 place-items-center"
    >
      <div
        tw="bg-white dark:bg-gray-800 dark:text-white shadow-lg fixed inset-8 opacity-100 rounded-md"
        className={className}
        ref={$modal}
      >
        {children}
      </div>
    </div>,
    $el.current
  );
};

export const useModal = () => {
  const [showsModal, setShowsModal] = useState(false);
  const openModal = useCallback(() => {
    setShowsModal(true);
  }, []);
  const closeModal = useCallback(() => {
    setShowsModal(false);
  }, []);
  return { showsModal, openModal, closeModal } as const;
};
