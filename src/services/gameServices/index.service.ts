import {
  scrapeAllStores,
  scrapeSpecialSales,
  featureGameScrape,
  storesPriceScrape,
} from "./scrapeGameData.service";

import {
  storeGameData,
  featureCreate,
  updateStoreGamePrice,
} from "./gameData/createOrUpdateGameData.service";
import {
  findGameByName,
  findGameById,
  findAllGames,
  findCurrOfferGames,
  findAllWishList,
  wishListToNotified,
  findEndOffer,
  getAllStoreGames,
  getCurrentGenres,
} from ".//gameData/findDataGame.service";
import { getFilter } from "./filters.service";
import { sendEmails } from "./email.service";

export {
  //scrapeGameData
  scrapeAllStores,
  scrapeSpecialSales,
  featureGameScrape,
  storesPriceScrape,

  //filter
  getFilter,

  //emailService
  sendEmails,

  //manageGameData
  storeGameData,
  featureCreate,
  updateStoreGamePrice,
  findGameByName,
  findGameById,
  findAllGames,
  findCurrOfferGames,
  findAllWishList,
  wishListToNotified,
  findEndOffer,
  getAllStoreGames,
  getCurrentGenres,
};
