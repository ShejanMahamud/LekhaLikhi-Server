import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
