export const ellipsisAddress = (
  address,
  prefixLength = 10,
  suffixLength = 3,
) => {
  return `${address.substr(0, prefixLength)}...${address.substr(
    address.length - suffixLength,
    suffixLength,
  )}`;
};
