const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'A purchase must belong to a user'],
    },
    schemeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Scheme',
      required: [true, 'A purchase must have a scheme'],
    },
    amount: {
      type: Number,
      required: [true, 'A purchase must have an amount'],
    },
    goldWeightInGrams: {
      type: Number,
      required: [true, 'A purchase must specify gold weight'],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    maturityDate: {
      type: Date,
      required: [true, 'A purchase must have a maturity date'],
    },
    status: {
      type: String,
      enum: ['active', 'matured', 'cancelled'],
      default: 'active',
    },
  }
);
// Populate scheme details when querying purchases
purchaseSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'schemeId',
      select: 'name type durationYears interestRate',
    });
    next();
  });
  
  const Purchase = mongoose.model('Purchase', purchaseSchema);
  module.exports = Purchase;