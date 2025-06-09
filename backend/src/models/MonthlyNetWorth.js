const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monthlyNetWorthSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  netWorth: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// 為了確保同一個使用者在同一個月份只有一筆快照，我們建立一個複合唯一索引
monthlyNetWorthSchema.index({ userId: 1, date: 1 }, { unique: true });

const MonthlyNetWorth = mongoose.model('MonthlyNetWorth', monthlyNetWorthSchema);

module.exports = MonthlyNetWorth; 