import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user.types';
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'user'],
      required: true,
      default: 'user',
    },
    isBlocked: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
