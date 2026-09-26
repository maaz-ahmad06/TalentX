import express from 'express';
import { submitProposal, getJobProposals, getProposals } from '../controllers/proposalController.js';

const router = express.Router();

router.route('/')
  .get(getProposals)
  .post(submitProposal);

router.get('/job/:jobId', getJobProposals);

export default router;
