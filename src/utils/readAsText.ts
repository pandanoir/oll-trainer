export const readAsText = async (file: File) => {
  const reader = new FileReader();
  reader.readAsText(file);
  await new Promise((resolve) => (reader.onload = resolve));
  return reader.result as string;
};
