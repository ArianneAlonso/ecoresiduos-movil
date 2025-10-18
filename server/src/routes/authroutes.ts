import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    deleteUserAccount,
    createDriver
} from '../controllers/authcontroller';
import { protect, isAdmin } from '../middlewares/authmiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)
    .delete(protect, deleteUserAccount);

// Ruta de Admin
router.post('/drivers', protect, isAdmin, createDriver);

export default router;