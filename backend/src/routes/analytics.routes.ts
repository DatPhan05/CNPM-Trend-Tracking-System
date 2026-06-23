import { Router } from 'express';
import {
  getOverview,
  getTrends,
  getCategories,
  getTopAuthors,
  exportCsv,
  exportPdf
} from '../controllers/analytics.controller';

const router = Router();

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/categories', getCategories);
router.get('/top-authors', getTopAuthors);

router.get('/export/csv', exportCsv);
router.get('/export/pdf', exportPdf);

export default router;
