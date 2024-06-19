// import playwright from "playwright";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import random_useragent from "random-useragent";
import { SteamStore, XboxStore, EpicStore } from "../../models/index.model";
import { GameStoresPrices, StoreInfo, StoreTypes } from "../../types";
import {
  getSpecialEdition,
  // replaceSpecialEdition,
} from "../../utils/game.utils";
import { PrismaClient, StoreGame } from "@prisma/client";
import { BadRequestError } from "../../responses/customApiError";
import { updateStoreGamePrice } from "./manageGameData.service";
import { Store } from "../../models/store.class";

const prisma = new PrismaClient();

chromium.use(StealthPlugin());

export const scrapeAllStores = async (
  title: string,
): Promise<GameStoresPrices[]> => {
  const agent = random_useragent.getRandom();
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: agent,
    // geolocation: { longitude: 12.492507, latitude: 41.889938 },
    // locale: "en-GB",
    // permissions: ["geolocation"],
    // timezoneId: "Europe/Paris",
  });
  const gamesForStore: StoreInfo[] = [];
  try {
    const page = await context.newPage();
    const stores = [new SteamStore(), new XboxStore(), new EpicStore()];

    for (const store of stores) {
      const games = await store.scrapeGames(page, title);
      gamesForStore.push(games);
    }
  } finally {
    await browser.close();
  }

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
            element.gameName?.toLowerCase() === gameName?.toLowerCase()
            // ||
            // element.gameName?.toLowerCase() ===
            //   replaceSpecialEdition(gameName).toLowerCase()
          );
        });

        const edition = getSpecialEdition(gameName);

        if (position === -1) {
          gameByStorePrices.push({
            gameName,
            stores: [
              {
                store,
                url,
                gamepass,
                edition: edition ? edition : "Standard",
                info: {
                  discount_percent,
                  initial_price,
                  final_price,
                },
              },
            ],
          });
        } else {
          gameByStorePrices[position].stores.push({
            store,
            url,
            gamepass,
            edition: edition ? edition : "Standard",
            info: {
              discount_percent,
              initial_price,
              final_price,
            },
          });
        }
      });
    }
  });

  console.log(gameByStorePrices);

  return gameByStorePrices;
};

export const scrapeAllGamesFromUrl = async () => {
  const stores: Record<StoreTypes, Store> = {
    [StoreTypes.STEAM_STORE]: new SteamStore(),
    [StoreTypes.XBOX_STORE]: new XboxStore(),
    [StoreTypes.EPIC_STORE]: new EpicStore(),
  };

  const gamesByStore = await prisma.storeGame.findMany({
    where: {
      store: "Xbox",
      game: {
        gameName: {
          mode: "insensitive",
          contains: "fallout",
        },
      },
    },
  });

  if (!gamesByStore || gamesByStore.length <= 0) {
    throw new BadRequestError("Games not found");
  }

  const agent = random_useragent.getRandom();
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: agent,
  });
  const page = await context.newPage();
  try {
    for (const gameByStore of gamesByStore) {
      const store = stores[gameByStore.store as StoreTypes];
      store.addOneToCounter();

      if (store.getStoreCounter() >= 8) {
        await page.waitForTimeout(1500);
        store.resetCounter();
      }
      const currPrice = await store.scrapePriceGameFromUrl(
        page,
        gameByStore.url,
      );

      // console.log(`${gameByStore.store} ${gameByStore.game.gameName}`);
      if (currPrice) await updateStoreGamePrice(gameByStore, currPrice);
    }
  } finally {
    await browser.close();
  }
};

export const scrapeSearchedGamesFromUrl = async (
  searchedGames: { stores: StoreGame[] }[],
) => {
  if (searchedGames && searchedGames.length > 0) {
    const stores: Record<StoreTypes, Store> = {
      [StoreTypes.STEAM_STORE]: new SteamStore(),
      [StoreTypes.XBOX_STORE]: new XboxStore(),
      [StoreTypes.EPIC_STORE]: new EpicStore(),
    };

    const agent = random_useragent.getRandom();
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: agent,
    });
    const page = await context.newPage();

    try {
      for (const gamesByStore of searchedGames) {
        for (const gameByStore of gamesByStore.stores) {
          const store = stores[gameByStore.store as StoreTypes];
          store.addOneToCounter();

          if (store.getStoreCounter() >= 8) {
            await page.waitForTimeout(1500);
            store.resetCounter();
          }
          const currPrice = await store.scrapePriceGameFromUrl(
            page,
            gameByStore.url,
          );
          // console.log(`${gameByStore.store} ${gameByStore.game.gameName}`);
          if (currPrice) await updateStoreGamePrice(gameByStore, currPrice);
        }
      }
    } finally {
      await browser.close();
    }
  }
};
