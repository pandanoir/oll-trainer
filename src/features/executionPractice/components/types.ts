export type Numbering = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string
][];
export type FaceColor = {
  [key in 'U' | 'L' | 'F' | 'R' | 'D' | 'B']:
    | 'white'
    | 'green'
    | 'red'
    | 'blue'
    | 'orange'
    | 'yellow';
};
