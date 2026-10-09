import express from 'express';
import passport from 'passport';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import isUserBanned from '../middlewares/isUserBanned.js';
import DashboardController from '../controllers/dashboardController.js';

const router = express.Router();

// GET /dashboard/ - learner dashboard overview
router.get(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isUserBanned,
  DashboardController.getDashboard
);

export default router;
