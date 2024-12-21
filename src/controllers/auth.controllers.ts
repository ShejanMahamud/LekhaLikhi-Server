import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import config from '../config';
import { sendResponse } from '../helpers/responseHandler';
import { UserModel } from '../models/user.model';
import { userValidationSchema } from '../validators/user.validation';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedUser = userValidationSchema.parse(req.body);

    const userExists = await UserModel.exists({ email: validatedUser.email });
    if (userExists) {
      return sendResponse(res, {
        status: StatusCodes.CONFLICT,
        success: false,
        message: 'User already exists',
      });
    }

    const user = new UserModel(validatedUser);
    await user.save();
    sendResponse(res, {
      status: StatusCodes.CREATED,
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = userValidationSchema.parse(req.body);

    if (!password || !email) {
      return sendResponse(res, {
        status: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return sendResponse(res, {
        status: StatusCodes.UNAUTHORIZED,
        success: false,
        message: 'User not found',
      });
    }

    if (!user.password) {
      return sendResponse(res, {
        status: StatusCodes.UNAUTHORIZED,
        success: false,
        message: 'User has no password set. Contact support',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return sendResponse(res, {
        status: StatusCodes.UNAUTHORIZED,
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
    );

    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: 'User logged in successfully',
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};
