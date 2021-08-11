import { VFC } from 'react';
import tw from 'twin.macro';

export const SwitchButton: VFC<{
  value: 'left' | 'right';
  onChange: (newValue: 'left' | 'right') => void;
}> = ({ value, onChange }) => {
  return (
    <button
      tw="relative rounded-full w-9 h-5 px-1 py-1 bg-gray-500 focus:outline-none"
      onClick={() => onChange(value === 'left' ? 'right' : 'left')}
    >
      <div
        css={[
          tw`inline-block absolute top-1 transition-position duration-100 ease-out rounded-full bg-white h-3 w-3`,
          value === 'left' ? tw`left-1` : tw`left-5`,
        ]}
      />
    </button>
  );
};
