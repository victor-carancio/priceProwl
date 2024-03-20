export const parseUrl = (field: string, term: string) => {
  return field.trim().replace(/ /g, term);
};
