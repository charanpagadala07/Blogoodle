import express from 'express';
import { authorize } from '../middleware/authorize.js';
import { createBlog, deleteBlog, commentOnBlog, likeunlikeBlog, getallblogs, getlikedblogs, followingblogs, userBlogs } from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/all', authorize, getallblogs);
router.get('/liked/:id', authorize, getlikedblogs);
router.get('/following', authorize, followingblogs);
router.get('/user/:username', authorize, userBlogs);
router.post('/create', authorize, createBlog);
router.post('/like/:id', authorize, likeunlikeBlog);
router.post('/comment/:id', authorize, commentOnBlog);
router.delete('/:id', authorize, deleteBlog);


export default router;