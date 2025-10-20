import { Router } from 'express';
import { getContainers, createContainer, updateContainer, deleteContainer } from '../controllers/containercontroller';
import { protect, isAdmin } from '../middlewares/authmiddleware';

const router = Router();

router.route('/')
  .get(getContainers)
  .post(protect, isAdmin, createContainer);

router.route('/:id')
  .put(protect, isAdmin, updateContainer)
  .delete(protect, isAdmin, deleteContainer);

export default router;