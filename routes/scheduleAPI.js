const express = require('express');
const router = express.Router();
const timeslotController = require('../controllers/scheduleController'); 

router.post('/create', timeslotController.addTimeslot);

router.get('/:date', timeslotController.getTimeslotsByDate);

router.get('/:date/alternatives', timeslotController.getAlternativeTimeslots);

router.put('/:id/availability', async (req, res) => {
    const { id } = req.params;
    const { isAvailable } = req.body;
  
    try {
      await timeslotController.updateTimeslotAvailability(id, isAvailable);
      res.status(200).json({ message: 'Timeslot availability updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
