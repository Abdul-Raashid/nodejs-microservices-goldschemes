const mongoose = require('mongoose');
const Scheme = require('../models/schemeModel');
require('dotenv').config();

const schemes = [
  {
    name: 'Gold Monetization Scheme - Short Term',
    description: 'Short-term gold monetization scheme with 1.5% interest rate for a duration of 1-3 years.',
    type: 'short-term',
    durationYears: 3,
    interestRate: 1.5,
    minimumInvestment: 10000,
    active: true,
  },
  {
    name: 'Gold Monetization Scheme - Medium Term',
    description: 'Medium-term gold monetization scheme with 2.5% interest rate for a duration of 5-7 years.',
    type: 'medium-term',
    durationYears: 7,
    interestRate: 2.5,
    minimumInvestment: 25000,
    active: true,
  },
  {
    name: 'Gold Monetization Scheme - Long Term',
    description: 'Long-term gold monetization scheme with 3.0% interest rate for a duration of 12-15 years.',
    type: 'long-term',
    durationYears: 15,
    interestRate: 3.0,
    minimumInvestment: 50000,
    active: true,
  },
];

const seedSchemes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing schemes
    await Scheme.deleteMany();
    console.log('Schemes deleted');

    // Create new schemes
    await Scheme.create(schemes);
    console.log('Schemes created successfully');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedSchemes();
