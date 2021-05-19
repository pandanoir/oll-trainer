import { useRef } from 'react';
import tw from 'twin.macro';
import { readAsText } from '../../utils/readAsText';
import { PrimaryButton } from '../PrimaryButton';
import { SessionData, fromCsTimer } from './timeData';

const FileButton = tw(
  PrimaryButton
)`px-3.5 py-0 border-0 border-b-2 border-blue-500 whitespace-nowrap`;
export const FileInput = ({
  onChange,
}: {
  onChange: (json: SessionData[]) => void;
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
            onChange(fromCsTimer(JSON.parse(text)));
          } catch {
            alert('インポート中にエラーが発生しました');
          }
        }}
        accept="text/*"
        className="hidden"
      />
      <FileButton
        onClick={() => {
          if (fileRef.current) {
            fileRef.current.click();
          }
        }}
      >
        csTimer からインポート
      </FileButton>
    </>
  );
};
