import { VFC, useContext } from 'react';
import tw from 'twin.macro';

import { CheckContext } from '../utils/hooks/useCheck';
import { useCheckbox } from '../utils/hooks/useCheckbox';
import { Modal } from './common/Modal';
import { ModalCloseButton } from './common/ModalCloseButton';
import { Solve } from './Solve';

export const ListModal: VFC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { checkList, check } = useContext(CheckContext);
  const [showsChecked, onChange] = useCheckbox();

  return (
    <Modal onClose={onClose} ariaLabel="check list of OLL">
      <ModalCloseButton onClick={onClose} />
      <div
        css={[
          tw`absolute p-2 overflow-y-scroll inset-2`,
          tw`grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`,
        ]}
      >
        <div>
          <label tw="select-none">
            <input type="checkbox" checked={showsChecked} onChange={onChange} />
            チェックしたものも表示する
          </label>
        </div>
        {checkList.map((isChecked, index) =>
          showsChecked || !isChecked ? (
            <div
              key={index}
              css={isChecked ? tw`bg-blue-300` : ''}
              onClick={() => check(index)}
            >
              <Solve index={index} />
            </div>
          ) : null
        )}
      </div>
    </Modal>
  );
};
