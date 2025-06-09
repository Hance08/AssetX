const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dividendSchema = new mongoose.Schema({
  investmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Investment',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Dividend = mongoose.model('Dividend', dividendSchema);

module.exports = Dividend; 