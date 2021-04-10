import { ChangeEvent, useState } from 'react';

export const useCheckbox = (
  init = false
): [boolean, (event: ChangeEvent<HTMLInputElement>) => void] => {
  const [checked, setChecked] = useState(init);
  return [
    checked,
    (event: ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
    },
  ];
};
