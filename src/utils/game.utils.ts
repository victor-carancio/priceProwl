// import { EpicStore, SteamStore, XboxStore } from "../models/index.model";
import { EpicStore } from "../models/official-stores/epic.class";
import { SteamStore } from "../models/official-stores/steam.class";
import { XboxStore } from "../models/official-stores/xbox.class";
import { Store } from "../models/store.class";
import {
  GameStoresPrices,
  InfoGame,
  AlternativeName,
  StoreTypes,
} from "../types";

//regex

// const xboxStorePcReplace =
//   /\b(?:for\s)?Windows|\b(?:P(?:C|\(Windows\)|\(win\)|\(Xbox & PC\)))\b/gi;

function createDynamicRegex(terms: string[]) {
  // Escapar caracteres especiales en los términos y reemplazar espacios con \s*
  const escapedTerms = terms.map((term) =>
    term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s*"),
  );
  // Unir los términos en un solo patrón de regex, manejando los espacios opcionales y alternancias
  const pattern = "\\b(?:" + escapedTerms.join("|") + ")\\b|\\s*\\([^)]*\\)";
  return new RegExp(pattern, "gi");
}

// Lista de términos
const termsDinamicXbox = [
  "windows",
  "(windows)",
  "for windows",
  "(PC)",
  "PC",
  "win",
  "(win)",
  "(xbox & pc)",
  "for pc",
  "(for pc)",
  " - pc",
];

// Crear el regex dinámico
const xboxStorePcReplace = createDynamicRegex(termsDinamicXbox);

const steamReplace = /[^\x00-\x7F]/g;

const specialWords = [
  "deluxe edition",
  "ultimate edition",
  "gold edition",
  "goty",
  "game of the year",
  "game of the year edition",
  "game of the year enhanced",
  "goty edition",
  "complete edition",
  "definitive edition",
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
  return field
    .trim()
    .replace(/&/g, "") // Elimina todos los '&' del texto
    .replace(/ +/g, " ") // Asegura que no queden espacios dobles
    .replace(/ /g, term);
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
  const specialMatches = currGame.match(specialEditionRegexV2);

  if (!specialMatches || specialMatches.length <= 0) return null;
  return specialMatches.map((match) => match.trim()).join(" ");
};

export const unixTimeStampToIsoString = (unixTimeStamp: number) => {
  const date = new Date(unixTimeStamp * 1000);

  const isoString = date.toISOString();

  return isoString;
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
  scrapedGame: GameStoresPrices,
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
        .includes(alternative_name.name?.toLowerCase()),
    )
  );
};

export const compareScrapedAndIgdbGameTitle = (
  igdbGame: InfoGame,
  scrapedGame: GameStoresPrices,
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
export const stores: Record<StoreTypes, Store> = {
  [StoreTypes.STEAM_STORE]: new SteamStore(),
  [StoreTypes.XBOX_STORE]: new XboxStore(),
  [StoreTypes.EPIC_STORE]: new EpicStore(),
};

//borrar
export const calculateDiscountPercent = (
  initial_price: string,
  final_price: string,
) => {
  const initial = Number(initial_price?.replace("+", ""));
  const final = Number(final_price?.replace("+", ""));

  const discount: number = (initial / final) * 100 - 100;
  return discount.toFixed(0);
};
