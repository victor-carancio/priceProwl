import { z } from "zod";
import { OrderFilters, SortFilters } from "../types";

export const filtersSchema = z
  .object({
    // filter: z.enum([SearchFilters.CATEGORY, SearchFilters.GENRE]),
    genre: z
      .string()
      .min(1, { message: "Must be 2 or more character long!" })
      .optional(),
    category: z
      .string()
      .min(1, { message: "Must be 2 or more character long!" })
      .optional(),
    sort: z.enum([SortFilters.ALPHABETICAL, SortFilters.PRICE]).optional(),
    order: z.enum([OrderFilters.ASC, OrderFilters.DESC]).optional(),

    // filterName: z
    //   .string()
    //   .min(2, { message: "Must be 2 or more character long!" }),
  })
  .refine((data) => data.category || data.genre, {
    message: "At least on of 'category' or 'genre' must be provided!",
  });
