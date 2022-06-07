import { VFC } from 'react';
import { Cubelet } from './Cubelet';
import { Face } from './Face';
import { Numbering } from './types';
import 'twin.macro';

export const NetDrawing: VFC<{
  numbering?: Numbering;
  selected?: { face: string; index: number }[];
  faceColor: {
    [k in 'U' | 'L' | 'F' | 'R' | 'D' | 'B']:
      | 'white'
      | 'green'
      | 'red'
      | 'blue'
      | 'orange'
      | 'yellow';
  };
}> = ({
  numbering = [
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
  ],
  selected,
  faceColor,
}) => {
  const isSelected = (targetFace: string, targetIndex: number) =>
    !!selected &&
    typeof selected
      .filter(({ face }) => face === targetFace)
      .find(({ index }) => index === targetIndex) !== 'undefined';
  return (
    <div tw="w-max">
      <div tw="flex justify-center">
        <Face tw="border-t border-l">
          {numbering[0].slice(0, 6).map((char, index) => (
            <Cubelet
              color={faceColor.U}
              key={index}
              selected={isSelected('U', index)}
            >
              {char}
            </Cubelet>
          ))}
          <Cubelet
            color={faceColor.U}
            tw="border-b-0"
            selected={isSelected('U', 6)}
          >
            {numbering[0][6]}
          </Cubelet>
          <Cubelet
            color={faceColor.U}
            tw="border-b-0"
            selected={isSelected('U', 7)}
          >
            {numbering[0][7]}
          </Cubelet>
          <Cubelet
            color={faceColor.U}
            tw="border-b-0"
            selected={isSelected('U', 8)}
          >
            {numbering[0][8]}
          </Cubelet>
        </Face>
      </div>
      <div tw="flex border-t border-gray-800">
        <Face tw="border-l">
          {numbering[1].map((char, index) => (
            <Cubelet
              color={faceColor.L}
              key={index}
              selected={isSelected('L', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
        <Face>
          {numbering[2].map((char, index) => (
            <Cubelet
              color={faceColor.F}
              key={index}
              selected={isSelected('F', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
        <Face>
          {numbering[3].map((char, index) => (
            <Cubelet
              color={faceColor.R}
              key={index}
              selected={isSelected('R', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
      </div>
      <div tw="flex justify-center">
        <Face tw="border-l">
          {numbering[4].map((char, index) => (
            <Cubelet
              color={faceColor.D}
              key={index}
              selected={isSelected('D', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
      </div>
      <div tw="flex justify-center">
        <Face tw="border-l">
          {numbering[5].map((char, index) => (
            <Cubelet
              color={faceColor.B}
              key={index}
              selected={isSelected('B', index)}
            >
              {char}
            </Cubelet>
          ))}
        </Face>
      </div>
    </div>
  );
};
