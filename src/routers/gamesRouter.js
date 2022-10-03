import { Router } from 'express';
import { listGames, insertGame } from '../controllers/gamesControllers.js';

const router = Router();

router.get('/games', listGames);
router.post('/games', insertGame);

export default router;