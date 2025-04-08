import express from 'express';
import { authorize } from '../middleware/authorize.js';
import { deleteNotifications, getnotifications, deleteNotification } from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', authorize, getnotifications);
router.delete('/', authorize, deleteNotifications);
router.delete('/:id', authorize, deleteNotification);

export default router;