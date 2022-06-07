import { VFC, PropsWithChildren } from 'react';
import 'twin.macro';

export const Face: VFC<PropsWithChildren<{ className?: string }>> = ({
  children,
  className,
}) => (
  <div
    tw="grid grid-cols-3 text-gray-100 border-gray-800"
    className={className}
  >
    {children}
  </div>
);
