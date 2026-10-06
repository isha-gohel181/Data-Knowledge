import express from 'express';
import {
  getHeroSection,
  getHeroSectionAdmin,
  updateHeroSection,
} from '../controllers/heroSectionController.js';
import { upload } from '../middlewares/upload-middleware.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Public route to fetch hero section for landing page
router.get('/', getHeroSection);

// Admin route to fetch full hero section config
router.get(
  '/admin',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getHeroSectionAdmin
);

// Admin route to update hero section (supports mentorImage upload)
router.put(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.single('mentorImage'),
  updateHeroSection
);

export default router;
