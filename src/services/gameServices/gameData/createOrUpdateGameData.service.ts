// import { RatingOnInfoGame } from "./../../../../node_modules/.prisma/client/index.d";
import { CurrencyTypes, Game, StoreGame } from "@prisma/client";
import prisma from "../../../db/client.db";
import {
  GameInfoAndPrices,
  PriceFromUrlScraped,
  StorePriceInfo,
} from "../../../types";

const gameCreateOrFind = async (game: GameInfoAndPrices) => {
  let existingGame = await prisma.game.findFirst({
    where: { gameName: game.gameName },
  });

  if (!existingGame) {
    existingGame = await prisma.game.create({
      data: { gameName: game.gameName },
    });
  }
  return existingGame;
};

const storeCreateOrFind = async (store: StorePriceInfo, existingGame: Game) => {
  let existingStore = await prisma.storeGame.findFirst({
    where: {
      store: store.store,
      game_id: existingGame.id,
      edition: store.edition,
    },
  });

  if (!existingStore) {
    existingStore = await prisma.storeGame.create({
      data: {
        store: store.store,
        type: store.type,
        url: store.url,
        edition: store.edition,
        gamepass: store.store === "Xbox" ? store.gamepass : null,
        game: { connect: { id: existingGame.id } },
        info_price: {
          create: {
            initial_price: store.infoPrice.initial_price || "-",
            discount_percent: store.infoPrice.discount_percent || "-",
            final_price: store.infoPrice.final_price || "-",
            currency: store.infoPrice.currency as CurrencyTypes,
          },
        },
      },
    });
  }
  return existingStore;
};

const featureCreateOrConnect = async (
  store: StorePriceInfo,
  existingGame: Game,
  existingStore: StoreGame,
) => {
  if ("feature" in store && store.feature) {
    let existingFeature = await prisma.featureCategory.findUnique({
      where: {
        name: store.feature,
      },
    });

    if (!existingFeature) {
      existingFeature = await prisma.featureCategory.create({
        data: {
          name: store.feature,
        },
      });
    }

    await prisma.featuredGameCategory.create({
      data: {
        game: { connect: { id: existingGame.id } },
        store: { connect: { id: existingStore.id } },
        feature_category: {
          connect: {
            id: existingFeature.id,
          },
        },
      },
    });
  }
};

const priceCreateOrUpdate = async (
  store: StorePriceInfo,
  existingStore: StoreGame,
) => {
  const existingPrice = await prisma.storePrice.findFirst({
    where: {
      storeGame: {
        id: existingStore.id,
        store: existingStore.store,
        edition: existingStore.edition,
      },
      currency: store.infoPrice.currency as CurrencyTypes,
    },
  });

  if (!existingPrice) {
    await prisma.storePrice.create({
      data: {
        initial_price: store.infoPrice.initial_price || "-",
        discount_percent: store.infoPrice.discount_percent || "-",
        final_price: store.infoPrice.final_price || "-",
        currency: store.infoPrice.currency as CurrencyTypes,
        storeGame: { connect: { id: existingStore.id } },
      },
    });
  } else {
    await prisma.storePrice.update({
      where: {
        id: existingPrice.id,
      },
      data: {
        initial_price: store.infoPrice.initial_price,
        final_price: store.infoPrice.final_price,
        discount_percent: store.infoPrice.discount_percent,
        storeGame: {
          // connect: { id: existingStore.id },
          update: {
            gamepass: existingStore.store === "Xbox" ? store.gamepass : null,
          },
        },
      },
    });
  }
};

const gameInfoCreate = async (
  store: StorePriceInfo,
  existingStore: StoreGame,
) => {
  const { infoGame } = store;

  const newInfoGame = await prisma.infoGame.create({
    data: {
      storeIdGame: infoGame.storeId,
      imgStore: infoGame.imgStore,
      about: infoGame.about,
      description: infoGame.description,
      developer: infoGame.developer,
      publisher: infoGame.publisher,
      release_date: infoGame.release_date,
      supportedLanguages: infoGame.supported_languages,
      website: infoGame.website,
      store_game: {
        connect: {
          id: existingStore.id,
        },
      },
    },
  });

  for (const genre of infoGame.genres) {
    let existingGenre = await prisma.genres.findUnique({
      where: {
        genre,
      },
    });

    if (!existingGenre) {
      existingGenre = await prisma.genres.create({
        data: {
          genre,
        },
      });
    }

    const findGenreOnInfoGame = await prisma.genreOnInfoGame.findUnique({
      where: {
        genre_id_info_game_id: {
          genre_id: existingGenre.id,
          info_game_id: newInfoGame.id,
        },
      },
    });

    if (!findGenreOnInfoGame) {
      await prisma.genreOnInfoGame.create({
        data: {
          genre: { connect: { id: existingGenre.id } },
          info_game: { connect: { id: newInfoGame.id } },
        },
      });
    }
  }
  if (infoGame.categories.length >= 1) {
    for (const category of infoGame.categories) {
      let existingCategory = await prisma.categories.findUnique({
        where: {
          category,
        },
      });

      if (!existingCategory) {
        existingCategory = await prisma.categories.create({
          data: {
            category,
          },
        });
      }

      const findCategoryOnInfoGame =
        await prisma.categoriesOnInfoGame.findUnique({
          where: {
            category_id_info_game_id: {
              category_id: existingCategory.id,
              info_game_id: newInfoGame.id,
            },
          },
        });

      if (!findCategoryOnInfoGame) {
        await prisma.categoriesOnInfoGame.create({
          data: {
            category: {
              connect: {
                id: existingCategory.id,
              },
            },
            info_game: {
              connect: {
                id: newInfoGame.id,
              },
            },
          },
        });
      }
    }
  }

  for (const screenshot of infoGame.screenshots) {
    await prisma.screenshots.create({
      data: {
        url: screenshot.url,
        thumbUrl: screenshot.thumbUrl ? screenshot.thumbUrl : "-",
        info_game: {
          connect: {
            id: newInfoGame.id,
          },
        },
      },
    });
  }

  if ("pc_requirements" in infoGame) {
    await prisma.pcRequirements.create({
      data: {
        recommended: infoGame.pc_requirements!.recommended,
        minimum: infoGame.pc_requirements!.minimum,
        info_game: {
          connect: {
            id: newInfoGame.id,
          },
        },
      },
    });
  }

  if ("ratings" in infoGame && infoGame.ratings !== null) {
    for (const rating of infoGame.ratings) {
      let existingRating = await prisma.rating.findFirst({
        where: {
          name: rating.name,
          descriptors: rating.descriptors,
        },
      });

      if (!existingRating) {
        existingRating = await prisma.rating.create({
          data: {
            name: rating.name,
            descriptors: rating.descriptors,
            rating: rating.rating,
            imageUrl: rating.imageUrl,
          },
        });
      }

      const findRatingOnInfoGame = await prisma.ratingOnInfoGame.findUnique({
        where: {
          info_game_id_rating_id: {
            info_game_id: newInfoGame.id,
            rating_id: existingRating.id,
          },
        },
      });

      if (!findRatingOnInfoGame) {
        await prisma.ratingOnInfoGame.create({
          data: {
            infoGame: {
              connect: {
                id: newInfoGame.id,
              },
            },
            rating: {
              connect: {
                id: existingRating.id,
              },
            },
          },
        });
      }
    }
  }
};

export const storeGameData = async (gamesData: GameInfoAndPrices[]) => {
  for (const game of gamesData) {
    await prisma.$transaction(async () => {
      const existingGame = await gameCreateOrFind(game);

      for (const store of game.stores) {
        const existingStore = await storeCreateOrFind(store, existingGame);

        await featureCreateOrConnect(store, existingGame, existingStore);

        await priceCreateOrUpdate(store, existingStore);

        const existingInfo = await prisma.infoGame.findFirst({
          where: {
            store_game: {
              id: existingStore.id,
            },
          },
        });

        if (existingInfo) {
          continue;
        }

        await gameInfoCreate(store, existingStore);
      }
    });
  }
};

const deleteCurrentFeatured = async () => {
  await prisma.featuredGameCategory.deleteMany({
    where: {
      feature_category: {
        name: {
          not: "Epic Free Game",
        },
      },
    },
  });
};

const deleteCurrentFreeEpic = async () => {
  await prisma.featuredGameCategory.deleteMany({
    where: {
      feature_category: {
        name: {
          equals: "Epic Free Game",
        },
      },
    },
  });
};

export const featureCreate = async (gamesData: {
  special: GameInfoAndPrices[];
  newRelease: GameInfoAndPrices[];
  topSeller: GameInfoAndPrices[];
}) => {
  await prisma.$transaction(async () => {
    await deleteCurrentFeatured();
  });

  await storeGameData(gamesData.topSeller);
  await storeGameData(gamesData.newRelease);
  await storeGameData(gamesData.special);
};

export const freeEpicCreate = async (freeEpic: GameInfoAndPrices[]) => {
  await prisma.$transaction(async () => {
    await deleteCurrentFreeEpic();
  });
  await storeGameData(freeEpic);
};

export const updateStoreGamePrice = async (
  gameByStore: Pick<StoreGame, "id" | "store">,
  currPrice: PriceFromUrlScraped,
) => {
  const storePrice = await prisma.storePrice.findFirst({
    where: {
      storeGame: {
        id: gameByStore.id,
        // edition: gameByStore.edition,
        // url: gameByStore.url,
      },
      currency: "CLP",
    },
  });

  if (!storePrice) {
    await prisma.$transaction(async () => {
      await prisma.storePrice.create({
        data: {
          initial_price: currPrice.initial_price,
          final_price: currPrice.final_price,
          discount_percent: currPrice.discount_percent,
          offer_end_date: currPrice.offerEndDate,
          currency: "CLP",
          storeGame: { connect: { id: gameByStore.id } },
        },
      });
    });

    // console.log("created");
  } else {
    const hasChanged =
      storePrice.initial_price !== currPrice.initial_price ||
      storePrice.final_price !== currPrice.final_price ||
      storePrice.discount_percent !== currPrice.discount_percent ||
      storePrice.offer_end_date !== currPrice.offerEndDate;

    if (hasChanged) {
      await prisma.$transaction(async () => {
        await prisma.storePrice.update({
          where: {
            id: storePrice?.id,
          },
          data: {
            initial_price: currPrice.initial_price,
            final_price: currPrice.final_price,
            discount_percent: currPrice.discount_percent,
            offer_end_date: currPrice.offerEndDate,
            storeGame: {
              // connect: { id: gameByStore.id },
              update: {
                gamepass:
                  gameByStore.store === "Xbox" ? currPrice.gamepass : null,
              },
            },
          },
        });
      });

      console.log("updated");
    }
  }
};
