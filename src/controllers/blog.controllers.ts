import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import QueryBuilder from '../builder/QueryBuilder';
import { sendResponse } from '../helpers/responseHandler';
import { BlogModel } from '../models/blog.model';
import { UserModel } from '../models/user.model';
import { blogValidationSchema } from '../validators/blog.validation';

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedBlog = blogValidationSchema.parse(req.body);
    validatedBlog.author = (req.user as { id: string }).id;
    const blog = new BlogModel(validatedBlog);
    await blog.save();
    const populatedBlog = await BlogModel.findById(blog._id).populate({
      path: 'author',
      select: 'email name',
    });
    sendResponse(res, {
      status: StatusCodes.CREATED,
      success: true,
      message: 'Blog created successfully',
      data: populatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as { id: string };
    const { id } = req.params;
    const validatedBlog = blogValidationSchema.parse(req.body);
    const isOwnBlog = await BlogModel.exists({ _id: id, author: user?.id });
    if (!isOwnBlog) {
      return sendResponse(res, {
        status: StatusCodes.FORBIDDEN,
        success: false,
        message: 'You are not authorized to update this blog',
      });
    }
    const blog = await BlogModel.updateOne({ _id: id }, validatedBlog);
    if (blog.modifiedCount === 0) {
      return sendResponse(res, {
        status: StatusCodes.NOT_MODIFIED,
        success: false,
        message: 'Blog not modified',
      });
    }
    const populatedBlog = await BlogModel.findById(id).populate({
      path: 'author',
      select: 'name email',
    });
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: 'Blog updated successfully',
      data: populatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as { id: string };
    const { id } = req.query;
    const isOwnBlog = await BlogModel.exists({ _id: id, author: user?.id });
    if (!isOwnBlog) {
      return sendResponse(res, {
        status: StatusCodes.FORBIDDEN,
        success: false,
        message: 'You are not authorized to delete this blog',
      });
    }
    await BlogModel.deleteOne({ _id: id });
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sanitizeQuery = z.object({
      search: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.string().optional(),
      filter: z.string().optional(),
    });
    const validQuery = sanitizeQuery.parse(req.query);

    if (
      !req.query.search &&
      !req.query.sortBy &&
      !req.query.filter &&
      !req.query.sortOrder
    ) {
      const blogs = await BlogModel.find({}).populate({
        path: 'author',
        select: 'name email',
      });
      return sendResponse(res, {
        status: StatusCodes.OK,
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs,
      });
    }

    const blogs = await new QueryBuilder(BlogModel.find(), validQuery)
      .search(['title', 'content'])
      .filter()
      .sortBy()
      .sortOrder()
      .modelQuery.populate({
        path: 'author',
        select: 'name email',
      })
      .exec();

    if (blogs.length === 0) {
      return sendResponse(res, {
        status: StatusCodes.NOT_FOUND,
        success: false,
        message: 'No blogs found',
      });
    }

    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: 'Blogs fetched successfully',
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnyBlogByAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user as { id: string };
    console.log('user', user);
    const { id } = req.params;
    const isAdmin = await UserModel.exists({ _id: user?.id, role: 'admin' });
    if (!isAdmin) {
      return sendResponse(res, {
        status: StatusCodes.FORBIDDEN,
        success: false,
        message: 'You are not authorized to delete a blog',
      });
    }
    await BlogModel.deleteOne({ _id: id });
    sendResponse(res, {
      status: StatusCodes.OK,
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
