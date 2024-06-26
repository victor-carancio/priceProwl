import { GameInfoAndPrices } from "../../types";
import { PrismaClient, StoreGame } from "@prisma/client";

const prisma = new PrismaClient();

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
            url: store.url,
            edition: store.edition,
            gamepass: store.store === "Xbox" ? store.gamepass : null,
            game: { connect: { id: existingGame.id } },
            info: {
              create: {
                initial_price: store.info.initial_price || "-",
                discount_percent: store.info.discount_percent || "-",
                final_price: store.info.final_price || "-",
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

      if ("age_ratings" in info) {
        for (const age_rating of info.age_ratings) {
          await prisma.ageRatings.upsert({
            where: { id: age_rating.id },
            update: {},
            create: {
              id: age_rating.id,
              category: age_rating.category,
              rating: age_rating.rating,
              synopsis: age_rating.synopsis || "-",
              info_game: { connect: { id: newInfoGame.id } },
            },
          });
        }
      }

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
                platform: { connect: { id: platform.id } },
              },
            });
          }
        }
      }

      if ("player_perspectives" in info) {
        for (const playerPerspective of info.player_perspectives) {
          await prisma.playerPerspectiveOnInfoGame.upsert({
            where: {
              player_perspective_id_info_game_id: {
                info_game_id: newInfoGame.id,
                player_perspective_id: playerPerspective.id,
              },
            },
            update: {},
            create: {
              info_game: { connect: { id: newInfoGame.id } },
              player_perspective: {
                connectOrCreate: {
                  where: { id: playerPerspective.id },
                  create: {
                    id: playerPerspective.id,
                    name: playerPerspective.name,
                  },
                },
              },
            },
          });
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
                platform: {
                  connect: { id: releaseDate.platform.id },
                },
              },
            });
          }
        }
      }

      if ("screenshots" in info) {
        for (const screenshot of info.screenshots) {
          await prisma.screenshot.upsert({
            where: {
              id: screenshot.id,
            },
            update: {},
            create: {
              id: screenshot.id,
              height: screenshot.height,
              width: screenshot.width,
              url: screenshot.url,
              info_game: { connect: { id: newInfoGame.id } },
            },
          });
        }
      }

      if ("videos" in info) {
        for (const video of info.videos) {
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

      if ("language_supports" in info) {
        for (const languageSupport of info.language_supports) {
          await prisma.language.upsert({
            where: { id: languageSupport.language.id },
            update: {
              language_support: {
                connectOrCreate: {
                  where: { id: languageSupport.id },
                  create: {
                    id: languageSupport.id,
                    info_game: {
                      connect: { id: newInfoGame.id },
                    },
                  },
                },
              },
            },
            create: {
              id: languageSupport.language.id,
              name: languageSupport.language.name,
              native_name: languageSupport.language.native_name,
              locale: languageSupport.language.locale,
              language_support: {
                connectOrCreate: {
                  where: { id: languageSupport.id },
                  create: {
                    id: languageSupport.id,
                    info_game: {
                      connect: { id: newInfoGame.id },
                    },
                  },
                },
              },
            },
          });
        }
      }
    }
  }
};

export const updateStoreGamePrice = async (
  gameByStore: StoreGame,
  currPrice: {
    discount_percent: string;
    initial_price: string;
    final_price: string;
    gamepass?: boolean;
  },
) => {
  const storePrice = await prisma.storePrice.findFirst({
    where: {
      storeGame: {
        id: gameByStore.id,
        edition: gameByStore.edition,
        url: gameByStore.url,
      },
      initial_price: currPrice.initial_price,
      final_price: currPrice.final_price,
      discount_percent: currPrice.discount_percent,
    },
  });

  if (!storePrice) {
    await prisma.storePrice.create({
      data: {
        initial_price: currPrice.initial_price,
        final_price: currPrice.final_price,
        discount_percent: currPrice.discount_percent,
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
  const gamesFounded = await prisma.game.findMany({
    where: {
      gameName: {
        contains: name.trim(),
        mode: "insensitive",
      },
    },
    include: {
      stores: {
        include: {
          info: true,
        },
      },
      infoGame: {
        include: {
          info_game: {
            include: {
              cover: true,
              age_ratings: true,
              alternative_names: true,
              artworks: true,
              game_engines: true,
              genres: {
                include: {
                  genre: true,
                },
              },
              involved_companies: {
                include: {
                  company: true,
                },
              },
              keywords: {
                include: {
                  keyword: true,
                },
              },
              platforms: {
                include: {
                  platform: true,
                },
              },
              player_perspectives: {
                include: {
                  player_perspective: true,
                },
              },
              screenshots: true,
              videos: true,
              language_supports: {
                include: {
                  language: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return gamesFounded;
};
