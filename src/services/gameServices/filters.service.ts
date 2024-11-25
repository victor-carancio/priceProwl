import { SearchFilters, SortFilters } from "../../types";

interface gamefilters {
  category?: string;
  genre?: string;

  sort?: string;
  order?: string;
}

export const filtersType: Record<SearchFilters, any> = {
  [SearchFilters.GENRE_CATEGORY]: (filters: gamefilters) => ({
    stores: {
      some: {
        info_game: {
          genres: {
            some: {
              genre: {
                genre: {
                  equals: filters.genre,
                  mode: "insensitive",
                },
              },
            },
          },
          categories: {
            some: {
              category: {
                category: {
                  equals: filters.category,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      },
    },
  }),
  [SearchFilters.GENRE]: (filters: gamefilters) => ({
    stores: {
      some: {
        info_game: {
          genres: {
            some: {
              genre: {
                genre: {
                  equals: filters.genre,
                  // mode: "insensitive",
                },
              },
            },
          },
        },
      },
    },
  }),
  [SearchFilters.CATEGORY]: (filters: gamefilters) => ({
    stores: {
      some: {
        info_game: {
          categories: {
            some: {
              category: {
                category: {
                  equals: filters.category,
                  // mode: "insensitive",
                },
              },
            },
          },
        },
      },
    },
  }),
};

export const sortType: Record<SortFilters, any> = {
  [SortFilters.ALPHABETICAL]: (filters: gamefilters) =>
    ({
      gameName: filters.order || "asc",
    } as const),

  [SortFilters.PRICE]: "",
};

export const getFilter = (filters: gamefilters) => {
  let filterFn;
  if (filters.category && filters.genre) {
    filterFn = filtersType[SearchFilters.GENRE_CATEGORY];
  }
  if (filters.category && !filters.genre) {
    filterFn = filtersType[SearchFilters.CATEGORY];
  }
  if (!filters.category && filters.genre) {
    filterFn = filtersType[SearchFilters.GENRE];
  }

  if (filterFn) {
    return filterFn(filters);
  }

  return {};
};

export const getSort = (filters: gamefilters) => {
  const filterFn = sortType[filters.sort as SortFilters];

  if (filterFn) {
    return filterFn(filters);
  }

  return {};
};
