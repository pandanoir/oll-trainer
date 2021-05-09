export const clickAway = (el: HTMLElement, onAway: () => void) => {
  const onClick = (ev: MouseEvent) => {
    const path = ev.composedPath();
    if (path.includes(el)) {
      return;
    }
    onAway();
  };

  document.addEventListener('click', onClick);
  return () => {
    document.removeEventListener('click', onClick);
  };
};
