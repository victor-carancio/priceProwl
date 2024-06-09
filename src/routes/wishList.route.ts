import { Router } from "express";
import {
  addGame,
  deleteGame,
  getUserWishList,
} from "../controllers/wishList.controller";
import { authValidation } from "../middlewares/authHandler";
import { containsGameIdSchema } from "../schemas/wishList.schema";
import { validateData } from "../middlewares/validation";

const router = Router();

router.get("/", authValidation, getUserWishList);
router.post("/", validateData(containsGameIdSchema), authValidation, addGame);
router.delete(
  "/",
  validateData(containsGameIdSchema),
  authValidation,
  deleteGame,
);

export default router;
