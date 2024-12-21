import { Response } from 'express';

interface IResponse {
  success: boolean;
  status: number;
  message?: string;
  data?: unknown;
  error?: string | Error;
  cookies?: { [key: string]: string };
  rawResponse?: boolean;
  cookiesOptions?: {
    maxAge?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
  };
}

export const sendResponse = async (
  res: Response,
  responseOptions: IResponse,
) => {
  const {
    success,
    status,
    message,
    data,
    error,
    rawResponse,
    cookies,
    cookiesOptions,
  } = responseOptions;
  if (rawResponse) {
    return res.status(status).send(data);
  }
  if (cookies) {
    for (const [key, value] of Object.entries(cookies)) {
      res.cookie(key, value, {
        maxAge: cookiesOptions?.maxAge,
        httpOnly: cookiesOptions?.httpOnly,
        secure: cookiesOptions?.secure,
        sameSite: cookiesOptions?.sameSite,
      });
    }
  }
  res.status(status).json({
    success,
    message,
    errorType: error instanceof Error ? error.name : undefined,
    statusCode: status,
    data,
    error,
    stack: error instanceof Error ? error.stack : undefined,
  });
};
