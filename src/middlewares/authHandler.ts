// import { Request, Response, NextFunction } from "express";
// import {
//   BadRequestError,
//   ForbiddenRequestError,
//   NotFoundError,
//   UnauthenticatedError,
// } from "../responses/customApiError";
// import jwt from "jsonwebtoken";
// import prisma from "../db/client.db";

// export const authValidation = async (
//   req: Request,
//   _res: Response,
//   next: NextFunction,
// ) => {
//   const authCookie: string | null = req.cookies.authcookie
//     ? req.cookies.authcookie
//     : null;

//   if (!authCookie) {
//     throw new UnauthenticatedError("Authentication invalid");
//   }

//   const decoded = jwt.verify(
//     authCookie,
//     process.env.JWT_SECRET ? process.env.JWT_SECRET : "",
//     (err, decoded) => {
//       if (err) {
//         if (err.name === "TokenExpiredError") {
//           throw new ForbiddenRequestError("Token expired");
//         }
//         throw new BadRequestError("Invalid token");
//       }
//       return decoded;
//     },
//   ) as any;

//   const user = await prisma.user.findFirst({
//     where: { id: Number(decoded.userId) },
//   });
//   if (!user) {
//     throw new NotFoundError("Token user not found");
//   }

//   if (!user.isActive) {
//     throw new UnauthenticatedError("This user has been disabled.");
//   }
//   req.user = {
//     id: user.id,
//     email: user.email,
//     username: user.username,
//   };

//   next();
// };
