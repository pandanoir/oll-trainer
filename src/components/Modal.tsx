import {
  PropsWithChildren,
  useRef,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { clickAway } from '../utils/clickAway';

export const Modal = ({
  onClose,
  children,
}: PropsWithChildren<{ onClose: () => void }>) => {
  const $el = useRef(document.createElement('div'));
  const $modal = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.body.appendChild($el.current);
    return () => {
      document.body.removeChild($el.current);
    };
  }, []);
  useEffect(() => {
    if ($modal.current) {
      return clickAway($modal.current, onClose);
    }
  }, []);

  return createPortal(
    <div className="fixed inset-0 w-full h-full bg-gray-400 bg-opacity-60">
      <div
        className="bg-white fixed inset-8 opacity-100 rounded-md"
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