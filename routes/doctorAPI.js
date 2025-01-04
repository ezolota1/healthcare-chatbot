const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController'); 

router.post('/doctors', doctorController.createDoctor);

router.get('/doctors', doctorController.getDoctors);

router.get('/doctors/:id', doctorController.getDoctorById);

router.put('/doctors/:id', doctorController.updateDoctor);

router.delete('/doctors/:id', doctorController.deleteDoctor);

router.get('/doctors/specialization/:specialization', doctorController.getDoctorsBySpecialization);

module.exports = router;
