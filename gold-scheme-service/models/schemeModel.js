// gold-scheme-service/models/schemeModel.js
const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A scheme must have a name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A scheme must have a description'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['short-term', 'medium-term', 'long-term'],
      required: [true, 'A scheme must have a type'],
    },
    durationYears: {
      type: Number,
      required: [true, 'A scheme must have a duration'],
    },
    interestRate: {
      type: Number,
      required: [true, 'A scheme must have an interest rate'],
    },
    minimumInvestment: {
      type: Number,
      required: [true, 'A scheme must have a minimum investment amount'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const Scheme = mongoose.model('Scheme', schemeSchema);
module.exports = Scheme;