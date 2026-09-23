import express from 'express';
import { getContracts, createContract, releaseMilestone } from '../controllers/contractController.js';

const router = express.Router();

router.route('/')
  .get(getContracts)
  .post(createContract);

router.put('/:id/milestone/:milestoneId', releaseMilestone);

export default router;
