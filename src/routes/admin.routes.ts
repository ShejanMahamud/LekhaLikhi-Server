import { Router } from 'express';
import { deleteAnyBlogByAdmin } from '../controllers/blog.controllers';
import { blockUser } from '../controllers/user.controller';

const router = Router();

router.patch('/users/:userId/block', blockUser);
router.delete('/blogs/:id', deleteAnyBlogByAdmin);

export default router;
