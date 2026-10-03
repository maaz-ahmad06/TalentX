import express from 'express';
import { 
  matchCandidates, 
  generateJobDescription, 
  generateProposal, 
  askAICopilot 
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/match', matchCandidates);
router.post('/generate-job', generateJobDescription);
router.post('/generate-proposal', generateProposal);
router.post('/copilot', askAICopilot);

export default router;
