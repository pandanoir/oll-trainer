import { PropsWithChildren, useRef } from 'react';

export const ExportButton = ({
  children,
  getContent,
  className,
}: PropsWithChildren<{ getContent: () => string; className?: string }>) => {
  const fileName = 'export.json';
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const handleDownload = () => {
    const blob = new Blob([getContent()], { type: 'text/plain' });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, fileName);
      navigator.msSaveOrOpenBlob(blob, fileName);
    } else if (buttonRef.current) {
      buttonRef.current.href = URL.createObjectURL(blob);
    }
  };
  return (
    <a
      className={className}
      ref={buttonRef}
      href="#"
      download={fileName}
      onClick={handleDownload}
    >
      {children}
    </a>
  );
};
