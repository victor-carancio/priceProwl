import {Router} from "express"
import { getAllGamesMatchesWithName, getOneGame } from "../controllers/game.controller"
const router = Router()

router.get("/game", getOneGame)
router.get("/games", getAllGamesMatchesWithName)

export default router;