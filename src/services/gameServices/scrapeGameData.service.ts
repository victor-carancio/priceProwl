// import { InfoGame } from "./../../types";
// import { SteamStore, XboxStore, EpicStore } from "../../models/index.model";
import {
  FeaturedGameDetail,
  GameStoresPrices,
  StoreInfo,
  StoreTypes,
} from "../../types";
import { getSpecialEdition, stores } from "../../utils/game.utils";

import { BadRequestError } from "../../responses/customApiError";

// import { SteamStore } from "../../models/official-stores/steam.class";
// import { XboxStore } from "../../models/official-stores/xbox.class";
// import { EpicStore } from "../../models/official-stores/epic.class";
import { getAllStoreGames, updateStoreGamePrice } from "./index.service";
import { EpicStore, SteamStore, XboxStore } from "../../models/index.model";
import { StoreIds } from "../../utils/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
      const { gameName, url, infoPrice, gamepass, infoGame } = game;

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

              url,

              gamepass,
              edition: edition ? edition : "Standard",
              infoPrice,
              infoGame,
            },
          ],
        });
      } else {
        gameByStorePrices[position].stores = [
          ...gameByStorePrices[position].stores,
          {
            store,
            type,
            url,
            gamepass,
            edition: edition ? edition : "Standard",
            infoPrice,
            infoGame,
          },
        ];
      }
    }
  }
  return gameByStorePrices;
};

export const scrapeSpecialSales = async () => {
  const stores = {
    steam: new SteamStore(),
    epic: new EpicStore(),
    xbox: new XboxStore(),
  };

  const steamFeaturedGames = await stores.steam.scrapeFeaturedSales("CL");

  const specialGameScraped = await featureGameScrape(
    steamFeaturedGames.specials,
    stores,
  );
  const newReleasesGameScraped = await featureGameScrape(
    steamFeaturedGames.newReleases,
    stores,
  );
  const topSellersGameScraped = await featureGameScrape(
    steamFeaturedGames.topsellers,
    stores,
  );

  return {
    special: specialGameScraped,
    topSeller: topSellersGameScraped,
    newRelease: newReleasesGameScraped,
  };
};

export const scrapeFreeEpicSales = async () => {
  const stores = {
    steam: new SteamStore(),
    epic: new EpicStore(),
    xbox: new XboxStore(),
  };

  const epicFeaturedGames = await stores.epic.freeEpicGame("CL");

  const freeEpic = await featureGameScrape(epicFeaturedGames, stores);
  return freeEpic;
};

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
    const currPrice = await store.scrapeGameFromUrl(
      gameByStore.info_game!.storeIdGame,
    );
    console.log(gameByStore.game.gameName);
    if (currPrice) await updateStoreGamePrice(gameByStore, currPrice);
  }
};

export const storesPriceScrape = async (gamesByStore: StoreIds[]) => {
  for (const gameByStore of gamesByStore) {
    const store = stores[gameByStore.store as StoreTypes];

    const currPrice = await store.scrapeGameFromUrl(
      gameByStore.info_game.storeIdGame,
    );

    if (currPrice) await updateStoreGamePrice(gameByStore, currPrice);
  }
};

export const searchingStoresPriceScrape = async (gamesByStore: StoreIds[]) => {
  const epicStores = gamesByStore.filter((game) => game.store === "Epic");
  const xboxStores = gamesByStore.filter((game) => game.store === "Steam");
  const steamStores = gamesByStore.filter((game) => game.store === "Xbox");

  const steamIds = steamStores.map((store) => store.info_game.storeIdGame);
  const storesWithoutSteam = [...epicStores, ...xboxStores];

  await storesPriceScrape(storesWithoutSteam);

  const steam = new SteamStore();
  const updatedPrices = await steam.idListScrapeGame(steamIds);

  for (const steamStore of steamStores) {
    const currGame = updatedPrices.find(
      (price) => steamStore.info_game.storeIdGame === price.storeId,
    );

    if (currGame) await updateStoreGamePrice(steamStore, currGame);
  }
};

export const featureGameScrape = async (
  features: FeaturedGameDetail[],
  stores: {
    steam: SteamStore;
    epic: EpicStore;
    xbox: XboxStore;
  },
) => {
  const featureGames: GameStoresPrices[] = [];

  for (const featureGame of features) {
    const { gameName, infoGame, infoPrice, url, type, store, feature } =
      featureGame;

    const edition = getSpecialEdition(gameName);

    const steamGame =
      store !== stores.steam.name
        ? await stores.steam.scrapeSingleGameFromName(gameName, "CL")
        : {
            store: stores.steam.name,
            storeInfo: null,
            type: stores.steam.type,
          };
    const {
      store: storeSteam,
      storeInfo: storeInfoSteam,
      type: typeSteam,
    } = steamGame;
    const xboxGame =
      store !== stores.xbox.name
        ? await stores.xbox.singleNameScrapeFromName(gameName, "CL")
        : {
            store: stores.xbox.name,
            storeInfo: null,
            type: stores.xbox.type,
          };

    const {
      store: storeXbox,
      storeInfo: storeInfoXbox,
      type: typeXbox,
    } = xboxGame;

    const epicGame =
      store !== stores.epic.name
        ? await stores.epic.scrapeSingleGameFromName(gameName, "CL")
        : {
            store: stores.epic.name,
            storeInfo: null,
            type: stores.epic.type,
          };
    const {
      store: storeEpic,
      storeInfo: storeInfoEpic,
      type: typeEpic,
    } = epicGame;

    let game: GameStoresPrices = {
      gameName: gameName,
      stores: [
        {
          store,
          type,
          feature,
          url: url,
          edition: edition ? edition : "Standard",
          infoPrice: { ...infoPrice },
          infoGame: { ...infoGame },
        },
      ],
    };

    if (storeInfoSteam) {
      const steamStoreFormat = {
        store: storeSteam,
        type: typeSteam,
        url: storeInfoSteam.url,
        edition: edition ? edition : "Standard",
        infoPrice: { ...storeInfoSteam.infoPrice },
        infoGame: { ...storeInfoSteam.infoGame },
      };
      game.stores.push(steamStoreFormat);
    }

    if (storeInfoEpic) {
      const epicStoreFormat = {
        store: storeEpic,
        type: typeEpic,
        url: storeInfoEpic.url,
        edition: edition ? edition : "Standard",
        infoPrice: { ...storeInfoEpic.infoPrice },
        infoGame: { ...storeInfoEpic.infoGame },
      };

      game.stores.push(epicStoreFormat);
    }

    if (storeInfoXbox) {
      const xboxStoreFormat = {
        store: storeXbox,
        type: typeXbox,
        url: storeInfoXbox.url,
        gamepass: storeInfoXbox.gamepass,
        edition: edition ? edition : "Standard",
        infoPrice: { ...storeInfoXbox.infoPrice },
        infoGame: { ...storeInfoXbox.infoGame },
      };
      game.stores.push(xboxStoreFormat);
    }

    featureGames.push(game);
  }
  return featureGames;
};
