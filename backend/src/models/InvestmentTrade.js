const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const investmentTradeSchema = new mongoose.Schema({
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
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell'],
  },
  shares: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

const InvestmentTrade = mongoose.model('InvestmentTrade', investmentTradeSchema);

module.exports = InvestmentTrade; 