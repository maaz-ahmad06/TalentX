import express from 'express';
import { getTalents, getTalentById, addPortfolioItem } from '../controllers/talentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTalents);
router.get('/:id', getTalentById);
router.post('/portfolio', protect, addPortfolioItem);

export default router;
