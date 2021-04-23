import { VFC, useContext } from 'react';
import { Solve } from './Solve';
import { CheckContext } from '../utils/hooks/useCheck';
import { useCheckbox } from '../utils/hooks/useCheckbox';

const Overlay: VFC<{
  onClick: () => void;
}> = ({ onClick }) => {
  return (
    <div
      className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50"
      onClick={onClick}
    />
  );
};

export const ListModal: VFC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { checkList, check } = useContext(CheckContext);
  const [showsChecked, onChange] = useCheckbox();

  const gridClass = 'grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div className="w-full h-full top-0 left-0 flex items-center justify-center">
      <Overlay onClick={onClose} />
      <div
        id="list"
        className={`absolute bg-white p-2 rounded inset-2 sm:inset-3 lg:inset-8 overflow-y-scroll ${gridClass}`}
      >
        <div>
          <button onClick={onClose}>閉じる</button>
          <br />
          <label className="select-none">
            <input type="checkbox" checked={showsChecked} onChange={onChange} />
            チェックしたものも表示する
          </label>
        </div>
        {checkList.map((isChecked, index) =>
          showsChecked || !isChecked ? (
            <div
              key={index}
              className={isChecked ? 'bg-blue-200' : ''}
              onClick={() => check(index)}
            >
              <Solve index={index} />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
