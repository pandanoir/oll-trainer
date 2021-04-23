import { VFC, useContext, useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { DangerButton } from '../components/DangerButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { Solve } from '../components/Solve';
import { CheckContext } from '../utils/hooks/useCheck';
import { nextIndex, prevIndex } from '../utils';
import { ListModal } from '../components/ListModal';

export const LearningPage: VFC = () => {
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
    <div className="flex flex-col items-center">
      のこり {size} 個
      <Solve index={target[0]} />
      <div className="flex gap-2">
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
