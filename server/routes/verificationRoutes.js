import express from 'express';
import {
  submitVerificationRequest,
  getVerificationRequests,
  reviewVerificationRequest,
  getSkillCategories,
  getSkillQuiz,
  submitSkillQuiz
} from '../controllers/verificationController.js';

const router = express.Router();

// CNIC / NTN Verification Routes
router.post('/submit', submitVerificationRequest);
router.get('/', getVerificationRequests);
router.put('/:id/review', reviewVerificationRequest);

// Skill Assessment & Testing Engine Routes
router.get('/skills/categories', getSkillCategories);
router.get('/skills/:categoryId/quiz', getSkillQuiz);
router.post('/skills/submit', submitSkillQuiz);

export default router;
