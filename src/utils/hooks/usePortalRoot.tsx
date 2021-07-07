import { useEffect, useRef } from 'react';

export const usePortalRoot = () => {
  const $el = useRef(document.createElement('div'));
  useEffect(() => {
    const current = $el.current;
    document.body.appendChild(current);
    return () => {
      document.body.removeChild(current);
    };
  }, []);
  return $el;
};
