import express from 'express';
import {
  getAboutSnapshot,
  getAboutSnapshotAdmin,
  updateAboutSnapshot,
} from '../controllers/aboutSnapshotController.js';
import { upload } from '../middlewares/upload-middleware.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Public route to fetch About Snapshot section for landing page
router.get('/', getAboutSnapshot);

// Admin route to fetch full About Snapshot section config
router.get(
  '/admin',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getAboutSnapshotAdmin
);

// Admin route to update About Snapshot section (supports image upload)
router.put(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.single('image'),
  updateAboutSnapshot
);

export default router;
