import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };
  console.log(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Code error: " + err.code);
      console.log(err.message);
      customError.msg = { code: err.code, msg: err.message, meta: err.meta };
    } else {
      customError.msg = "Something went wrong, try again later";
    }
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    if (process.env.NODE_ENV !== "production") {
      console.log(err.message);
      customError.msg = err.message;
    } else {
      customError.msg = "Something went wrong, try again later";
    }
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
