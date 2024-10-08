import { GameInfoAndPrices, PriceFromUrlScraped } from "../../types";
import { CurrencyTypes, StoreGame } from "@prisma/client";
import prisma from "../../db/client.db";
import { NotFoundError } from "../../responses/customApiError";
import {
  completeInfo,
  formatCompleteInfo,
  formatShortInfo,
  shortInfo,
} from "../../utils/manageGameData.utils";
import { CompleteInfoFormat, ShortInfoFormat } from "../../utils/types";

export const storeGameData = async (gamesData: GameInfoAndPrices[]) => {
  for (const game of gamesData) {
    let existingGame = await prisma.game.findFirst({
      where: { gameName: game.gameName },
    });

    if (!existingGame) {
      existingGame = await prisma.game.create({
        data: { gameName: game.gameName },
      });
    }

    for (const store of game.stores) {
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
            storeIdGame: store.storeIdGame,
            type: store.type,
            url: store.url,
            imgStore: store.imgStore,
            edition: store.edition,
            gamepass: store.store === "Xbox" ? store.gamepass : null,
            game: { connect: { id: existingGame.id } },
            info: {
              create: {
                initial_price: store.info.initial_price || "-",
                discount_percent: store.info.discount_percent || "-",
                final_price: store.info.final_price || "-",
                currency: store.info.currency as CurrencyTypes,
              },
            },
          },
        });
      }

      const existingPrice = await prisma.storePrice.findFirst({
        where: {
          storeGame: {
            id: existingStore.id,
            store: existingStore.store,
            edition: existingStore.edition,
          },
          initial_price: store.info.initial_price,
          discount_percent: store.info.discount_percent,
          final_price: store.info.final_price,
        },
      });

      if (!existingPrice) {
        await prisma.storePrice.create({
          data: {
            initial_price: store.info.initial_price || "-",
            discount_percent: store.info.discount_percent || "-",
            final_price: store.info.final_price || "-",
            storeGame: { connect: { id: existingStore.id } },
          },
        });
      } else {
        await prisma.storePrice.update({
          where: {
            id: existingPrice.id,
          },
          data: {
            initial_price: store.info.initial_price,
            final_price: store.info.final_price,
            discount_percent: store.info.discount_percent,
            storeGame: {
              connect: { id: existingStore.id },
              update: {
                gamepass:
                  existingStore.store === "Xbox" ? store.gamepass : null,
              },
            },
          },
        });
      }
    }

    const existingInfo = await prisma.infoGame.findFirst({
      where: { game: { some: { game_id: existingGame.id } } },
    });

    if (!game.infoGame || game.infoGame.length <= 0 || existingInfo) {
      console.log(`continua ${existingGame.gameName}`);
      continue;
    }

    for (const info of game.infoGame) {
      const newInfoGame = await prisma.infoGame.upsert({
        where: { id: info.id },
        update: {},
        create: {
          id: info.id,
          name: info.name,
          first_release_date: String(info.first_release_date),
          storyline: info.storyline,
          summary: info.summary || "-",
          version_title: info.version_title || "-",
          cover: {
            create: {
              height: info.cover.height,
              url: info.cover.url,
              width: info.cover.width,
              id: info.cover.id,
              image_id: info.cover.image_id,
            },
          },
        },
      });

      await prisma.gameOnInfoGame.create({
        data: {
          game: { connect: { id: existingGame.id } },
          info_game: { connect: { id: info.id } },
        },
      });

      if ("alternative_names" in info) {
        for (const alternativeName of info.alternative_names) {
          await prisma.alternativeNameOnInfoGame.upsert({
            where: {
              alternative_name_id_info_game_id: {
                alternative_name_id: alternativeName.id,
                info_game_id: info.id,
              },
            },
            update: {},
            create: {
              info_game: { connect: { id: newInfoGame.id } },
              alternative_name: {
                connectOrCreate: {
                  where: {
                    id: alternativeName.id,
                  },
                  create: {
                    id: alternativeName.id,
                    comment: alternativeName.comment || "-",
                    name: alternativeName.name,
                  },
                },
              },
            },
          });
        }
      }

      if ("artworks" in info) {
        for (const artwork of info.artworks) {
          await prisma.artwork.upsert({
            where: { id: artwork.id },
            update: {},
            create: {
              id: artwork.id,
              height: artwork.height,
              width: artwork.width,
              url: artwork.url,
              image_id: artwork.image_id,
              info_game: { connect: { id: newInfoGame.id } },
            },
          });
        }
      }

      if ("game_engines" in info) {
        for (const gameEngine of info.game_engines) {
          await prisma.gameEngineOnInfoGame.upsert({
            where: {
              game_engine_id_info_game_id: {
                game_engine_id: gameEngine.id,
                info_game_id: newInfoGame.id,
              },
            },
            update: {},
            create: {
              info_game: { connect: { id: newInfoGame.id } },
              game_engine: {
                connectOrCreate: {
                  where: {
                    id: gameEngine.id,
                  },
                  create: {
                    id: gameEngine.id,
                    name: gameEngine.name,
                  },
                },
              },
            },
          });
        }
      }

      if ("genres" in info) {
        for (const genre of info.genres) {
          await prisma.genreOnInfoGame.upsert({
            where: {
              genre_id_info_game_id: {
                genre_id: genre.id,
                info_game_id: newInfoGame.id,
              },
            },
            update: {},
            create: {
              info_game: { connect: { id: newInfoGame.id } },
              genre: {
                connectOrCreate: {
                  where: { id: genre.id },
                  create: {
                    id: genre.id,
                    name: genre.name,
                  },
                },
              },
            },
          });
        }
      }

      if ("involved_companies" in info) {
        for (const involved_company of info.involved_companies) {
          const newCompany = await prisma.company.upsert({
            where: { id: involved_company.company.id },
            update: {
              involved_company: {
                connectOrCreate: {
                  where: {
                    id: involved_company.id,
                  },
                  create: {
                    id: involved_company.id,
                    developer: involved_company.developer,
                    porting: involved_company.porting,
                    publisher: involved_company.publisher,
                    supporting: involved_company.supporting,
                    info_game: { connect: { id: newInfoGame.id } },
                  },
                },
              },
            },
            create: {
              id: involved_company.company.id,
              name: involved_company.company.name,
              country: involved_company.company.country,
              start_date: String(involved_company.company.start_date),
              involved_company: {
                connectOrCreate: {
                  where: {
                    id: involved_company.id,
                  },
                  create: {
                    id: involved_company.id,
                    developer: involved_company.developer,
                    porting: involved_company.porting,
                    publisher: involved_company.publisher,
                    supporting: involved_company.supporting,
                    info_game: { connect: { id: newInfoGame.id } },
                  },
                },
              },
            },
          });

          if ("logo" in involved_company.company) {
            await prisma.companyLogo.upsert({
              where: {
                id: involved_company.company.logo.id,
              },
              update: {
                company: { connect: { id: newCompany.id } },
              },
              create: {
                id: involved_company.company.logo.id,
                height: involved_company.company.logo.height,
                width: involved_company.company.logo.width,
                url: involved_company.company.logo.url,
                image_id: involved_company.company.logo.image_id,
                company: { connect: { id: newCompany.id } },
              },
            });
          }
        }
      }

      if ("keywords" in info) {
        for (const keyword of info.keywords) {
          await prisma.keywordOnInfoGame.upsert({
            where: {
              keyword_id_info_game_id: {
                keyword_id: keyword.id,
                info_game_id: newInfoGame.id,
              },
            },
            update: {},
            create: {
              info_game: { connect: { id: newInfoGame.id } },
              keyword: {
                connectOrCreate: {
                  where: { id: keyword.id },
                  create: {
                    id: keyword.id,
                    name: keyword.name,
                  },
                },
              },
            },
          });
        }
      }

      if ("platforms" in info) {
        for (const platform of info.platforms) {
          await prisma.platformOnInfoGame.upsert({
            where: {
              platform_id_info_game_id: {
                info_game_id: newInfoGame.id,
                platform_id: platform.id,
              },
            },
            update: {},
            create: {
              info_game: { connect: { id: newInfoGame.id } },
              platform: {
                connectOrCreate: {
                  where: { id: platform.id },
                  create: {
                    id: platform.id,
                    abbreviation: platform.abbreviation,
                    alternative_name: platform.alternative_name,
                    name: platform.name,
                  },
                },
              },
            },
          });
          if ("platform_logo" in platform) {
            await prisma.platformLogo.upsert({
              where: {
                id: platform.platform_logo.id,
              },
              update: {
                platform: { connect: { id: platform.id } },
              },
              create: {
                id: platform.platform_logo.id,
                height: platform.platform_logo.height,
                width: platform.platform_logo.width,
                url: platform.platform_logo.url,
                image_id: platform.platform_logo.image_id,
                platform: { connect: { id: platform.id } },
              },
            });
          }
        }
      }

      if ("release_dates" in info) {
        for (const releaseDate of info.release_dates) {
          await prisma.platform.upsert({
            where: { id: releaseDate.platform.id },
            update: {
              release_date: {
                connectOrCreate: {
                  where: { id: releaseDate.id },
                  create: {
                    id: releaseDate.id,
                    category: releaseDate.category,
                    date: String(releaseDate.date),
                    region: releaseDate.region,
                  },
                },
              },
            },
            create: {
              id: releaseDate.platform.id,
              abbreviation: releaseDate.platform.abbreviation,
              alternative_name: releaseDate.platform.alternative_name,
              name: releaseDate.platform.name,
              release_date: {
                connectOrCreate: {
                  where: { id: releaseDate.id },
                  create: {
                    id: releaseDate.id,
                    category: releaseDate.category,
                    date: String(releaseDate.date),
                    region: releaseDate.region,
                  },
                },
              },
            },
          });

          if ("platform_logo" in releaseDate.platform) {
            await prisma.platformLogo.upsert({
              where: {
                id: releaseDate.platform.platform_logo.id,
              },
              update: {
                platform: {
                  connect: { id: releaseDate.platform.id },
                },
              },
              create: {
                id: releaseDate.platform.platform_logo.id,
                height: releaseDate.platform.platform_logo.height,
                width: releaseDate.platform.platform_logo.width,
                url: releaseDate.platform.platform_logo.url,
                image_id: releaseDate.platform.platform_logo.image_id,
                platform: {
                  connect: { id: releaseDate.platform.id },
                },
              },
            });
          }
        }
      }

      if ("videos" in info) {
        for (const video of info.videos) {
          if ("name" in video) {
            await prisma.video.upsert({
              where: {
                id: video.id,
              },
              update: {},
              create: {
                id: video.id,
                name: video.name,
                video_id: video.video_id,
                info_game: { connect: { id: newInfoGame.id } },
              },
            });
          }
        }
      }
    }
  }
};

export const updateStoreGamePrice = async (
  gameByStore: StoreGame,
  currPrice: PriceFromUrlScraped,
) => {
  const storePrice = await prisma.storePrice.findFirst({
    where: {
      storeGame: {
        id: gameByStore.id,

        // edition: gameByStore.edition,
        // url: gameByStore.url,
      },
      initial_price: currPrice.initial_price,
      final_price: currPrice.final_price,
      discount_percent: currPrice.discount_percent,
      currency: "CLP",
    },
  });

  if (!storePrice) {
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
    console.log("created");
  } else {
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
          connect: { id: gameByStore.id },
          update: {
            gamepass: gameByStore.store === "Xbox" ? currPrice.gamepass : null,
          },
        },
      },
    });
    console.log("updated");
  }
};

export const findGameByName = async (name: string) => {
  //todo: que busque por nombre alternativo
  const gamesFounded = await prisma.game.findMany({
    where: {
      OR: [
        {
          gameName: {
            contains: name.trim(),
            mode: "insensitive",
          },
        },
        {
          infoGame: {
            some: {
              info_game: {
                alternative_names: {
                  some: {
                    alternative_name: {
                      name: {
                        contains: name.trim(),
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
    include: {
      stores: {
        include: {
          info: {
            orderBy: {
              updatedAt: "desc",
            },
            take: 1,
          },
        },
      },
      infoGame: {
        include: {
          info_game: {
            select: shortInfo,
          },
        },
      },
    },
  });

  return formatShortInfo(gamesFounded as ShortInfoFormat[]);
};

export const findGameById = async (id: number) => {
  const gamesFounded = await prisma.game.findFirst({
    where: {
      id: id,
    },
    include: {
      stores: {
        include: {
          info: {
            orderBy: {
              updatedAt: "desc",
            },
            take: 1,
          },
        },
      },
      infoGame: {
        include: {
          info_game: {
            select: completeInfo,
          },
        },
      },
    },
  });

  if (!gamesFounded) {
    throw new NotFoundError(`There is not game with id ${id} in the database.`);
  }

  return formatCompleteInfo(gamesFounded as CompleteInfoFormat);
};

export const findAllGames = async () => {
  const allGames = await prisma.game.findMany({
    where: {},
    include: {
      stores: {
        include: {
          info: {
            orderBy: {
              updatedAt: "desc",
            },
            take: 1,
          },
        },
      },
      infoGame: {
        include: {
          info_game: {
            select: shortInfo,
          },
        },
      },
    },
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
          imgStore: true,
          storeIdGame: true,
          url: true,
          edition: true,
          gamepass: true,
          createdAt: true,
          updatedAt: true,
          game_id: true,
          game: {
            select: {
              id: true,
              gameName: true,
              platform: true,
              createdAt: true,
              updatedAt: true,
              infoGame: {
                include: {
                  info_game: {
                    select: shortInfo,
                  },
                },
              },
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
      imgStore,
      storeIdGame,
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
        storeIdGame,
        store,
        type,
        url,
        imgStore,
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
          imgStore: true,
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
    const { imgStore } = offer.storeGame;
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

        imgStore,
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
    },
  });
};
