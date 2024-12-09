// import { InfoGame } from "./../types";
// import { StorePrice } from "@prisma/client";
import {
  CompleteInfoFormat,
  Jio,
  // ShortFinalFormat,
  // ShortFinalFormat,
  ShortInfoFormat,
  StoreCompletePrismaFormat,
  StoreShortPrismaFormat,
} from "./types";

export const shortInfo = {
  storeIdGame: true,
  about: true,
  description: true,
  id: true,
  imgStore: true,
  release_date: true,
  genres: {
    include: {
      genre: true,
    },
  },
  categories: {
    include: {
      category: true,
    },
  },
};

export const completeInfo = {
  id: true,
  about: true,
  categories: {
    include: {
      category: true,
    },
  },
  description: true,
  developer: true,
  publisher: true,
  genres: {
    include: {
      genre: true,
    },
  },
  imgStore: true,
  pc_requirements: true,
  release_date: true,
  screenshots: true,
  storeIdGame: true,
  supportedLanguages: true,
  videos: true,
  website: true,
  ratings: {
    include: {
      rating: true,
    },
  },
};

export const shortInfoInclude = {
  stores: {
    include: {
      info_price: {
        orderBy: {
          updatedAt: "desc",
        } as const,
        take: 1,
      },
      info_game: {
        select: shortInfo,
      },
    },
  },
};

export const shortInfoFeatureInclude = {
  stores: {
    include: {
      info_price: {
        orderBy: {
          updatedAt: "desc",
        } as const,
        take: 1,
      },
      info_game: {
        select: shortInfo,
      },
      featuredIn: {
        select: {
          feature_category_id: true,
          feature_category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
};

export const completInfoInclude = {
  stores: {
    include: {
      info_price: {
        orderBy: {
          updatedAt: "desc",
        } as const,
        take: 1,
      },
      info_game: {
        select: completeInfo,
      },
    },
  },
};

export const formatShortInfo = (gamesFounded: ShortInfoFormat[]) => {
  return gamesFounded.map((game) => {
    const { stores } = game;

    return {
      ...game,
      stores: orderStoreByPrice(stores).map((store) => {
        return {
          ...store,
          // info_price: getOnePrice(store.info_price),
          info_game: {
            ...store.info_game,
            categories:
              store.info_game.categories.length >= 1
                ? store.info_game.categories.map(
                    (category) => category.category.category,
                  )
                : store.info_game.categories,
            genres: store.info_game.genres.map((genre) => genre.genre.genre),
          },
        };
      }),

      // infoGame: game.infoGame.map((info) => {
      //   return {
      //     ...info.info_game,
      //     genres: info.info_game.genres.map(({ genre }) => genre),
      //     keywords: info.info_game.keywords.map(({ keyword }) => keyword),
      //     platforms: info.info_game.platforms.map(({ platform }) => platform),
      //   };
      // }),
    };
  });
};

export const sortByPrice = (gamesFounded: Jio[], order?: string) => {
  const sort = order ? order : "asc";

  const desc = sort === "asc" ? 1 : -1;
  return [...gamesFounded].sort((a, b) => {
    const finalPriceA = parseInt(a.stores[0].info_price.final_price);
    const finalPriceB = parseInt(b.stores[0].info_price.final_price);

    if (finalPriceA > finalPriceB) {
      return 1 * desc;
    }

    if (finalPriceA < finalPriceB) {
      return -1 * desc;
    }

    return 0;
  });
};

export const formatCompleteInfo = (gamesFounded: CompleteInfoFormat) => {
  return {
    ...gamesFounded,
    stores: orderStoreByPriceComplete(gamesFounded.stores).map((store) => {
      return {
        ...store,
        info_game: {
          ...store.info_game,
          categories:
            store.info_game.categories.length >= 1
              ? store.info_game.categories.map(
                  (category) => category.category.category,
                )
              : store.info_game.categories,
          genres: store.info_game.genres.map((genre) => genre.genre.genre),

          ratings: store.info_game.ratings.map((rating) => rating.rating),
        },
      };
    }),

    // infoGame: gamesFounded.infoGame.map((info) => {
    //   return {
    //     ...info.info_game,
    //     alternative_names: info.info_game.alternative_names.map(
    //       ({ alternative_name }) => alternative_name,
    //     ),
    //     game_engines: info.info_game.game_engines.map(
    //       ({ game_engine }) => game_engine,
    //     ),
    //     genres: info.info_game.genres.map(({ genre }) => genre),
    //     // keywords: info.info_game.keywords.map(({ keyword }) => keyword),
    //     platforms: info.info_game.platforms.map(({ platform }) => platform),
    //   };
    // }),
  };
};

// const getOnePrice = (price: StorePrice[]) => {
//   return price[0];
//   // return stores.map((store) => {
//   //   return { ...store, info_price: store.info_price[0] };
//   // });
// };

const orderStoreByPrice = (
  stores: StoreCompletePrismaFormat[] | StoreShortPrismaFormat[],
) => {
  return stores
    .map((store) => {
      return { ...store, info_price: store.info_price[0] };
    })
    .sort((a, b) => {
      const finalPriceA = parseInt(a.info_price.final_price);
      const finalPriceB = parseInt(b.info_price.final_price);

      if (finalPriceA > finalPriceB) {
        return 1;
      }

      if (finalPriceA < finalPriceB) {
        return -1;
      }

      return 0;
    });
};

const orderStoreByPriceComplete = (stores: StoreCompletePrismaFormat[]) => {
  return stores
    .map((store) => {
      return { ...store, info_price: store.info_price[0] };
    })
    .sort((a, b) => {
      const finalPriceA = parseInt(a.info_price.final_price);
      const finalPriceB = parseInt(b.info_price.final_price);

      if (finalPriceA > finalPriceB) {
        return 1;
      }

      if (finalPriceA < finalPriceB) {
        return -1;
      }

      return 0;
    });
};
