import express from 'express';
import { getJobs, createJob, getJobById } from '../controllers/jobController.js';

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(createJob);

router.route('/:id')
  .get(getJobById);

export default router;
