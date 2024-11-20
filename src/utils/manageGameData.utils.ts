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

  // id: true,
  // name: true,
  // first_release_date: true,
  // storyline: true,
  // summary: true,
  // version_title: true,
  // cover: true,
  // genres: {
  //   select: {
  //     genre: {
  //       select: {
  //         name: true,
  //         id: true,
  //       },
  //     },
  //   },
  // },
  // keywords: {
  //   select: {
  //     keyword: {
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //   },
  // },
  // platforms: {
  //   select: {
  //     platform: {
  //       select: {
  //         id: true,
  //         name: true,
  //         abbreviation: true,
  //         alternative_name: true,
  //       },
  //     },
  //   },
  // },
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
  // id: true,
  // name: true,
  // first_release_date: true,
  // storyline: true,
  // summary: true,
  // version_title: true,
  // cover: true,
  // artworks: true,
  // alternative_names: {
  //   select: {
  //     alternative_name: {
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //   },
  // },

  // game_engines: {
  //   select: {
  //     game_engine: {
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //   },
  // },
  // genres: {
  //   select: {
  //     genre: {
  //       select: {
  //         name: true,
  //         id: true,
  //       },
  //     },
  //   },
  // },
  // involved_companies: {
  //   select: {
  //     id: true,
  //     developer: true,
  //     porting: true,
  //     publisher: true,
  //     supporting: true,
  //     company: {
  //       select: {
  //         name: true,
  //         logo: true,
  //         country: true,
  //         start_date: true,
  //         id: true,
  //       },
  //     },
  //   },
  // },
  // keywords: {
  //   select: {
  //     keyword: {
  //       select: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //   },
  // },
  // platforms: {
  //   select: {
  //     platform: {
  //       select: {
  //         id: true,
  //         name: true,
  //         abbreviation: true,
  //         alternative_name: true,
  //       },
  //     },
  //   },
  // },

  // videos: true,
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

  // stores: {
  //   include: {
  //     info: {
  //       orderBy: {
  //         updatedAt: "desc",
  //       } as const,
  //       take: 1,
  //     },

  //   },
  // },
  // infoGame: {
  //   include: {
  //     info_game: {
  //       select: shortInfo,
  //     },
  //   },
  // },
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
  console.log(sort);

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
    stores: orderStoreByPrice(gamesFounded.stores).map((store) => {
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
