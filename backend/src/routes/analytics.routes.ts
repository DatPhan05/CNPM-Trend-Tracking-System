import { Router } from 'express';
import {
  getOverview,
  getTrends,
  getCategories,
  getTopAuthors,
} from '../controllers/analytics.controller';

const router = Router();

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/categories', getCategories);
router.get('/top-authors', getTopAuthors);

export default router;
