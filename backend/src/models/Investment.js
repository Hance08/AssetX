const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const investmentSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment; 