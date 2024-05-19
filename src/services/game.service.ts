import { BadRequestError } from "../responses/customApiError";
import { GameInfoAndPrices } from "../types";
import {
  compareScrapedAndIgdbGameTitle,
  includesScrapedAndIgdbGameTitle,
} from "../utils/game.utils";
import { isString } from "../utils/validation";
import {
  storeGameData,
  scrapeAllStores,
  getGameInfoFromIgdb,
} from "./gameServices/index.service";
// import { scrapeGameUrl } from "./gameServices/scrapeGameData.service";

export const findGamesPricesByName = async (
  title: string
): Promise<GameInfoAndPrices[]> => {
  if (!isString(title)) {
    throw new BadRequestError("invalid field");
  }
  const gamesPrices = await scrapeAllStores(title);

  let fetchCounter = 0;

  const resGameInfo = gamesPrices.map(async (game) => {
    fetchCounter++;
    if (fetchCounter >= 8) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      fetchCounter = 0;
    }
    const info = await getGameInfoFromIgdb(game.gameName);

    const infoGame = info.filter((el) =>
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
  await storeGameData(gameInfo);
  // todo: filtrar los juegos que no tengan informacion detallada,
  // const filterNoDataGames = gameInfo.filter((game) => game.infoGame.length > 0);

  return gameInfo;
};

export const findGameInfoByName = async (title: string): Promise<any> => {
  if (!isString(title)) {
    throw new BadRequestError("invalid field");
  }

  const gameData = await getGameInfoFromIgdb(title);

  return gameData;
};

// export const updateGamePrice = async()=>{
//   await scrapeGameUrl()
// }
