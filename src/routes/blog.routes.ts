import express from 'express';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  updateBlog,
} from '../controllers/blog.controllers';
import authenticateToken from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticateToken, getAllBlogs);
router.delete('/:id', authenticateToken, deleteBlog);
router.patch('/:id', authenticateToken, updateBlog);
router.post('/', authenticateToken, createBlog);

export default router;
