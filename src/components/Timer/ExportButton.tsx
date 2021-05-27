import { PropsWithChildren, useRef } from 'react';
import tw from 'twin.macro';

const ExportButtonRaw = ({
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
export const ExportButton = tw(
  ExportButtonRaw
)`px-10 py-1.5 bg-blue-300 text-black rounded font-bold px-3.5 py-0 border-0 border-b-2 border-blue-500 whitespace-nowrap`;
