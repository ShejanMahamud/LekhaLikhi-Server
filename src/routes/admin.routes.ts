import { Router } from 'express';
import { deleteAnyBlogByAdmin } from '../controllers/blog.controllers';
import { blockUser } from '../controllers/user.controller';
import authenticateToken from '../middlewares/auth.middleware';

const router = Router();

router.patch('/users/:userId/block', authenticateToken, blockUser);
router.delete('/blogs/:id', authenticateToken, deleteAnyBlogByAdmin);

export default router;
