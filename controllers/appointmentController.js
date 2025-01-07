const { Appointment, Doctor, Patient, TimeSlot } = require('../models');

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      uniqueId, 
      description, 
      date,
      time,
      specialization 
    } = req.body;

    const doctor = await Doctor.findOne({ where: { specialization } });
    if (!doctor) {
      return res.status(404).json({ message: 'No doctor available with the selected specialization' });
    }

    const user = await userController.getUserDetails(req.session.username);
   
    const userId = user.id; 
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const newAppointment = await Appointment.create({
      firstName,
      lastName,
      uniquePersonalIdentificationNumber: uniqueId,
      issueDescription: description,
      date,
      time,
      status: 'Pending',
      doctorId: doctor.id,
      patientId: patient.id,
      timeSlotId: null // Adjust as needed if timeSlotId logic is implemented later
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};


// Get all appointments with related Doctor, Patient, and TimeSlot data
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Doctor, attributes: ['name', 'specialization'] },
        { model: Patient, attributes: ['firstName', 'lastName'] },
        { model: TimeSlot, attributes: ['startTime', 'endTime'] }
      ]
    });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error });
  }
};

// Get an appointment by ID with related Doctor, Patient, and TimeSlot data
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Doctor, attributes: ['name', 'specialization'] },
        { model: Patient, attributes: ['firstName', 'lastName'] },
        { model: TimeSlot, attributes: ['startTime', 'endTime'] }
      ]
    });

    if (appointment) {
      res.status(200).json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointment', error });
  }
};

// Update an appointment by ID
const updateAppointment = async (req, res) => {
  try {
    const { firstName, lastName, uniquePersonalIdentificationNumber, issueDescription, date, time, status, doctorId, patientId, timeSlotId } = req.body;

    const appointment = await Appointment.findByPk(req.params.id);

    if (appointment) {
      appointment.firstName = firstName;
      appointment.lastName = lastName;
      appointment.uniquePersonalIdentificationNumber = uniquePersonalIdentificationNumber;
      appointment.issueDescription = issueDescription;
      appointment.date = date;
      appointment.time = time;
      appointment.status = status;
      appointment.doctorId = doctorId;
      appointment.patientId = patientId;
      appointment.timeSlotId = timeSlotId;

      await appointment.save();

      res.status(200).json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

// Delete an appointment by ID
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (appointment) {
      await appointment.destroy();
      res.status(200).json({ message: 'Appointment deleted successfully' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};
