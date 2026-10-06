import express from 'express';
import {
  createReview,
  getTalentReviews,
  getAllReviews
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', createReview);
router.get('/talent/:talentId', getTalentReviews);
router.get('/', getAllReviews);

export default router;
