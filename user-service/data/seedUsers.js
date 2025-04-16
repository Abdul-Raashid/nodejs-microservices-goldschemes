const mongoose = require('mongoose');
const User = require('../models/userModel');
require('dotenv').config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@goldscheme.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    passwordConfirm: 'password123',
    role: 'user',
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing users
    await User.deleteMany();
    console.log('Users deleted');

    // Create new users
    await User.create(users);
    console.log('Users created successfully');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUsers();