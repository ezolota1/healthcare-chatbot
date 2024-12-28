const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const users = []; // Mock user database

// Registration page
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    req.flash('error', 'Username already exists');
    return res.redirect('/register');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  req.flash('success', 'Registration successful! Please log in.');
  res.redirect('/login');
});

// Login page
router.get('/login', (req, res) => res.render('login'));

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.username = username;
    req.flash('success', 'Welcome back!');
    res.redirect('/chatbot');
  } else {
    req.flash('error', 'Invalid credentials');
    res.redirect('/login');
  }
});

// Protected chatbot page
router.get('/chatbot', (req, res) => {
  if (!req.session.username) {
    req.flash('error', 'Please log in to access the chatbot');
    return res.redirect('/login');
  }

  const user = {
    name: req.session.username, 
    email: "user@example.com", 
  };

  const appointments = [
    { doctor: "Dr. Smith", date: "2024-12-28", time: "10:00 AM", type: "upcoming" },
    { doctor: "Dr. Taylor", date: "2024-12-20", time: "2:00 PM", type: "past" },
  ];

  const chatMessages = [
    { text: "Welcome to the Healthcare Chatbot!", sender: "bot" },
    { text: "How can I assist you today?", sender: "bot" },
  ];

  const specializations = ["Cardiology", "Dermatology", "Neurology"];

  res.render('chatbot', { user, appointments, chatMessages, specializations });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
