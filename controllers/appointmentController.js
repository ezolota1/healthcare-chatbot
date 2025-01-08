const { Appointment, Doctor, Patient, TimeSlot, User } = require('../models');
const userController = require('./userController');
const timeslotController = require('./scheduleController');

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

    const doctor = await Doctor.findOne({ where: { specialization }, include: [
      {
        model: User,  
        attributes: ['firstName', 'lastName', 'email'], 
      }
    ]  });
    if (!doctor) {
      return res.status(404).json({ message: 'No doctor available with the selected specialization' });
    }

    const user = await userController.getUserDetails(req.session.username);
    const userId = user.id; 
    const patient = await Patient.findOne({ where: { userId } });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (!doctor) {
      return res.status(404).json({ message: 'No doctor available with the selected specialization' });
    }

    const hours = time.split(":")[0];
    const formattedTime = `${hours}:00:00`;
    const timeslot = await TimeSlot.findOne({ where: { date, time: formattedTime, isAvailable: 1 }  });
    
    if (!timeslot) {
      console.log(date);
      return res.status(404).json({ message: 'No timeslot available' });
    }

    timeslotController.updateTimeslotAvailability(timeslot.id, 0);

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
      timeSlotId: timeslot.id
    });

    res.status(201).json({
      id: newAppointment.id,
      doctor: doctor ? `Dr. ${doctor.User.firstName} ${doctor.User.lastName}` : 'Unknown',
      date: newAppointment.date,
      time: newAppointment.time,
      status: newAppointment.status
    });
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
        { model: Doctor, attributes: ['specialization'], include: [
          {
            model: User,  
            attributes: ['firstName', 'lastName', 'email'], 
          }
        ]  },
        { model: Patient, attributes: ['medicalRecord'], include: [
          {
            model: User,  
            attributes: ['firstName', 'lastName', 'email'], 
          }
        ] },
        { model: TimeSlot, attributes: ['time', 'date', 'isAvailable'] }
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
        { model: Doctor, attributes: ['specialization'], include: [
          {
            model: User,  
            attributes: ['firstName', 'lastName', 'email'], 
          }
        ]  },
        { model: Patient, attributes: ['medicalRecord'], include: [
          {
            model: User,  
            attributes: ['firstName', 'lastName', 'email'], 
          }
        ] },
        { model: TimeSlot, attributes: ['time', 'date', 'isAvailable'] }
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

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params; 
  const { status } = req.body; 

  const validStatuses = ['Pending', 'Approved', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value' });
  }

  try {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    if(status=='Rejected') {
      timeslotController.updateTimeslotAvailability(appointment.timeSlotId, 1);
      await appointment.destroy();
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating appointment status', error });
  }
};

// Update an appointment by ID
const updateAppointment = async (req, res) => {
  try {
    const { firstName, lastName, uniquePersonalIdentificationNumber, issueDescription, date, time, status } = req.body;

    const appointment = await Appointment.findByPk(req.params.id);

    if (appointment) {
      if(firstName != null) appointment.firstName = firstName;
      if(lastName != null) appointment.lastName = lastName;
      if(uniquePersonalIdentificationNumber != null) appointment.uniquePersonalIdentificationNumber = uniquePersonalIdentificationNumber;
      if(issueDescription != null) appointment.issueDescription = issueDescription;
      if(date != null) appointment.date = date;
      if(time != null) appointment.time = time;
      appointment.status = "Pending";
  

      await appointment.save();

      res.status(200).json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating appointment', error });
  }
};

// Delete an appointment by ID
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (appointment) {
      await appointment.destroy();
      timeslotController.updateTimeslotAvailability(appointment.timeSlotId, 1);
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
  updateAppointmentStatus,
  getAppointmentById,
  updateAppointment,
  deleteAppointment
};
