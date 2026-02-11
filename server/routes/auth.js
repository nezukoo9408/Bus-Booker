import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const router = express.Router();

// Get current user (protected)
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// Register a new user
router.post(
  '/register',
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;
      console.log('🔍 Registration attempt:', { name, email, passwordLength: password?.length });

      // Check if user already exists
      console.log('🔍 Checking if user exists...');
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      console.log('✅ Creating new user...');
      const user = new User({ name, email, password });
      console.log('📝 User object created:', { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        passwordExists: !!user.password 
      });

      // Save user to database
      console.log('💾 Saving user to database...');
      await user.save();
      console.log('✅ User saved successfully:', { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        createdAt: user.createdAt 
      });

      // Verify user was actually saved
      const savedUser = await User.findOne({ email });
      if (savedUser) {
        console.log('✅ User verification: Found in database');
      } else {
        console.log('❌ User verification: NOT found in database after save!');
      }

      // Generate JWT token
      console.log('🔑 Generating JWT token...');
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      console.log('✅ Token generated successfully');

      console.log('🎉 Registration completed successfully for:', email);

      res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('❌ Register error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ message: 'Server error', details: error.message });
    }
  }
);

// Login user
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Login validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      console.log('🔍 Login attempt:', { email, passwordLength: password?.length });

      // Find user in database
      console.log('🔍 Finding user in database...');
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      console.log('✅ User found:', { id: user._id, name: user.name, email: user.email });

      // Compare password
      console.log('🔐 Comparing password...');
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('❌ Password mismatch for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      console.log('✅ Password match successful');

      // Generate JWT token
      console.log('🔑 Generating login token...');
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      console.log('✅ Login token generated successfully');

      console.log('🎉 Login completed successfully for:', email);

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('❌ Login error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      res.status(500).json({ message: 'Server error', details: error.message });
    }
  }
);

export default router;
