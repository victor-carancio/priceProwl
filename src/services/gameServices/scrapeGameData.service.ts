import { SteamStore, XboxStore, EpicStore } from "../../models/index.model";
import { GameStoresPrices, StoreInfo, StoreTypes } from "../../types";
import { getSpecialEdition, stores } from "../../utils/game.utils";

import { BadRequestError } from "../../responses/customApiError";
import {
  getAllStoreGames,
  updateStoreGamePrice,
} from "./manageGameData.service";
// import { StoreGame } from "@prisma/client";

export const scrapeAllStores = async (term: string) => {
  const stores = [new SteamStore(), new XboxStore(), new EpicStore()];

  const gamesForStore: StoreInfo[] = [];

  for (const store of stores) {
    const data = await store.scrapeGamesFromSearch(term, "CL");
    gamesForStore.push(data);
  }

  const gameByStorePrices: GameStoresPrices[] = [];

  for (const storeType of gamesForStore) {
    const { store, storeInfo, type } = storeType;

    for (const game of storeInfo) {
      const {
        gameName,
        storeId,
        url,
        imgStore,
        currency,
        initial_price,
        final_price,
        discount_percent,
        gamepass,
      } = game;

      const position = gameByStorePrices.findIndex((element) => {
        return element.gameName?.toLowerCase() === gameName?.toLowerCase();
      });

      const edition = getSpecialEdition(gameName);

      if (position === -1) {
        gameByStorePrices.push({
          gameName,
          stores: [
            {
              store,
              type,
              storeIdGame: storeId,
              url,
              imgStore,
              gamepass,
              edition: edition ? edition : "Standard",
              info: {
                discount_percent,
                initial_price,
                final_price,
                currency,
              },
            },
          ],
        });
      } else {
        gameByStorePrices[position].stores.push({
          store,
          type,
          storeIdGame: storeId,
          url,
          imgStore,
          gamepass,
          edition: edition ? edition : "Standard",
          info: {
            discount_percent,
            initial_price,
            final_price,
            currency,
          },
        });
      }
    }
  }
  return gameByStorePrices;
};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const scrapeAllGamesFromUrl = async () => {
  const gamesByStore = await getAllStoreGames();
  if (!gamesByStore || gamesByStore.length <= 0) {
    throw new BadRequestError("Games not found");
  }

  let timer = 0;
  for (const gameByStore of gamesByStore) {
    timer++;
    const store = stores[gameByStore.store as StoreTypes];
    if (timer >= 25) {
      console.log("pausa");
      await delay(1000 * 46);
      console.log("continua");
      timer = 0;
    }
    const currPrice = await store.scrapeGameFromUrl(gameByStore.storeIdGame);
    console.log(gameByStore.game.gameName);
    if (currPrice) await updateStoreGamePrice(gameByStore, currPrice);
  }
};
