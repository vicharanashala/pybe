import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    current_chapter: {
      type: Number,
      default: 1,
    },
    saved_scrolls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
