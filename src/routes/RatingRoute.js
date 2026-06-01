import {Router} from 'express';
import RatingController from '../controllers/RatingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/addrating', authMiddleware, RatingController.createRating);

export default router;