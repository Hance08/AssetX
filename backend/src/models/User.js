const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // 自動加入 createdAt 和 updatedAt 時間戳
});

const User = mongoose.model('User', userSchema);

module.exports = User; 