import express from 'express';
import { authorize } from '../middleware/authorize.js';
import { getUserProfile, connectUser } from '../controllers/user.controller.js'

const router = express.Router();

router.get('/profile/:username',authorize, getUserProfile);
// router.get('/suggested',authorize, getUserSuggestions);
router.post('/connect/:id',authorize, connectUser);
// router.post('/update',authorize, updateUserProfile);


export default router;