import express from 'express';
import {
  createProgram,
  getPrograms,
  getProgramsAdmin,
  getProgramById,
  updateProgram,
  deleteProgram,
  toggleProgramStatus,
} from '../controllers/programOfferController.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Public routes
router.get('/', getPrograms);
router.get('/active', getPrograms);

// Admin routes
router.get(
  '/admin/all',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getProgramsAdmin
);

// Get by ID route
router.get('/:id', getProgramById);

router.post(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  createProgram
);

router.put(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  updateProgram
);

router.delete(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deleteProgram
);

router.patch(
  '/:id/toggle',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  toggleProgramStatus
);

export default router;
