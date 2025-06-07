const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['asset', 'liability'], // 只能是 'asset' 或 'liability'
  },
  initialBalance: {
    type: Number,
    required: true,
    default: 0,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // 參照 User model
    required: true,
  },
}, {
  timestamps: true,
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account; 