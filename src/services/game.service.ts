import { BadRequestError } from "../responses/customApiError";
import { GameStoresPrices, InfoGame } from "../types";
import {
  compareScrapedAndIgdbGameTitle,
  includesScrapedAndIgdbGameTitle,
} from "../utils/game.utils";
import { isString } from "../utils/validation";
import { getGameInfoFromIgdb } from "./gettingData.service";
import { scraper } from "./scrapingData.service";

export const findGamesPricesByName = async (
  title: string
): Promise<GameStoresPrices[]> => {
  if (!isString(title)) {
    throw new BadRequestError("invalid field");
  }
  const gamesPrices = await scraper(title);

  const resGameInfo = gamesPrices.map(async (game: GameStoresPrices) => {
    const info = await getGameInfoFromIgdb(game.gameName);

    const infoGame = info.filter((el: InfoGame) =>
      includesScrapedAndIgdbGameTitle(el, game)
    );

    // can return more than 1 game info
    if (infoGame.length <= 1) {
      return { ...game, infoGame };
    }
    const correctGames = infoGame.filter((el) =>
      compareScrapedAndIgdbGameTitle(el, game)
    );

    return { ...game, infoGame: correctGames };
  });
  const gameInfo = await Promise.all(resGameInfo);
  return gameInfo;
};

export const findGameInfoByName = async (title: string): Promise<any> => {
  if (!isString(title)) {
    throw new BadRequestError("invalid field");
  }

  const gameData = await getGameInfoFromIgdb(title);

  return gameData;
};

// export const findOneGameByName = async (title: string): Promise<steamPrice> => {
//   if (!isString(title)) {
//     throw new BadRequestError("invalid field");
//   }

//   const gameData = await getDataFromUrl(title);
//   const { name, steam_appid, header_image, price_overview } = gameData[0].data;

//   return { name, steam_appid, header_image, price_overview };
// };
