import { VFC, useContext, useEffect, useState } from 'react';
import 'twin.macro';

import { Button } from '../components/common/Button';
import { DangerButton } from '../components/common/DangerButton';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Solve } from '../components/Solve';
import { CheckContext } from '../utils/hooks/useCheck';
import { nextIndex, prevIndex } from '../utils';
import { ListModal } from '../components/ListModal';
import { useTitle } from '../utils/hooks/useTitle';

export const LearningPage: VFC = () => {
  useTitle('Learn OLL');
  const { checkList, check, reset } = useContext(CheckContext);
  const size = 57 - checkList.reduce((acc, item) => acc + (item ? 1 : 0), 0);

  const [index, setIndex] = useState(0); // まだチェックがついていない要素のうち、左からいくつか
  useEffect(() => {
    const cb = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        next();
      } else if (event.code === 'Backspace') {
        prev();
      }
    };
    window.addEventListener('keydown', cb);
    return () => {
      window.removeEventListener('keydown', cb);
    };
  });
  const target = [...Array(57).keys()]
    .map((value, index) => [value, index])
    .filter(([, index]) => !checkList[index])[index];
  const next = () => setIndex(nextIndex(index, size)),
    prev = () => setIndex(prevIndex(index, size));
  const [showsModal, setShowsModal] = useState(false);

  const openListModal = () => {
    setShowsModal(true);
  };
  return target === undefined ? (
    <div>all done!</div>
  ) : (
    <div tw="flex flex-col items-center">
      のこり {size} 個
      <Solve index={target[0]} />
      <div tw="flex gap-2">
        <Button onClick={prev}>prev</Button>
        <Button onClick={next}>next</Button>
        <PrimaryButton onClick={() => check(target[1])}>check</PrimaryButton>
        <DangerButton
          onClick={() =>
            confirm('これまでのチェックをすべてリセットしますか?') && reset()
          }
        >
          reset
        </DangerButton>
      </div>
      <button onClick={openListModal}>一覧</button>
      {showsModal && <ListModal onClose={() => setShowsModal(false)} />}
    </div>
  );
};
