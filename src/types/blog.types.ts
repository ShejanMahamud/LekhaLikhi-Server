import mongoose from 'mongoose';

export interface IBlog {
  title: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}
