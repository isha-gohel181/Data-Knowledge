import express from 'express';
import {
  createPlacementStory,
  getPlacementStories,
  getPlacementStoriesAdmin,
  getPlacementStoryById,
  updatePlacementStory,
  deletePlacementStory,
  togglePlacementStoryStatus,
} from '../controllers/placementStoryController.js';
import { upload } from '../middlewares/upload-middleware.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';
import passport from 'passport';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Public routes
router.get('/', getPlacementStories);
router.get('/:id', getPlacementStoryById);

// Admin routes
router.get(
  '/admin/all',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  getPlacementStoriesAdmin
);

router.post(
  '/',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.fields([{ name: 'thumbnail' }, { name: 'image' }, { name: 'video' }]),
  createPlacementStory
);

router.put(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  upload.fields([{ name: 'thumbnail' }, { name: 'image' }, { name: 'video' }]),
  updatePlacementStory
);

router.delete(
  '/:id',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  deletePlacementStory
);

router.patch(
  '/:id/toggle',
  accessTokenAutoRefresh,
  passport.authenticate('jwt', { session: false }),
  isAdmin,
  togglePlacementStoryStatus
);

export default router;
