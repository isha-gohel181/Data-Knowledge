import express from 'express';
import {
  getWhyChooseUs,
  getWhyChooseUsAdmin,
  updateWhyChooseUs,
} from '../controllers/whyChooseUsController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Public route to fetch Why Choose Us section for landing page
router.get('/', getWhyChooseUs);

// Admin route to fetch full Why Choose Us section config
router.get(
  '/admin',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getWhyChooseUsAdmin
);

// Admin route to update Why Choose Us section
router.put(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  updateWhyChooseUs
);

export default router;
