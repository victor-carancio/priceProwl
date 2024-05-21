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
import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../../responses/customApiError";
import { updateStoreGamePrice } from "./storeGameData.service";

const prisma = new PrismaClient();

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

  return gameByStorePrices;
};

export const scrapeGameUrl = async () => {
  // const stores = [new SteamStore(), new XboxStore(), new EpicStore()];
  const steam = new SteamStore();

  const gamesByStore = await prisma.storeGame.findMany({
    where: {
      store: "Steam",
      // id: 1,
    },
    include: {
      game: true,
      info: true,
    },
  });

  // console.log(gamesByStore);

  const agent = random_useragent.getRandom();
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: agent,
  });
  const page = await context.newPage();

  if (!gamesByStore || gamesByStore.length <= 0) {
    throw new BadRequestError("Games not found");
  }

  let steamCounter = 0;

  for (const gameByStore of gamesByStore) {
    steamCounter++;
    if (steamCounter >= 8) {
      await page.waitForTimeout(1500);
      steamCounter = 0;
    }
    const currPrice = await steam.scrapePriceGameFromUrl(page, gameByStore.url);
    await updateStoreGamePrice(gameByStore, currPrice);
    console.log(`${gameByStore.game.gameName} ${gameByStore.edition} updated`);
  }

  await browser.close();
};
