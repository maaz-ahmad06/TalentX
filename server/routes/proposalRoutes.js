import express from 'express';
import { submitProposal, getJobProposals } from '../controllers/proposalController.js';

const router = express.Router();

router.post('/', submitProposal);
router.get('/job/:jobId', getJobProposals);

export default router;
