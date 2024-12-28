import prisma from "../../../db/client.db";
import { NotFoundError } from "../../../responses/customApiError";
import {
  completInfoInclude,
  formatCompleteInfo,
  formatShortInfo,
  shortInfo,
  shortInfoFeatureInclude,
  shortInfoInclude,
} from "../../../utils/manageGameData.utils";
import {
  CompleteInfoFormat,
  ShortInfoFormat,
  StoreIds,
} from "../../../utils/types";
import {
  searchingStoresPriceScrape,
  storesPriceScrape,
} from "../scrapeGameData.service";

export const findGameByName = async (name: string, orderBy: any) => {
  const include = { ...shortInfoInclude };

  const gamesByStores = await prisma.storeGame.findMany({
    where: {
      game: {
        gameName: {
          contains: name.trim(),
          mode: "insensitive",
        },
      },
    },
    include: {
      info_game: true,
      game: {
        select: {
          gameName: true,
        },
      },
    },
  });

  await searchingStoresPriceScrape(gamesByStores as StoreIds[]);

  const gamesFounded = await prisma.game.findMany({
    where: {
      OR: [
        {
          gameName: {
            contains: name.trim(),
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy,
    include,
  });

  return formatShortInfo(gamesFounded as ShortInfoFormat[]);
};

export const findGameById = async (id: number) => {
  const include = { ...completInfoInclude };

  const gameByStores = await prisma.storeGame.findMany({
    where: {
      game: {
        id,
      },
    },
    include: {
      info_game: {
        select: shortInfo,
      },
      game: {
        select: {
          gameName: true,
        },
      },
    },
  });

  if (!gameByStores || gameByStores.length <= 0) {
    throw new NotFoundError(`There is not game with id ${id} in the database.`);
  }

  await storesPriceScrape(gameByStores as StoreIds[]);

  const gamesFounded = await prisma.game.findFirst({
    where: {
      id: id,
    },
    include,
  });

  return formatCompleteInfo(gamesFounded as CompleteInfoFormat);
};

export const findGamesByFilters = async (filters: {
  where: any;
  orderBy: any;
}) => {
  const where = { ...filters.where };
  const orderBy = { ...filters.orderBy };
  const include = { ...shortInfoInclude };

  const allGames = await prisma.game.findMany({
    where,
    orderBy,
    include,
  });

  return formatShortInfo(allGames as ShortInfoFormat[]);
};

export const findCurrOfferGames = async () => {
  const findOffers = await prisma.storePrice.findMany({
    where: {},
    orderBy: {
      updatedAt: "desc",
    },
    distinct: ["store_game_id"],
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      store_game_id: true,
      offer_end_date: true,
      currency: true,
      initial_price: true,
      final_price: true,
      discount_percent: true,
      storeGame: {
        select: {
          id: true,
          type: true,
          store: true,
          url: true,
          edition: true,
          gamepass: true,
          createdAt: true,
          updatedAt: true,
          game_id: true,
          info_game: {
            select: shortInfo,
          },
          game: {
            select: {
              id: true,
              gameName: true,
              platform: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });

  const offersOnly = findOffers.filter(
    (price) => price.discount_percent !== "-" && price.discount_percent !== "0",
  );

  return offersOnly.map((offer) => {
    const {
      id,
      createdAt,
      updatedAt,
      currency,
      discount_percent,
      initial_price,
      final_price,
      offer_end_date,
      store_game_id,
      storeGame,
    } = offer;

    const {
      id: storeId,
      createdAt: storeCreated,
      edition,
      game_id,
      gamepass,
      store,
      updatedAt: storeUpdated,
      url,
      info_game,
      type,
      game,
    } = storeGame;

    const {
      id: gameId,
      gameName,
      platform,
      createdAt: gameCreated,
      updatedAt: gameUpdated,
      // infoGame,
    } = game;

    return {
      id: gameId,
      gameName,
      platform,
      createdAt: gameCreated,
      updatedAt: gameUpdated,
      stores: {
        id: storeId,
        store,
        type,
        url,
        edition,
        gamepass,
        createdAt: storeCreated,
        updatedAt: storeUpdated,
        game_id,
        info: {
          id,
          createdAt,
          updatedAt,
          discount_percent,
          currency,
          initial_price,
          final_price,
          offer_end_date,
          store_game_id,
        },
        infoGame: { ...info_game },
      },
    };
  });
};

export const findAllWishList = async () => {
  const wishList = await prisma.userGameWishList.findMany({
    where: {
      notified: false,
    },
  });

  const gamesIds = wishList.map((item) => item.game_id);

  const recentDiscountPrics = await prisma.storePrice.findMany({
    where: {
      storeGame: { game: { id: { in: gamesIds } } },
    },
    orderBy: {
      updatedAt: "desc",
    },

    distinct: ["store_game_id"],
    select: {
      id: true,
      store_game_id: true,
      offer_end_date: true,
      updatedAt: true,
      initial_price: true,
      final_price: true,
      discount_percent: true,
      storeGame: {
        select: {
          id: true,
          store: true,
          gamepass: true,
          url: true,
          info_game: true,
          game: {
            select: {
              gameName: true,
              user: {
                select: {
                  notified: true,
                  id: true,
                  user: {
                    select: {
                      id: true,
                      email: true,
                      username: true,
                      isActive: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const offersFilter = recentDiscountPrics.filter(
    (price) => price.discount_percent !== "-",
  );

  return offersFilter.map((offer) => {
    const { discount_percent, initial_price, final_price, offer_end_date } =
      offer;

    const { gameName, user } = offer.storeGame.game;

    return {
      game: {
        gameName,
        store: offer.storeGame.store,
        gamepass: offer.storeGame.gamepass,
        url: offer.storeGame.url,
        storeGame: offer.storeGame.id,
        initial_price,
        final_price,
        offer_end_date,
        discount_percent,

        imgStore: offer.storeGame.info_game?.imgStore,
      },
      users: user
        .filter((element) => !element.notified && element.user.isActive)
        .map((element) => ({
          userId: element.user.id,
          userName: element.user.username,
          email: element.user.email,
          wishListId: element.id,
          notified: element.notified,
        })),
    };
  });
};

export const wishListToNotified = async (
  wishListIds: { notified: boolean; wishListId: number }[],
) => {
  if (wishListIds.length > 0) {
    for (const wish of wishListIds) {
      const findWishListId = await prisma.userGameWishList.findFirst({
        where: {
          id: wish.wishListId,
          notified: false,
        },
      });

      if (findWishListId) {
        await prisma.userGameWishList.update({
          where: {
            notified: false,
            id: wish.wishListId,
          },
          data: {
            notified: true,
          },
        });
      }
    }
  }
};

export const findEndOffer = async () => {
  const wishList = await prisma.userGameWishList.findMany({
    where: {
      notified: true,
    },
  });

  const gamesIds = wishList.map((item) => item.game_id);

  const recentDiscountPrics = await prisma.storePrice.findMany({
    where: {
      storeGame: { game: { id: { in: gamesIds } } },
    },
    orderBy: {
      updatedAt: "desc",
    },

    distinct: ["store_game_id"],
    select: {
      id: true,
      discount_percent: true,
      storeGame: {
        select: {
          game: {
            select: {
              gameName: true,
              user: {
                select: {
                  notified: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const offersFilter = recentDiscountPrics.filter(
    (price) => price.discount_percent === "-",
  );

  let offerEndIds: {
    notified: boolean;
    id: number;
  }[] = [];
  for (const offer of offersFilter) {
    const { user } = offer.storeGame.game;
    for (const userId of user) {
      offerEndIds = [...offerEndIds, userId];
    }
  }
  if (offerEndIds.length > 0) {
    for (const offer of offerEndIds) {
      const findWishListId = await prisma.userGameWishList.findFirst({
        where: {
          id: offer.id,
          notified: true,
        },
      });

      if (findWishListId) {
        await prisma.userGameWishList.update({
          where: {
            notified: true,
            id: offer.id,
          },
          data: {
            notified: false,
          },
        });
      }
    }
  }
};

export const getAllStoreGames = async () => {
  return await prisma.storeGame.findMany({
    where: {},
    include: {
      game: true,
      info_game: {
        select: {
          storeIdGame: true,
        },
      },
    },
  });
};

export const getCurrentGenres = async () => {
  const genres = await prisma.genres.findMany({
    where: {},
  });

  return genres.map((genre) => genre.genre);

  // return genres.map((genre) => genre.genre.genre);
};

export const getCurrentCategories = async () => {
  const categories = await prisma.categories.findMany({
    where: {},
  });

  return categories.map((category) => category.category);
};

export const getFeaturedGamesByStore = async () => {
  const include = { ...shortInfoFeatureInclude };

  const featureCategories = await prisma.featureCategory.findMany({
    where: {},
  });

  let featuredGamesFounded = [];
  for (const category of featureCategories) {
    const featureGames = await prisma.game.findMany({
      where: {
        featuredIn: {
          some: {
            feature_category: {
              name: {
                contains: category.name,
              },
            },
          },
        },
      },
      include,
    });

    const filterStore = featureGames.map((game) => {
      return {
        ...game,
        stores: game.stores
          .filter((store) =>
            store.featuredIn.some(
              (feature) => feature.feature_category.name === category.name,
            ),
          )
          .map((store) => {
            return { ...store, info_price: store.info_price[0] };
          }),
      };
    });

    featuredGamesFounded.push({ feature: category.name, games: filterStore });
  }
  return featuredGamesFounded;
};
