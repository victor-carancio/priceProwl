import { ShortFinalFormat } from "./../utils/types";
import { sortByPrice } from "./../utils/manageGameData.utils";
import { SortFilters } from "./../types";
import { BadRequestError } from "../responses/customApiError";
import {
  GameInfoAndPrices,
  //email service
  // WishList,
} from "../types";

import { isString } from "../utils/validation";
import {
  featureCreate,
  findGamesByFilters,
  findGameByName,
  getFilter,
  scrapeAllStores,
  scrapeSpecialSales,
  storeGameData,
  //email service
  // wishListToNotified,
  // findAllWishList,
  // findEndOffer,
  // sendEmails,
} from "./gameServices/index.service";
import cron from "node-cron";
import { getSort } from "./gameServices/filters.service";
import { scrapeFreeEpicSales } from "./gameServices/scrapeGameData.service";
import { freeEpicCreate } from "./gameServices/gameData/createOrUpdateGameData.service";

// import { sendEmails } from "./gameServices/email.service";

// from scraper
export const findGamesPricesByName = async (
  title: string,
): Promise<GameInfoAndPrices[]> => {
  if (!isString(title)) {
    throw new BadRequestError("invalid field");
  }
  const gamesPrices = await scrapeAllStores(title);

  await storeGameData(gamesPrices);

  return gamesPrices;
};

export const findGamesByNameFromDb = async (
  title: string,
  filters: {
    sort?: string;
    order?: string;
  },
) => {
  let orderBy = {};

  if (filters.sort === SortFilters.ALPHABETICAL) {
    orderBy = getFilter(filters) || { gameName: "asc" };
  }

  const games = await findGameByName(title, orderBy);

  if (filters.sort === SortFilters.PRICE || (!filters.sort && !filters.order)) {
    return sortByPrice(games as ShortFinalFormat[], filters.order);
  }
  return games;
};

export const findAllGamesAndFilters = async (filters: {
  category?: string;
  genre?: string;
  sort?: string;
  order?: string;
  page?: string;
  limit?: string;
}) => {
  const where = getFilter(filters);

  let orderBy = {};

  if (filters.sort === SortFilters.ALPHABETICAL) {
    orderBy = getSort(filters) || { gameName: "asc" };
  }

  const page = parseInt(filters.page as string) || 1;
  const limit = parseInt(filters.limit as string) || 10;

  const allGames = await findGamesByFilters({ where, orderBy });
  // return allGames;

  if (filters.sort === SortFilters.PRICE || (!filters.sort && !filters.order)) {
    const orderByPriceGames = [
      ...sortByPrice(allGames as ShortFinalFormat[], filters.order),
    ];

    return {
      currentPage: page,
      totalPages: Math.ceil(orderByPriceGames.length / limit),
      totalGames: orderByPriceGames.length,
      games: orderByPriceGames.slice((page - 1) * limit, page * limit),
    };
  }

  return {
    currentPage: page,
    totalPages: Math.ceil(allGames.length / limit),
    totalGames: allGames.length,
    games: allGames.slice((page - 1) * limit, page * limit),
  };
};

cron.schedule("0 4 * * *", async () => {
  await featuredGamesCheck();
  await EpicFreeGamesCheck();

  //Todo: notificacion por correo
  // await offerNotification();
  // await checkOfferEnd();
});

cron.schedule("0 16 * * *", async () => {
  await EpicFreeGamesCheck();
});

export const featuredGamesCheck = async () => {
  const feature = await scrapeSpecialSales();
  await featureCreate(feature);
};

export const EpicFreeGamesCheck = async () => {
  const freeGames = await scrapeFreeEpicSales();

  await freeEpicCreate(freeGames);
};

// export const offerNotification = async () => {
//   const usersAndInfoToNotified = await findAllWishList();

//   let wishListIds: { notified: boolean; wishListId: number }[] = [];
//   let userGames: WishList[] = [];

//   for (const info of usersAndInfoToNotified) {
//     for (const user of info.users) {
//       const { email, notified, userId, userName, wishListId } = user;

//       wishListIds.push({ notified, wishListId });

//       const userIdIndex = userGames.findIndex(
//         (userInfo: any) => userInfo.user.userId === userId,
//       );

//       if (userIdIndex === -1) {
//         userGames.push({
//           user: {
//             userId,
//             email,
//             notified,
//             userName,
//           },
//           games: [info.game],
//         });
//       } else {
//         userGames[userIdIndex].games = [
//           ...userGames[userIdIndex].games,
//           info.game,
//         ];
//       }
//     }
//   }

//   // enviar correos a userGames

//   if (userGames.length > 0) {
//     for (const userGame of userGames) {
//       console.log(userGame.games);
//       console.log(userGame.games[0].gameName);
//       await sendEmails(userGame);
//     }
//   }

//   // cambiar notified a true
//   await wishListToNotified(wishListIds);

//   return userGames;
// };

// export const checkOfferEnd = async () => {
//   return await findEndOffer();
// };
