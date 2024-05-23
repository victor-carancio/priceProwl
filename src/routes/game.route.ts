import { Router } from 'express';
import {
    testUpdateGamePrice,
    getGamesPrices,
    getGamesByNameFromDB,
} from '../controllers/game.controller';

const router = Router();
router.get('/game', getGamesPrices);
router.get('/search', getGamesByNameFromDB);
router.get('/test', testUpdateGamePrice);

export default router;
