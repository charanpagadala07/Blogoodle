import express from 'express';
import { authorize } from '../middleware/authorize.js';
import { getUserProfile, connectUser, getsuggestedUsers, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

// Static routes
router.get('/suggested', authorize, getsuggestedUsers);
router.post('/update', authorize, updateProfile);

// Dynamic routes
router.get('/profile/:username', authorize, getUserProfile);
router.post('/connect/:id', authorize, connectUser);

export default router;