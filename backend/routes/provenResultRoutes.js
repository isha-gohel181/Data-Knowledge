import express from 'express';
import {
  createProvenResult,
  getProvenResults,
  getProvenResultsAdmin,
  getProvenResultById,
  updateProvenResult,
  deleteProvenResult,
  toggleProvenResultStatus,
} from '../controllers/provenResultController.js';
import { upload } from '../middlewares/upload-middleware.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Public routes
router.get('/', getProvenResults);
router.get('/:id', getProvenResultById);

// Admin routes
router.get(
  '/admin/all',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getProvenResultsAdmin
);

router.post(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.fields([{ name: 'image' }, { name: 'thumbnail' }]),
  createProvenResult
);

router.put(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.fields([{ name: 'image' }, { name: 'thumbnail' }]),
  updateProvenResult
);

router.delete(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteProvenResult
);

router.patch(
  '/:id/toggle',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  toggleProvenResultStatus
);

export default router;
