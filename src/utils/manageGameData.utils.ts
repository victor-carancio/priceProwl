import { CompleteInfoFormat, ShortInfoFormat } from "./types";

export const shortInfo = {
  id: true,
  name: true,
  first_release_date: true,
  storyline: true,
  summary: true,
  version_title: true,
  cover: true,
  genres: {
    select: {
      genre: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  },
  keywords: {
    select: {
      keyword: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  platforms: {
    select: {
      platform: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
          alternative_name: true,
        },
      },
    },
  },
};

export const completeInfo = {
  id: true,
  name: true,
  first_release_date: true,
  storyline: true,
  summary: true,
  version_title: true,
  cover: true,
  artworks: true,
  alternative_names: {
    select: {
      alternative_name: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  game_engines: {
    select: {
      game_engine: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  genres: {
    select: {
      genre: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  },
  involved_companies: {
    select: {
      id: true,
      developer: true,
      porting: true,
      publisher: true,
      supporting: true,
      company: {
        select: {
          name: true,
          logo: true,
          country: true,
          start_date: true,
          id: true,
        },
      },
    },
  },
  keywords: {
    select: {
      keyword: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  platforms: {
    select: {
      platform: {
        select: {
          id: true,
          name: true,
          abbreviation: true,
          alternative_name: true,
        },
      },
    },
  },

  videos: true,
};

export const formatShortInfo = (gamesFounded: ShortInfoFormat[]) => {
  return gamesFounded.map((game) => {
    return {
      ...game,
      infoGame: game.infoGame.map((info) => {
        return {
          ...info.info_game,
          genres: info.info_game.genres.map(({ genre }) => genre),
          keywords: info.info_game.keywords.map(({ keyword }) => keyword),
          platforms: info.info_game.platforms.map(({ platform }) => platform),
        };
      }),
    };
  });
};

export const formatCompleteInfo = (gamesFounded: CompleteInfoFormat) => {
  return {
    ...gamesFounded,
    infoGame: gamesFounded.infoGame.map((info) => {
      return {
        ...info.info_game,
        alternative_names: info.info_game.alternative_names.map(
          ({ alternative_name }) => alternative_name,
        ),
        game_engines: info.info_game.game_engines.map(
          ({ game_engine }) => game_engine,
        ),
        genres: info.info_game.genres.map(({ genre }) => genre),
        keywords: info.info_game.keywords.map(({ keyword }) => keyword),
        platforms: info.info_game.platforms.map(({ platform }) => platform),
      };
    }),
  };
};
