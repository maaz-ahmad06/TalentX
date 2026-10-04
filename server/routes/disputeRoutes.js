import express from 'express';
import {
  createDispute,
  getDisputes,
  getDisputeById,
  sendMediationMessage,
  resolveDispute
} from '../controllers/disputeController.js';

const router = express.Router();

router.route('/')
  .post(createDispute)
  .get(getDisputes);

router.route('/:id')
  .get(getDisputeById);

router.route('/:id/messages')
  .post(sendMediationMessage);

router.route('/:id/resolve')
  .post(resolveDispute);

export default router;
