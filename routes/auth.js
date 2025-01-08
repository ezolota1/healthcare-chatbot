const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const { Doctor, Appointment, Patient, User, TimeSlot } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// Registration page
router.get('/register', (req, res) => res.render('register'));

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password, email, firstName, lastName, keyword } = req.body;

  try {
    await userController.registerUser({ username, password, email, firstName, lastName, keyword });
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

    if (req.session.role === 'patient') {
      const patient = await Patient.findOne({ where: { userId: user.id } });

      const appointments = await Appointment.findAll({
        where: { patientId: patient.id,
          status: {
          [Op.or]: ['Pending', 'Approved']
        }  },
        include: [
          {
            model: Doctor,
            attributes: ['specialization'],
            include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
          }
        ],
        order: [['date', 'ASC']]
      });

      const formattedAppointments = appointments.map(appointment => ({
        id: appointment.id,
        doctor: appointment.Doctor ? `Dr. ${appointment.Doctor.User.firstName} ${appointment.Doctor.User.lastName}` : 'Unknown',
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        type: new Date(appointment.date) < new Date() ? 'past' : 'upcoming'
      }));

      const chatMessages = [
        { text: 'Welcome to the Healthcare Chatbot!', sender: 'bot' },
        { text: 'How can I assist you today?', sender: 'bot' }
      ];

      const specializations = await Doctor.findAll({
        attributes: ['specialization'],
        group: ['specialization']
      });

      const specializationList = specializations.map(doc => doc.specialization);

      return res.render('chatbot', {
        user,
        appointments: formattedAppointments,
        chatMessages,
        specializations: specializationList
      });
    } else if (req.session.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: user.id } });

      const appointments = await Appointment.findAll({
        where: { doctorId: doctor.id, status: 'Approved' },
        include: [
          {
            model: Patient,
            include: [{ model: User, attributes: ['firstName', 'lastName', 'email'] }]
          }
        ],
        order: [['date', 'ASC']]
      });

      const formattedAppointments = appointments.map(appointment => ({
        id: appointment.id,
        patient: `${appointment.firstName} ${appointment.lastName}`,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      }));

      const pendingAppointments = await Appointment.findAll({
        where: { doctorId: doctor.id, status: 'Pending' },
        include: [
          {
            model: Patient,
            include: [{ model: User, attributes: ['firstName', 'lastName'] }]
          }
        ]
      });

      const formattedPendingAppointments = pendingAppointments.map(appointment => ({
        id: appointment.id,
        patient: `${appointment.firstName} ${appointment.lastName}`,
        date: appointment.date,
        time: appointment.time
      }));

      // const timeslots = [
      //   { date: "2025-01-10", time: "09:00" },
      //   { date: "2025-01-10", time: "10:30" },
      //   { date: "2025-01-10", time: "14:00" },
      //   { date: "2025-01-11", time: "08:30" },
      //   { date: "2025-01-11", time: "12:00" },
      //   { date: "2025-01-11", time: "16:00" },
      //   { date: "2025-01-12", time: "11:00" },
      //   { date: "2025-01-12", time: "13:30" }
      // ];

      const timeslots = await TimeSlot.findAll({
        where: {
          scheduleId: 1, 
          isAvailable: 1,
          
          [Op.and]: [
            {
              date: {
                [Op.gte]: moment().format('YYYY-MM-DD'), 
              },
            },
            {
              
              [Op.or]: [
                { date: { [Op.gt]: moment().format('YYYY-MM-DD') } }, 
                {
                  [Op.and]: [
                    { date: moment().format('YYYY-MM-DD') }, 
                    { time: { [Op.gt]: moment().format('HH:mm') } }, 
                  ],
                },
              ],
            },
          ],
        },
        order: [['date', 'ASC'], ['time', 'ASC']], 
      });

      return res.render('doctor', {
        user,
        appointments: formattedAppointments,
        pendingAppointments: formattedPendingAppointments,
        timeslots: timeslots
      });
    }
  } catch (error) {
    console.log(error);
    req.flash('error', 'An error occurred while loading the chatbot.');
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
