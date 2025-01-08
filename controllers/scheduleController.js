const { TimeSlot } = require('../models'); 
const { Op } = require('sequelize');

// Add a new timeslot
const addTimeslot = async (timeslotData) => {
    const { time, date } = timeslotData;
  
    // Schedule ID and isAvailable are always 1 for now
    const scheduleId = 1;
    const isAvailable = 1;
  
    const existingTimeslot = await TimeSlot.findOne({ where: { date, time } });
    if (existingTimeslot) {
      throw new Error('Timeslot already exists for this date and time.');
    }
  
    const newTimeslot = await TimeSlot.create({
      date,
      time,
      scheduleId,
      isAvailable
    });
  
    return newTimeslot;
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
