import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  getAllUsers, 
  updateUserByAdmin, 
  deleteUserByAdmin 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin User Management Routes
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);

export default router;

