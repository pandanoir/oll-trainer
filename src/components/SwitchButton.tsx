import { VFC } from 'react';
import tw from 'twin.macro';

export const SwitchButton: VFC<{
  value: 'left' | 'right';
  onChange: (newValue: 'left' | 'right') => void;
}> = ({ value, onChange }) => {
  return (
    <button
      css={[
        tw`rounded-full w-9 h-5 bg-gray-500 focus:outline-none`,
        value === 'left' ? tw`text-left` : tw`text-right`,
      ]}
      onClick={() => onChange(value === 'left' ? 'right' : 'left')}
    >
      <div tw="inline-block rounded-full bg-white h-3 w-3 mx-1 my-1"></div>
    </button>
  );
};
