import express from 'express';
import {
  checkoutAndFundEscrow,
  releaseMilestonePayment,
  submitMilestoneWork,
  requestWithdrawal,
  getPaymentsLedger
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/checkout', checkoutAndFundEscrow);
router.post('/release', releaseMilestonePayment);
router.post('/submit-work', submitMilestoneWork);
router.post('/withdraw', requestWithdrawal);
router.get('/ledger', getPaymentsLedger);

export default router;
