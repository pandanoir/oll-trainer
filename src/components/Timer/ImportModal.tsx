import { useContext, VFC } from 'react';
import {
  defaultVariations,
  UserDefinedVariationContext,
  Variation,
} from '../../data/variations';
import {
  migration,
  useImportFromUserData,
} from '../../features/sessionList/hooks/useSessions';
import { useI18nContext } from '../../i18n/i18n-react';
import { HiTimerDataJSON } from '../../types/HiTimerDataJSON';
import {
  isHiTimerDataJSON,
  isHiTimerDataJSONV1,
  isHiTimerDataJSONV2,
} from '../../types/HiTimerDataJSON.guard';
import { fromCsTimer } from '../../utils/fromCsTimer';
import { Modal } from '../common/Modal';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { FileInput } from './FileInput';
import 'twin.macro';

export const ImportModal: VFC<{
  onClose: () => void;
  setVariation: (variation: Variation) => void;
}> = ({ onClose, setVariation }) => {
  const importSessionCollection = useImportFromUserData();
  const { LL } = useI18nContext();
  const [, updateUserDefinedVariation] = useContext(
    UserDefinedVariationContext
  );

  return (
    <Modal onClose={onClose} ariaLabel="import data">
      <ModalCloseButton onClick={onClose} />
      <div tw="p-10">
        <span tw="flex space-x-0 space-y-2 flex-col justify-center items-center sm:flex-row sm:space-x-3 sm:space-y-0">
          <FileInput
            onChange={(text) => {
              importSessionCollection(fromCsTimer(JSON.parse(text)));
              onClose();
            }}
            onError={() => {
              alert(LL['An error occurred during import']());
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
                {LL['Import from csTimer']()}
              </SecondaryButton>
            )}
          />
          <FileInput
            onChange={(text) => {
              const givenJSON = JSON.parse(text);
              let json: HiTimerDataJSON;
              if (isHiTimerDataJSON(givenJSON)) {
                json = givenJSON;
              } else if (
                isHiTimerDataJSONV1(givenJSON) ||
                isHiTimerDataJSONV2(givenJSON)
              ) {
                json = {
                  sessions: migration(givenJSON.sessions).data,
                  settings: givenJSON.settings,
                };
              } else {
                throw new Error('invalid json');
              }

              importSessionCollection(json.sessions);
              updateUserDefinedVariation(json.settings.userDefinedVariation);
              const variation = [
                ...defaultVariations,
                ...json.settings.userDefinedVariation,
              ].find(({ name }) => name === json.settings.variation);
              if (variation) {
                setVariation(variation);
              }
              onClose();
            }}
            onError={() => {
              alert(LL['An error occurred during import']());
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
