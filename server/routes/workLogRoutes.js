import express from 'express';
import {
  getContractWorkLogs,
  createWorkLog,
  logTimesheet,
  reviewDeliverable,
  deleteWorkLog
} from '../controllers/workLogController.js';

const router = express.Router();

router.get('/contract/:contractId', getContractWorkLogs);
router.post('/', createWorkLog);
router.post('/timesheet', logTimesheet);
router.put('/:id/review', reviewDeliverable);
router.delete('/:id', deleteWorkLog);

export default router;
