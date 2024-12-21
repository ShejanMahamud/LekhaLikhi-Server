import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../helpers/responseHandler';
import { UserModel } from '../models/user.model';

export const blockUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as { id: string };
    const { userId } = req.params;
    console.log('user', user);
    const isAdmin = await UserModel.exists({ _id: user?.id, role: 'admin' });
    if (!isAdmin) {
      return sendResponse(res, {
        status: StatusCodes.FORBIDDEN,
        success: false,
        message: 'You are not authorized to block a user',
      });
    }
    const userToBlock = await UserModel.findById(userId);
    if (!userToBlock) {
      return sendResponse(res, {
        status: StatusCodes.NOT_FOUND,
        success: false,
        message: 'User not found',
      });
    }
    if (userToBlock.role === 'admin') {
      return sendResponse(res, {
        status: StatusCodes.FORBIDDEN,
        success: false,
        message: 'You cannot block an admin',
      });
    }
    userToBlock.isBlocked = true;
    await userToBlock.save();
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: 'User blocked successfully',
    });
  } catch (error) {
    next(error);
  }
};
