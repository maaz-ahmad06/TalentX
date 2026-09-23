import express from 'express';
import { matchCandidates } from '../controllers/aiController.js';

const router = express.Router();

router.post('/match', matchCandidates);

export default router;
