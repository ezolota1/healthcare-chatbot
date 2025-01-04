const { Doctor, User, Schedule } = require('../models');

// Create a new doctor
const createDoctor = async (req, res) => {
  try {
    const { specialization, userId } = req.body;

    const newDoctor = await Doctor.create({
      specialization,
      userId
    });

    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor', error });
  }
};

// Get all doctors with related User and Schedule data
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
      ]
    });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving doctors', error });
  }
};

// Get a doctor by ID with related User and Schedule data
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['firstName', 'lastName', 'email'] },
      ]
    });

    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving doctor', error });
  }
};

// Get doctors by specialization
const getDoctorsBySpecialization = async (req, res) => {
    try {
      const { specialization } = req.params;  
  
      const doctors = await Doctor.findAll({
        where: { specialization },
        include: [
          { model: User, attributes: ['firstName', 'lastName', 'email'] },
        ]
      });
  
      if (doctors.length > 0) {
        res.status(200).json(doctors);
      } else {
        res.status(404).json({ message: 'No doctors found with that specialization' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving doctors by specialization', error });
    }
  };

// Update a doctor by ID
const updateDoctor = async (req, res) => {
  try {
    const { specialization, userId } = req.body;

    const doctor = await Doctor.findByPk(req.params.id);

    if (doctor) {
      doctor.specialization = specialization;
      doctor.userId = userId;

      await doctor.save();

      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error });
  }
};

// Delete a doctor by ID
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);

    if (doctor) {
      await doctor.destroy();
      res.status(200).json({ message: 'Doctor deleted successfully' });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error });
  }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    getDoctorsBySpecialization
};