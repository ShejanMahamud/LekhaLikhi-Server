import { z } from 'zod';

export const blogValidationSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Title at least 5 characters long' })
    .max(255, { message: 'Title at most 255 characters long' }),
  content: z
    .string()
    .min(10, { message: 'Content at least 10 characters long' }),
  isPublished: z.boolean({ message: 'isPublished must be a boolean' }),
  author: z.string().uuid({ message: 'Invalid author id' }),
});
