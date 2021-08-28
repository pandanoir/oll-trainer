import { useContext, VFC } from 'react';
import { useIntl } from 'react-intl';
import {
  defaultVariations,
  UserDefinedVariationContext,
  Variation,
} from '../../data/variations';
import { isHiTimerDataJSON } from '../../types/HiTimerDataJSON.guard';
import { fromCsTimer } from '../../utils/fromCsTimer';
import { Modal } from '../common/Modal';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { FileInput } from './FileInput';
import { SessionCollection } from './timeData';
import 'twin.macro';

export const ImportModal: VFC<{
  onClose: () => void;
  importSessionCollection: (data: SessionCollection) => void;
  setVariation: (variation: Variation) => void;
}> = ({ onClose, importSessionCollection, setVariation }) => {
  const { formatMessage } = useIntl();
  const [, updateUserDefinedVariation] = useContext(
    UserDefinedVariationContext
  );

  return (
    <Modal onClose={onClose}>
      <ModalCloseButton onClick={onClose} />
      <div tw="p-10">
        <span tw="flex space-x-0 space-y-2 flex-col justify-center items-center sm:flex-row sm:space-x-3 sm:space-y-0">
          <FileInput
            onChange={(text) => {
              importSessionCollection(fromCsTimer(JSON.parse(text)));
              onClose();
            }}
            onError={() => {
              alert(
                formatMessage({
                  id: 'paDr7J',
                  description:
                    'アラートメッセージ。インポート中にエラーが出たときに表示するメッセージ。',
                  defaultMessage: 'インポート中にエラーが発生しました',
                })
              );
            }}
            button={(onClick) => (
              <SecondaryButton
                tw="w-max"
                onClick={() => {
                  if (
                    confirm(
                      'インポートすると、現在のセッション情報がすべて消去されます。インポートしますか?'
                    )
                  ) {
                    onClick();
                  }
                }}
              >
                csTimer からインポート
              </SecondaryButton>
            )}
          />
          <FileInput
            onChange={(text) => {
              const data = JSON.parse(text);
              if (!isHiTimerDataJSON(data)) {
                throw new Error('invalid json');
              }

              importSessionCollection(data.sessions);
              updateUserDefinedVariation(data.settings.userDefinedVariation);
              const variation = [
                ...defaultVariations,
                ...data.settings.userDefinedVariation,
              ].find(({ name }) => name === data.settings.variation);
              if (variation) {
                setVariation(variation);
              }
              onClose();
            }}
            onError={() => {
              alert(
                formatMessage({
                  id: 'paDr7J',
                  description:
                    'アラートメッセージ。インポート中にエラーが出たときに表示するメッセージ。',
                  defaultMessage: 'インポート中にエラーが発生しました',
                })
              );
            }}
            button={(onClick) => (
              <SecondaryButton
                tw="w-max"
                onClick={() => {
                  if (
                    confirm(
                      'インポートすると、現在のセッション情報がすべて消去されます。インポートしますか?'
                    )
                  ) {
                    onClick();
                  }
                }}
              >
                Hi-Timer からインポート
              </SecondaryButton>
            )}
          />
        </span>
      </div>
    </Modal>
  );
};
