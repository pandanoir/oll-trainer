export const isUnknownObject = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any
): item is Record<PropertyKey, unknown> => {
  return typeof item === 'object' && item !== null;
};
