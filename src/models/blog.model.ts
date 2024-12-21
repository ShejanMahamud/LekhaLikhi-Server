import { model, Schema } from 'mongoose';
import { IBlog } from '../types/blog.types';

const blogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export const BlogModel = model<IBlog>('Blog', blogSchema);
