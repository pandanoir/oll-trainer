import { useEffect, useRef } from 'react';

export const usePortalRoot = () => {
  const $el = useRef(document.createElement('div'));
  useEffect(() => {
    const current = $el.current;
    document.querySelector('#portal_root')?.appendChild(current);
    return () => {
      document.querySelector('#portal_root')?.removeChild(current);
    };
  }, []);
  return $el;
};
