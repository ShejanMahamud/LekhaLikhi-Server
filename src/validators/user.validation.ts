import { z } from 'zod';

export const userValidationSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'Name at least 5 characters long' })
    .max(255, { message: 'Name at most 255 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password at least 8 characters long' }),
  role: z.enum(['admin', 'user'], {
    message: 'Invalid role, Only admin and user roles are allowed',
  }),
  isBlocked: z.boolean({ message: 'isBlocked must be a boolean' }),
});
