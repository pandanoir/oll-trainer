import 'twin.macro';
export const RecordListHeader = ({
  left,
  right,
}: {
  left: JSX.Element;
  right: JSX.Element;
}) => {
  return (
    <div tw="w-full bg-white flex justify-between z-10">
      {left}
      {right}
    </div>
  );
};
