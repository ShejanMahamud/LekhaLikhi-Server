import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import QueryBuilder from '../builder/QueryBuilder';
import { sendResponse } from '../helpers/responseHandler';
import { BlogModel } from '../models/blog.model';
import { blogValidationSchema } from '../validators/blog.validation';

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedBlog = blogValidationSchema.parse(req.body);
    const blog = new BlogModel(validatedBlog);
    await blog.save();
    const populatedBlog = await BlogModel.findById(blog._id).populate('author');
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
    const { id } = req.query;
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
    const populatedBlog = await BlogModel.findById(id).populate('author');
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

    if (!req.query) {
      const blogs = await BlogModel.find().populate('author');
      return sendResponse(res, {
        status: StatusCodes.OK,
        success: true,
        message: 'Blogs fetched successfully',
        data: blogs,
      });
    }

    const blogs = new QueryBuilder(BlogModel.find(), validQuery)
      .search(['title', 'content'])
      .filter()
      .sortBy()
      .sortOrder()
      .modelQuery.populate('author')
      .exec();

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
    const { id } = req.query;
    const isAdmin = await BlogModel.exists({ _id: user?.id, role: 'admin' });
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
