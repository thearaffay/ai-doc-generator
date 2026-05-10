// Sample Express.js Routes for Testing

const express = require('express');
const router = express.Router();

// Get all users
router.get('/api/users', async (req, res) => {
  // Returns list of users with pagination
  // Query params: page, limit
  res.json({ users: [], total: 0 });
});

// Get user by ID
router.get('/api/users/:id', async (req, res) => {
  // Returns single user object
  // Path param: id (string)
  res.json({ id: req.params.id, name: 'John Doe', email: 'john@example.com' });
});

// Create new user
router.post('/api/users', async (req, res) => {
  // Body: { name, email, password }
  // Returns created user
  res.status(201).json({ id: '123', name: req.body.name, email: req.body.email });
});

// Update user
router.put('/api/users/:id', async (req, res) => {
  // Path param: id
  // Body: { name, email }
  res.json({ id: req.params.id, ...req.body });
});

// Delete user
router.delete('/api/users/:id', async (req, res) => {
  // Path param: id
  // Returns success message
  res.json({ message: 'User deleted successfully' });
});

// User login
router.post('/api/auth/login', async (req, res) => {
  // Body: { email, password }
  // Returns JWT token
  res.json({ token: 'jwt-token-here', user: { id: '123', email: req.body.email } });
});

module.exports = router;
