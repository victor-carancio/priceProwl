import {
  GameStoresPrices,
  GamePriceInfo,
  StoreInfo,
  InfoGame,
  AlternativeName,
} from "../types";

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

export const getGameByStorePrices = (gamesForStore: StoreInfo[]) => {
  let gameByStorePrices: GameStoresPrices[] = [];

  gamesForStore.forEach((el: StoreInfo) => {
    for (const [store, games] of Object.entries(el)) {
      games.forEach((currGame: GamePriceInfo) => {
        const {
          gameName,
          url,
          discount_percent,
          initial_price,
          final_price,
          gamepass,
        } = currGame;
        const position = gameByStorePrices.findIndex(
          (element: GameStoresPrices) => {
            return (
              element.gameName?.toLowerCase() === gameName?.toLowerCase() ||
              element.gameName?.toLowerCase() ===
                replaceSpecialEdition(gameName).toLowerCase()
            );
          }
        );

        const edition = getSpecialEdition(gameName);

        if (position === -1) {
          gameByStorePrices.push({
            gameName,
            stores: [
              {
                store,
                info: {
                  url,
                  discount_percent,
                  initial_price,
                  final_price,
                  gamepass,
                  edition: edition ? edition : "Standard",
                },
              },
            ],
          });
        } else {
          gameByStorePrices[position].stores.push({
            store,
            info: {
              url,
              discount_percent,
              initial_price,
              final_price,
              gamepass,
              edition: edition ? edition : "Standard",
            },
          });
        }
      });
    }
  });
  return gameByStorePrices;
};
