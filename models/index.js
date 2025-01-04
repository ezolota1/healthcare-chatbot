const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// User model
const User = sequelize.define('User', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  dateOfBirth: { type: DataTypes.DATE, allowNull: true },
  phoneNumber: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.STRING, allowNull: false }, // 'doctor', 'patient', 'human operator'
}, {
  timestamps: true,
});

// Doctor model
const Doctor = sequelize.define('Doctor', {
  specialization: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
});

// Patient model
const Patient = sequelize.define('Patient', {
  medicalRecord: { type: DataTypes.JSON, allowNull: true },
}, {
  timestamps: true,
});

// Appointment model
const Appointment = sequelize.define('Appointment', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  uniquePersonalIdentificationNumber: { type: DataTypes.STRING, allowNull: false },
  issueDescription: { type: DataTypes.STRING, allowNull: true },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  time: { type: DataTypes.TIME, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pending' },
}, {
  timestamps: true,
});

// Schedule Model
const Schedule = sequelize.define('Schedule', {}, { timestamps: true });

// TimeSlot Model
const TimeSlot = sequelize.define('TimeSlot', {
    time: { type: DataTypes.TIME, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
  }, { timestamps: true });

// Associations
User.hasOne(Doctor, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Patient, { foreignKey: 'userId' });
Patient.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

Schedule.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasOne(Schedule, { foreignKey: 'doctorId' });

TimeSlot.belongsTo(Schedule, { foreignKey: 'scheduleId' });
Schedule.hasMany(TimeSlot, { foreignKey: 'scheduleId' });

Appointment.belongsTo(TimeSlot, { foreignKey: 'timeSlotId' });
TimeSlot.hasMany(Appointment, { foreignKey: 'timeSlotId' });

module.exports = {
  sequelize,
  User,
  Doctor,
  Patient,
  Appointment,
  TimeSlot,
};
