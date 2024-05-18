// import playwright from "playwright";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import random_useragent from "random-useragent";
import { SteamStore, XboxStore, EpicStore } from "../../models/index.model";
import { GameStoresPrices, StoreInfo } from "../../types";
import {
  getSpecialEdition,
  replaceSpecialEdition,
} from "../../utils/game.utils";

chromium.use(StealthPlugin());

export const scrapeAllStores = async (
  title: string
): Promise<GameStoresPrices[]> => {
  const agent = random_useragent.getRandom();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: agent,
  });
  const page = await context.newPage();

  const stores = [new SteamStore(), new XboxStore(), new EpicStore()];
  const gamesForStore: StoreInfo[] = [];
  for (const store of stores) {
    const games = await store.scrapeGames(page, title);

    gamesForStore.push(games);
  }

  await browser.close();

  let gameByStorePrices: GameStoresPrices[] = [];

  gamesForStore.forEach((el: StoreInfo) => {
    for (const [store, games] of Object.entries(el)) {
      games.forEach((currGame) => {
        const {
          gameName,
          url,
          discount_percent,
          initial_price,
          final_price,
          gamepass,
        } = currGame;
        const position = gameByStorePrices.findIndex((element) => {
          return (
            element.gameName?.toLowerCase() === gameName?.toLowerCase() ||
            element.gameName?.toLowerCase() ===
              replaceSpecialEdition(gameName).toLowerCase()
          );
        });

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
