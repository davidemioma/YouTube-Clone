export const numberFormatter = (num: number | undefined) => {
  if (num === undefined) return;

  let newNumber = "";

  if (num >= 1000000000) {
    newNumber = (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    newNumber = (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    newNumber = (num / 1000).toFixed(1) + "K";
  } else {
    newNumber = `${num}`;
  }

  return newNumber;
};

export const uploadFileHandler = (e: React.FormEvent, setSelectedFile: any) => {
  const reader = new FileReader();

  const file = (e.target as HTMLFormElement).files[0];

  reader.readAsDataURL(file);

  reader.onload = (readerEvent) => {
    setSelectedFile(readerEvent.target?.result);
  };
};
