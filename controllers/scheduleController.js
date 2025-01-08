const { TimeSlot } = require('../models'); 
const { Op } = require('sequelize');

const addTimeslot = async (req, res) => {
  try {
    const { date, time } = req.body;

    // Schedule ID and isAvailable are always 1 for now
    const scheduleId = 1;
    const isAvailable = 1;

    const existingTimeslot = await TimeSlot.findOne({
      where: { date, time },
    });

    if (existingTimeslot) {
      return res.status(409).json({ message: 'Timeslot already exists.' });
    }

    const newTimeslot = await TimeSlot.create({ date, time, isAvailable, scheduleId });

    // Send a success response
    res.status(201).json({
      message: 'Timeslot added successfully.',
      timeslot: newTimeslot,
    });
  } catch (error) {
    console.error('Error adding timeslot:', error);
    res.status(500).json({ message: 'An error occurred while adding the timeslot.', error });
  }
};

// Get all timeslots for a specific date
const getTimeslotsByDate = async (date) => {
  const timeslots = await TimeSlot.findAll({ where: { date } });
  if (!timeslots || timeslots.length === 0) {
    throw new Error('No timeslots found for this date');
  }

  return timeslots;
};

// Get alternative available timeslots on the same day, excluding the provided time
const getAlternativeTimeslots = async (date, time, numOptions = 3) => {
    const alternativeTimeslots = await TimeSlot.findAll({
      where: {
        date: date, 
        time: {
          [Op.ne]: time, 
        },
        isAvailable: 1, 
      },
      limit: numOptions, 
    });
  
    if (alternativeTimeslots.length === 0) {
      return { message: 'The day is fully booked!' };
    }
  
    return alternativeTimeslots;
  };

// Update timeslot availability
const updateTimeslotAvailability = async (id, isAvailable) => {
  try {
    console.log("id: ", id);
    const timeslot = await TimeSlot.findOne({
      where: { id },
    });

    if (!timeslot) {
      throw new Error('Timeslot not found');
    }

    timeslot.isAvailable = isAvailable;

    await timeslot.save();
  } catch (error) {
    console.error('Error updating timeslot availability:', error);
  }
};

// Delete a timeslot
const deleteTimeslot = async (id) => {
  const timeslot = await TimeSlot.findByPk(id);
  if (!timeslot) {
    throw new Error('Timeslot not found');
  }

  await timeslot.destroy();

  return { message: 'Timeslot deleted successfully' };
};

module.exports = {
  addTimeslot,
  getTimeslotsByDate,
  getAlternativeTimeslots,
  updateTimeslotAvailability,
  deleteTimeslot,
};
