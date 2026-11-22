import express from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/login', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mathina Chicken Center Auth Login API. Send a POST request with email and password.',
  });
});

router.get('/register', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mathina Chicken Center Auth Register API. Send a POST request with registration details.',
  });
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;
