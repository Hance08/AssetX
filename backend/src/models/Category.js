const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, '分類名稱為必填'],
    trim: true,
  },
  icon: {
    type: String,
    default: 'HelpOutline', // A sensible default icon
  },
  subcategories: [
    {
      type: String,
      trim: true,
    },
  ],
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Ensure that for a given user, the category name is unique.
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema); 