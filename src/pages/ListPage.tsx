import { VFC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Solve } from '../components/Solve';
import { CheckContext } from '../utils/hooks/useCheck';
import { useCheckbox } from '../utils/hooks/useCheckbox';

export const ListPage: VFC = () => {
  const { checkList, check } = useContext(CheckContext);
  const [shows, onChange] = useCheckbox();

  return (
    <div
      id="list"
      className="grid gap-2 grid-cols-1 mx-2 sm:grid-cols-2 lg:grid-cols-3"
    >
      <div>
        <Link to="/learn">戻る</Link>
        <br />
        <input type="checkbox" checked={shows} onChange={onChange} />
        チェックしたものを表示する
      </div>
      {checkList
        .filter((isChecked) => shows || !isChecked)
        .map((isChecked, index) => (
          <div
            key={index}
            className={isChecked ? 'checked' : ''}
            onClick={() => check(index)}
          >
            <Solve index={index} />
          </div>
        ))}
    </div>
  );
};
