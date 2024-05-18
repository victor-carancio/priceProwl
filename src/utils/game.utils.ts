import { GameStoresPrices, InfoGame, AlternativeName } from "../types";

//regex

const xboxStorePcReplace =
  /\b(?:for\s)?Windows|\b(?:P(?:C|\(Windows\)|\(win\)|\(Xbox & PC\)))\b/gi;

const steamReplace = /[^\x00-\x7F]/g;

const specialWords = [
  "deluxe edition",
  "ultimate edition",
  "gold edition",
  "goty",
  "game of the year",
  "game of the year enhanced",
  "goty edition",
  "complete edition",
  "deluxe edition",
  "ultimate edition",
  "Enhanced Edition",
  "edition",
  "DIRECTOR'S CUT",
  "Director's Cut",
];

const dinamicRegex =
  "\\b(?:" +
  specialWords.join("|").replace(/ /g, "\\s*") +
  ")\\b|\\((" +
  specialWords.join("|").replace(/ /g, "\\s*") +
  ")\\)|\\((?!\\d+\\))(?:[^)]+)?";

const specialEditionRegexV2 = new RegExp(dinamicRegex, "gi");

//string manipulation

export const parseTitle = (field: string) => {
  return field.trim();
};

export const parseUrl = (field: string, term: string) => {
  return field.trim().replace(/ /g, term);
};

export const replaceSteam = (field: string) => {
  return field?.replace(steamReplace, "").trim();
};

export const replaceXbox = (field: string) => {
  return field?.replace(xboxStorePcReplace, "").trim();
};

export const replaceSpecialEdition = (currGame: string) => {
  return currGame
    .replace(specialEditionRegexV2, "")
    .replace(/:\s*/g, " ")
    .trim();
};

export const getSpecialEdition = (currGame: string) => {
  const specialMatch = currGame.match(specialEditionRegexV2)?.toString();
  return specialMatch;
};

//data procesing

// export const isSpecialEdition = (element: any, gameName: string): boolean => {
//   return (
//     element.gameName.toLowerCase() ===
//     replaceSpecialEdition(gameName).toLowerCase()
//   );
// };

export const includesScrapedAndIgdbGameTitle = (
  igdbGame: InfoGame,
  scrapedGame: GameStoresPrices
): boolean => {
  return (
    igdbGame.name
      ?.toLowerCase()
      .includes(scrapedGame.gameName.toLocaleLowerCase()) ||
    scrapedGame.gameName
      ?.toLocaleLowerCase()
      .includes(igdbGame.name?.toLowerCase()) ||
    scrapedGame.gameName
      ?.toLocaleLowerCase()
      .includes(igdbGame.name?.toLowerCase().replace(/:\s*/g, " ").trim()) ||
    igdbGame.alternative_names?.some((alternative_name: AlternativeName) =>
      scrapedGame.gameName
        .toLowerCase()
        .includes(alternative_name.name?.toLowerCase())
    )
  );
};

export const compareScrapedAndIgdbGameTitle = (
  igdbGame: InfoGame,
  scrapedGame: GameStoresPrices
): boolean => {
  return (
    igdbGame.name?.toLowerCase() === scrapedGame.gameName.toLowerCase() ||
    igdbGame.alternative_names?.some((alternative_name: AlternativeName) => {
      return (
        scrapedGame.gameName.toLowerCase() ===
        alternative_name.name?.toLowerCase()
      );
    })
  );
};
//borrar
