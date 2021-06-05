import { VFC, PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import tw from 'twin.macro';

export const ToggleButton: VFC<
  PropsWithChildren<{ checked: boolean; onChange: (newValue: boolean) => void }>
> = ({ children, checked = true, onChange }) => {
  return (
    <div
      css={[
        checked
          ? tw`border border-blue-400 bg-blue-500 text-white px-1.5`
          : tw`border border-gray-400 px-3.5 bg-white text-black`,
        tw`inline-block rounded cursor-pointer select-none whitespace-nowrap`,
      ]}
      onClick={() => onChange(!checked)}
    >
      {checked && <FontAwesomeIcon icon={faCheck} />}
      {children}
    </div>
  );
};
