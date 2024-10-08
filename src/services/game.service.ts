import { BadRequestError } from "../responses/customApiError";
import { GameInfoAndPrices, WishList } from "../types";
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
import cron from "node-cron";
import { scrapeAllGamesFromUrl } from "./gameServices/scrapeGameData.service";
import {
  findAllWishList,
  findEndOffer,
  wishListToNotified,
} from "./gameServices/manageGameData.service";
import { sendEmails } from "./gameServices/email.service";

// import { scrapeGameUrl } from "./gameServices/scrapeGameData.service";

export const findGamesPricesByName = async (
  title: string,
): Promise<GameInfoAndPrices[]> => {
  if (!isString(title)) {
    throw new BadRequestError("invalid field");
  }
  const gamesPrices = await scrapeAllStores(title);

  let resGameInfo: GameInfoAndPrices[] = [];

  for (const game of gamesPrices) {
    const info = await getGameInfoFromIgdb(game.gameName);

    const infoGame = info.filter((el) =>
      includesScrapedAndIgdbGameTitle(el, game),
    );

    // can return more than 1 game info

    if (infoGame.length <= 1) {
      resGameInfo = [...resGameInfo, { ...game, infoGame }];
      continue;
    }
    const correctGames = infoGame.filter((el) =>
      compareScrapedAndIgdbGameTitle(el, game),
    );

    resGameInfo = [...resGameInfo, { ...game, infoGame: correctGames }];
  }

  const gameInfo = await Promise.all(resGameInfo);
  await storeGameData(gameInfo);

  return gameInfo;
};

cron.schedule("0 */12 * * *", async () => {
  await scrapeAllGamesFromUrl();
  await offerNotification();
  await checkOfferEnd();
});

export const offerNotification = async () => {
  const usersAndInfoToNotified = await findAllWishList();

  let wishListIds: { notified: boolean; wishListId: number }[] = [];
  let userGames: WishList[] = [];

  for (const info of usersAndInfoToNotified) {
    for (const user of info.users) {
      const { email, notified, userId, userName, wishListId } = user;

      wishListIds.push({ notified, wishListId });

      const userIdIndex = userGames.findIndex(
        (userInfo: any) => userInfo.user.userId === userId,
      );

      if (userIdIndex === -1) {
        userGames.push({
          user: {
            userId,
            email,
            notified,
            userName,
          },
          games: [info.game],
        });
      } else {
        userGames[userIdIndex].games = [
          ...userGames[userIdIndex].games,
          info.game,
        ];
      }
    }
  }

  // enviar correos a userGames

  if (userGames.length > 0) {
    for (const userGame of userGames) {
      console.log(userGame.games);
      console.log(userGame.games[0].gameName);
      await sendEmails(userGame);
    }
  }

  // cambiar notified a true
  await wishListToNotified(wishListIds);

  return userGames;
};

export const checkOfferEnd = async () => {
  return await findEndOffer();
};

//todo comprobar flujo de notificacion, comprobar flujo completo
