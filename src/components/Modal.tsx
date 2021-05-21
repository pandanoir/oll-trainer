import {
  PropsWithChildren,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import 'twin.macro';
import { clickAway } from '../utils/clickAway';

export const Modal = ({
  onClose,
  children,
}: PropsWithChildren<{ onClose: () => void }>) => {
  const $el = useRef(document.createElement('div'));
  const $modal = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const current = $el.current;
    document.body.appendChild(current);
    return () => {
      document.body.removeChild(current);
    };
  }, []);
  useEffect(() => {
    if ($modal.current) {
      return clickAway($modal.current, onClose);
    }
  }, [onClose]);
  useHotkeys('esc', () => {
    onClose();
  });

  return createPortal(
    <div tw="fixed inset-0 w-full h-full bg-gray-400 bg-opacity-60">
      <div tw="bg-white fixed inset-8 opacity-100 rounded-md" ref={$modal}>
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
