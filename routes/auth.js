const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Registration page
router.get('/register', (req, res) => res.render('register'));

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, email, firstName, lastName, role } = req.body;

  try {
    await userController.registerUser({ username, password, email, firstName, lastName, role });
    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
});

// Login page
router.get('/login', (req, res) => res.render('login'));

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userController.loginUser(username, password);
    req.session.username = user.username;
    req.session.role = user.role; 
    req.flash('success', 'Welcome back!');
    res.redirect('/chatbot');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
});

// Protected chatbot page
router.get('/chatbot', async (req, res) => {
  if (!req.session.username) {
    req.flash('error', 'Please log in to access the chatbot');
    return res.redirect('/login');
  }

  try {
    const user = await userController.getUserDetails(req.session.username);

    const appointments = [
      { doctor: 'Dr. Smith', date: '2024-12-28', time: '10:00 AM', type: 'upcoming' },
      { doctor: 'Dr. Taylor', date: '2024-12-20', time: '2:00 PM', type: 'past' },
    ];

    const chatMessages = [
      { text: 'Welcome to the Healthcare Chatbot!', sender: 'bot' },
      { text: 'How can I assist you today?', sender: 'bot' },
    ];

    const specializations = ['Cardiology', 'Dermatology', 'Neurology'];

    res.render('chatbot', { user, appointments, chatMessages, specializations });
  } catch (error) {
    req.flash('error', 'Something went wrong loading the chatbot');
    res.redirect('/login');
  }
});

// Edit user profile
router.get('/edit-profile', async (req, res) => {
  if (!req.session.username) {
    req.flash('error', 'Please log in to edit your profile');
    return res.redirect('/login');
  }

  try {
    const user = await userController.getUserDetails(req.session.username);
    res.render('edit-profile', { user });
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
});

// Handle user profile edit form submission
router.post('/edit-profile', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, dateOfBirth, role, password } = req.body;

  try {
    const updatedUser = await userController.editUserDetails(req.session.username, {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      role,
      password, 
    });

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/chatbot'); 
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/edit-profile');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
