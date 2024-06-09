import { z } from "zod";

export const containsGameIdSchema = z.object({
  gameId: z.number(),
});
