import { faPlusCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { VFC, useContext, PropsWithChildren, useState } from 'react';
import tw from 'twin.macro';
import {
  Variation,
  availableScrambles,
  UserDefinedVariationContext,
  defaultVariations,
  Scramble,
} from '../../data/variations';
import { useInput } from '../../utils/hooks/useInput';
import { IconButton } from '../common/IconButton';
import { Modal } from '../common/Modal';
import { ModalCloseButton } from '../common/ModalCloseButton';

const ScrambleTypeSelect = tw.select`bg-transparent px-2`;

const AddForm: VFC<{ onAddClick: (arg: Variation) => void }> = ({
  onAddClick: on,
}) => {
  const { value: selectedScrambleType, onChange: onChangeSelect } = useInput(
    availableScrambles[0]
  );
  const { value: newVariationName, onChange: onChangeInput } = useInput('');
  const [userDefinedVariation] = useContext(UserDefinedVariationContext);
  return (
    <li tw="pl-3 pb-1 pt-3 lg:mr-6 text-lg border-b flex space-x-2 justify-between items-center">
      <span tw="flex-1">
        <input
          placeholder="name"
          tw="bg-transparent"
          value={newVariationName}
          onChange={onChangeInput}
        />
        (scramble:
        <ScrambleTypeSelect
          value={selectedScrambleType}
          onChange={onChangeSelect}
        >
          {availableScrambles.map((scrambleType) => (
            <option tw="text-black" value={scrambleType} key={scrambleType}>
              {scrambleType}
            </option>
          ))}
        </ScrambleTypeSelect>
        )
      </span>
      <IconButton
        icon={faPlusCircle}
        title="create variation"
        tw="text-xl disabled:opacity-40 disabled:cursor-auto"
        disabled={
          newVariationName === '' ||
          defaultVariations.some(({ name }) => name === newVariationName) ||
          userDefinedVariation.some(({ name }) => name === newVariationName)
        }
        onClick={() => {
          on({
            name: newVariationName,
            scramble: selectedScrambleType as Scramble, // ここ、メチャクチャ頑張ればassertionを使わずに済みそうだけど、絶対労力に見合わないのでこれでいいや
          });
        }}
      />
    </li>
  );
};
export const VariationModal: VFC<
  PropsWithChildren<{ onClose: () => void }>
> = ({ onClose, children }) => {
  const [showsAddForm, setShowsAddForm] = useState(false);
  const [, updateUserDefinedVariation] = useContext(
    UserDefinedVariationContext
  );

  return (
    <Modal
      tw="lg:inset-x-1/4 lg:w-1/2"
      onClose={onClose}
      ariaLabel="variation list of event"
    >
      <ModalCloseButton onClick={onClose} />
      <div tw="flex flex-col px-3.5 py-5 space-y-2 h-full">
        <div tw="flex space-x-2">
          <span tw="text-3xl">Variation of event</span>
          <IconButton
            icon={faPlus}
            title="add variation"
            tw="px-2.5 my-1.5 text-lg text-white bg-gray-700 rounded"
            onClick={() => setShowsAddForm(true)}
          />
        </div>
        <div>
          {showsAddForm && (
            <ul>
              <AddForm
                onAddClick={(newVariation) => {
                  updateUserDefinedVariation((arr) => {
                    arr.push(newVariation);
                  });
                  setShowsAddForm(false);
                }}
              />
            </ul>
          )}
          {children}
        </div>
      </div>
    </Modal>
  );
};
