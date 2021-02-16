import { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Solve } from '../components/Solve';
import { CheckContext, useCheckbox } from '../utils';

export const ListPage: FC = () => {
  const { checkList, check } = useContext(CheckContext);
  const [shows, onChange] = useCheckbox();

  console.log(
    checkList.map((isChecked, index) => {
      if (!shows && isChecked) return null;
      return (
        <div
          key={index}
          className={isChecked ? 'checked' : ''}
          onClick={() => check(index)}
        >
          <Solve index={index} />
        </div>
      );
    })
  );
  return (
    <div id="list">
      <div>
        <Link to="/learn">戻る</Link>
        <br />
        <input type="checkbox" checked={shows} onChange={onChange} />
        チェックしたもの{shows ? 'を非表示にする' : 'も表示する'}
      </div>
      {checkList.map((isChecked, index) => {
        if (!shows && isChecked) return null;
        return (
          <div
            key={index}
            className={isChecked ? 'checked' : ''}
            onClick={() => check(index)}
          >
            <Solve index={index} />
          </div>
        );
      })}
    </div>
  );
};
