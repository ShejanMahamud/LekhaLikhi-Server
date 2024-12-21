import cors from 'cors';
import type { Application, NextFunction, Request, Response } from 'express';
import express from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { sendResponse } from '../helpers/responseHandler';
import adminRoutes from '../routes/admin.routes';
import authRoutes from '../routes/auth.routes';
import blogRoutes from '../routes/blog.routes';

import { ErrorWithStatus } from '../types/global';
import { CustomError } from '../utils/customError';

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: [config.clientUrl || ''],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is Running! 🏃' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  const error = new CustomError('Requested URL Not Found', 404);
  next(error);
});

//Global Error Handler
app.use(
  (
    error: ErrorWithStatus,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    let errorMessage = error.message || 'Internal Server Error!';

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      errorMessage = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
    }

    console.error('🛑 Error: ' + errorMessage);
    if (res.headersSent) {
      return next(error);
    }

    sendResponse(res, {
      status: error.status || 500,
      success: false,
      message: errorMessage,
      error,
    });
  },
);

app.all('*', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Page Not Found' });
});

export default app;
