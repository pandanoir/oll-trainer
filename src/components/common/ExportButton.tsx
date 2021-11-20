import { PropsWithChildren, useRef } from 'react';

export const ExportButton = ({
  children,
  getContent,
}: PropsWithChildren<{ getContent: () => string }>) => {
  const fileName = 'export.json';
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const handleDownload = () => {
    const blob = new Blob([getContent()], { type: 'text/plain' });
    if (buttonRef.current) {
      buttonRef.current.href = URL.createObjectURL(blob);
    }
  };
  return (
    <a ref={buttonRef} href="#" download={fileName} onClick={handleDownload}>
      {children}
    </a>
  );
};
