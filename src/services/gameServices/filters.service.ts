import { SortFilters } from "../../types";

interface gamefilters {
  sort?: string;
  order?: string;
  genre?: string;
}

export const filtersType: Record<SortFilters, any> = {
  [SortFilters.ALPHABETICAL]: (filters: gamefilters) =>
    ({
      gameName: filters.order || "asc",
    } as const),
  [SortFilters.GENRE]: (filters: gamefilters) => ({
    stores: {
      some: {
        info_game: {
          genres: {
            some: {
              genre: {
                genre: {
                  contains: filters.genre,
                  mode: "insensitive",
                },
              },
            },
          },
        },
      },
    },
  }),
  [SortFilters.OFFER]: "",
  [SortFilters.PRICE]: "",
};

export const getFilter = (filters: gamefilters) => {
  const filterFn = filtersType[filters.sort as SortFilters];

  if (filterFn) {
    return filterFn(filters);
  }

  return {};
};
