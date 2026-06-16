export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));

export const calculateNights = (checkInDate?: string, checkOutDate?: string) => {
  if (!checkInDate || !checkOutDate) return 0;
  const diff = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
