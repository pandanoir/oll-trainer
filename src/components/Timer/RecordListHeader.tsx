import 'twin.macro';
export const RecordListHeader = ({
  left,
  right,
}: {
  left: JSX.Element;
  right: JSX.Element;
}) => {
  return (
    <div tw="sticky top-0 bg-white flex justify-between">
      {left}
      {right}
    </div>
  );
};
