import immer from 'immer';
import { VFC, useState } from 'react';
import tw from 'twin.macro';
import { PrimaryButton } from '../../../components/common/PrimaryButton';
import { SecondaryButton } from '../../../components/common/SecondaryButton';
import { SecondaryDangerButton } from '../../../components/common/SecondaryDangerButton';
import { useI18nContext } from '../../../i18n/i18n-react';
import { Cubelet } from './Cubelet';
import { Face } from './Face';
import { NetDrawing } from './NetDrawing';
import { FaceColor, Numbering } from './types';

export const numberingPresets: Numbering[] = [
  [
    ['あ', 'あ', 'た', 'か', '', 'さ', 'え', 'え', 'て'],
    ['な', 'な', 'ね', 'に', '', 'ね', 'に', 'ぬ', 'ぬ'],
    ['け', 'て', 'せ', 'け', '', 'せ', 'く', 'つ', 'す'],
    ['れ', 'ら', 'ら', 'れ', '', 'り', 'る', 'る', 'り'],
    ['う', 'う', 'つ', 'く', '', 'す', 'い', 'い', 'ち'],
    ['き', 'ち', 'し', 'き', '', 'し', 'か', 'た', 'さ'],
  ],
  [
    ['え', 'あ', 'あ', 'え', '', 'い', 'う', 'う', 'い'],
    ['て', 'た', 'た', 'て', '', 'ち', 'つ', 'つ', 'ち'],
    ['せ', 'さ', 'さ', 'せ', '', 'し', 'す', 'す', 'し'],
    ['め', 'ま', 'ま', 'め', '', 'み', 'む', 'む', 'み'],
    ['れ', 'ら', 'ら', 'れ', '', 'り', 'る', 'る', 'り'],
    ['き', 'く', 'く', 'き', '', 'け', 'か', 'か', 'け'],
  ],
];
const oppositeColorDict = {
  white: 'yellow',
  green: 'blue',
  red: 'orange',
  blue: 'green',
  orange: 'red',
  yellow: 'white',
} as const;
const getFaceColor = (
  u: FaceColor['U'],
  f: FaceColor['F']
): FaceColor | null => {
  const [normalizedU, normalizedF] =
    u === 'yellow' || u === 'blue' || u === 'orange'
      ? [oppositeColorDict[u], oppositeColorDict[f]]
      : [u, f]; // これで normalizedU は白緑赤のいずれかになった
  const l = (
    {
      white: {
        green: 'orange',
        red: 'green',
        blue: 'red',
        orange: 'blue',
      },
      green: {
        white: 'red',
        red: 'yellow',
        yellow: 'orange',
        orange: 'white',
      },
      red: {
        white: 'blue',
        blue: 'yellow',
        yellow: 'green',
        green: 'white',
      },
    } as const
  )[normalizedU][normalizedF];
  if (typeof l === 'undefined') {
    return null;
  }
  return {
    U: u,
    L: l,
    F: f,
    R: oppositeColorDict[l],
    D: oppositeColorDict[u],
    B: oppositeColorDict[f],
  };
};
const CubeletInput = tw.input`w-4 bg-transparent`;

export const CubeSettingMode: VFC<{
  currentNumbering: Numbering;
  currentFaceColor: FaceColor;
  onFinish: (newNumbering: Numbering, newFaceColor: FaceColor) => void;
  onCancel: () => void;
}> = ({ currentNumbering, currentFaceColor, onFinish, onCancel }) => {
  const { LL } = useI18nContext();
  const [numbering, setNumbering] = useState<Numbering>(currentNumbering);

  const updateNumbering = (face: number, index: number, newValue: string) => {
    setNumbering(
      immer((draft) => {
        draft[face][index] = newValue;
      })
    );
  };
  const [uFaceColor, setUFaceColor] = useState<FaceColor['U']>(
    currentFaceColor.U
  );
  const [fFaceColor, setFFaceColor] = useState<FaceColor['F']>(
    currentFaceColor.F
  );
  const isValidFaceColor =
    uFaceColor !== fFaceColor && oppositeColorDict[uFaceColor] !== fFaceColor;
  const faceColor: FaceColor = isValidFaceColor
    ? (getFaceColor(uFaceColor, fFaceColor) as FaceColor) // valid でない場合に null がくる想定なので assertion 使って OK
    : {
        U: 'white',
        L: 'white',
        F: 'white',
        R: 'white',
        D: 'white',
        B: 'white',
      };
  return (
    <div tw="flex flex-col gap-y-3">
      {LL['click and change labels']()}
      <div tw="w-max">
        <div tw="flex justify-center">
          <Face tw="border-t border-l">
            {numbering[0].slice(0, 6).map((char, index) => (
              <Cubelet color={faceColor.U} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(0, index, value)
                  }
                />
              </Cubelet>
            ))}
            <Cubelet color={faceColor.U} tw="border-b-0">
              <CubeletInput
                value={numbering[0][6]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 6, value)
                }
              />
            </Cubelet>
            <Cubelet color={faceColor.U} tw="border-b-0">
              <CubeletInput
                value={numbering[0][7]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 7, value)
                }
              />
            </Cubelet>
            <Cubelet color={faceColor.U} tw="border-b-0">
              <CubeletInput
                value={numbering[0][8]}
                onChange={({ target: { value } }) =>
                  updateNumbering(0, 8, value)
                }
              />
            </Cubelet>
          </Face>
        </div>
        <div tw="flex border-t border-gray-800">
          <Face tw="border-l">
            {numbering[1].map((char, index) => (
              <Cubelet color={faceColor.L} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(1, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
          <Face>
            {numbering[2].map((char, index) => (
              <Cubelet color={faceColor.F} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(2, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
          <Face>
            {numbering[3].map((char, index) => (
              <Cubelet color={faceColor.R} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(3, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
        </div>
        <div tw="flex justify-center">
          <Face tw="border-l">
            {numbering[4].map((char, index) => (
              <Cubelet color={faceColor.D} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(4, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
        </div>
        <div tw="flex justify-center">
          <Face tw="border-l">
            {numbering[5].map((char, index) => (
              <Cubelet color={faceColor.B} key={index}>
                <CubeletInput
                  value={char}
                  onChange={({ target: { value } }) =>
                    updateNumbering(5, index, value)
                  }
                />
              </Cubelet>
            ))}
          </Face>
        </div>
      </div>
      <details>
        <summary>{LL['choose from presets']()}</summary>
        <ul tw="flex gap-x-3">
          {numberingPresets.map((preset, index) => (
            <li tw="text-center" key={index}>
              <NetDrawing numbering={preset} faceColor={faceColor} />
              <SecondaryButton onClick={() => setNumbering(preset)}>
                {LL['use this preset']()}
              </SecondaryButton>
            </li>
          ))}
        </ul>
      </details>
      <div>
        U面:{' '}
        <select
          tw="text-black"
          value={uFaceColor}
          onChange={({ target: { value } }) =>
            setUFaceColor(value as FaceColor['U'])
          }
        >
          {['white', 'orange', 'green', 'red', 'yellow', 'blue'].map(
            (color) => (
              <option key={color}>{color}</option>
            )
          )}
        </select>
        <br />
        F面:
        <select
          tw="text-black"
          value={fFaceColor}
          onChange={({ target: { value } }) =>
            setFFaceColor(value as FaceColor['F'])
          }
        >
          {['white', 'orange', 'green', 'red', 'yellow', 'blue'].map(
            (color) => (
              <option key={color}>{color}</option>
            )
          )}
        </select>
        {!isValidFaceColor && 'invalid color pattern!'}
      </div>
      <div tw="flex gap-3">
        <PrimaryButton
          disabled={!isValidFaceColor}
          onClick={() => {
            onFinish(numbering, faceColor);
          }}
        >
          {LL['save setting']()}
        </PrimaryButton>
        <SecondaryDangerButton
          tw="w-max"
          onClick={() => {
            if (numbering === currentNumbering || confirm('discard changes?'))
              onCancel();
          }}
        >
          {LL['back to practice without save setting']()}
        </SecondaryDangerButton>
      </div>
    </div>
  );
};
