import { ChangeEvent, useState } from 'react';

export const useCheckbox = (init = false) => {
  const [checked, setChecked] = useState(init);
  return [
    checked,
    (event: ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
    },
  ] as const;
};
