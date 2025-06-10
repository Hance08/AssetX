const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  accountId: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  transferId: {
    type: Schema.Types.ObjectId,
    default: null,
  },
}, {
  timestamps: true,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 