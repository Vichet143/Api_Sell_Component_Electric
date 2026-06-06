import {Router} from 'express';
import PaymentController from '../controllers/PaymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/createpayment', authMiddleware, PaymentController.createPayment);
router.get('/getpayment', PaymentController.getPaymentById);

export default router;