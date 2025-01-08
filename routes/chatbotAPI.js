const express = require('express');
const router = express.Router();

// Mock doctor database
const doctors = [
  { name: "Dr. Smith", specialization: "Cardiologist", availableSlots: ["2024-06-01 10:00", "2024-06-02 14:00"] },
  { name: "Dr. Johnson", specialization: "Dermatologist", availableSlots: ["2024-06-03 11:00", "2024-06-04 15:00"] },
  { name: "Dr. Adams", specialization: "Pediatrician", availableSlots: ["2024-06-05 09:00", "2024-06-06 13:00"] }
];

// chatbot message
router.post('/chatbot-message', (req, res) => {
  const { message } = req.body;
  if (message.toLowerCase().includes('appointment')) {
    res.json({ reply: "What medical issue are you experiencing? Please describe it.", showAppointmentForm: true });
  } else {
    res.json({ reply: "I'm here to help! You can type 'I want to have an appointment' to book an appointment." });
  }
});

// appointment booking
router.post('/book-appointment', (req, res) => {
  const { specialization, date, time } = req.body;
  const dateTime = `${date} ${time}`;

  const doctor = doctors.find(doc => doc.specialization === specialization && doc.availableSlots.includes(dateTime));

  if (doctor) {
    res.json({ message: `Appointment confirmed with ${doctor.name} on ${dateTime}.` });
  } else {
    res.json({ message: "Sorry, no available doctors match your selected time and specialization. Please try a different slot." });
  }
});


router.post('/chat', (req, res) => {
  const { message } = req.body;

  if (message.toLowerCase().includes('appointment')) {
      res.json({ reply: "I can help you with booking an appointment. Please fill out the form below.", showAppointmentForm: true });
  } else if (message.toLowerCase().includes('help')) {
    res.json({ reply: "A representative will contact you shortly.", showAppointmentForm: false });
  }
  else {
      res.json({ reply: "I'm here to help! Please type a valid query.", showAppointmentForm: false });
  }
});

module.exports = router;
