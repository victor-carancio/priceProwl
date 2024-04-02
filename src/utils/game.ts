const xboxStorePcReplace =
  /\b(?:for\s)?Windows|\b(?:P(?:C|\(Windows\)|\(win\)|\(Xbox & PC\)))\b/gi;

const steamReplace = /[^\x00-\x7F]/g;
export const parseUrl = (field: string, term: string) => {
  return field.trim().replace(/ /g, term);
};

export const replaceSteam = (field: string | undefined) => {
  return field?.replace(steamReplace, "").trim();
};

export const replaceXbox = (field: string | undefined) => {
  return field?.replace(xboxStorePcReplace, "").trim();
};
