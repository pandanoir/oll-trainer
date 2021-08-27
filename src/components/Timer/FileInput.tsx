import { ReactNode, useRef } from 'react';
import 'twin.macro';
import { readAsText } from '../../utils/readAsText';

export const FileInput = ({
  onChange,
  onError,
  button,
}: {
  onChange: (text: string) => void;
  onError: (error: unknown) => void;
  button: (onClick: () => void) => ReactNode;
}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        onChange={async ({ target: { files } }) => {
          if (!files) {
            return;
          }
          try {
            const text = await readAsText(files[0]);
            onChange(text);
          } catch (e) {
            onError(e);
          }
        }}
        accept="text/*"
        tw="hidden"
        hidden
      />
      {button(() => {
        if (fileRef.current) {
          fileRef.current.click();
        }
      })}
    </>
  );
};
