import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, minlength: 20, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshTokenHash: { type: String, select: false, default: null },
    refreshTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export default mongoose.model('User', userSchema);
