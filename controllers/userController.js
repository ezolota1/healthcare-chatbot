const bcrypt = require('bcryptjs');
const { User } = require('../models'); 

// Register a new user
const registerUser = async (userData) => {
  const { username, password, email, firstName, lastName, keyword } = userData;

  const existingUser = await User.findOne({ where: { username } }) || await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Username or email already exists');
  }
  let role = "";

  if (keyword == "doc") {
    role = "doctor";
  } else if (keyword == "op") {
    role = "human operator";
  } else {
    role = "patient";
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    email,
    firstName,
    lastName,
    role,
  });



  return user;
};

// Login user
const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }

  return user;
};

// Get user details
const getUserDetails = async (username) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

// Edit user details
const editUserDetails = async (username, newDetails) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error('User not found');
  }

  // Update user details with the new values
  const { password, firstName, lastName, email, phoneNumber, dateOfBirth, role } = newDetails;

  // Optionally, hash the password if it's updated
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.phoneNumber = phoneNumber || user.phoneNumber;
  user.dateOfBirth = dateOfBirth || user.dateOfBirth;
  user.role = role || user.role;

  await user.save();
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
  editUserDetails,
};
