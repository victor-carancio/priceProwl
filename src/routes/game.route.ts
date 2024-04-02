import { Router } from "express";
import { getGamesPrices } from "../controllers/game.controller";

const router = Router();
router.get("/game", getGamesPrices);

export default router;
