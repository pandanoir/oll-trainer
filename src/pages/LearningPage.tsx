import { VFC, useContext, useEffect, useState } from 'react';
import 'twin.macro';

import { DangerButton } from '../components/common/DangerButton';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { ListModal } from '../components/ListModal';
import { Solve } from '../components/Solve';

import { nextIndex, prevIndex } from '../utils';
import { CheckContext } from '../utils/hooks/useCheck';
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
    <div tw="flex flex-col items-center space-y-2">
      のこり {size} 個
      <Solve index={target[0]} />
      <div tw="flex space-x-2">
        <SecondaryButton onClick={prev}>prev</SecondaryButton>
        <SecondaryButton onClick={next}>next</SecondaryButton>
        <PrimaryButton onClick={() => check(target[1])}>check</PrimaryButton>
        <DangerButton
          onClick={() =>
            confirm('これまでのチェックをすべてリセットしますか?') && reset()
          }
        >
          reset
        </DangerButton>
      </div>
      <SecondaryButton onClick={openListModal}>一覧</SecondaryButton>
      {showsModal && <ListModal onClose={() => setShowsModal(false)} />}
    </div>
  );
};
