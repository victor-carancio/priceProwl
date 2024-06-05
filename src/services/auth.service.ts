import * as bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../responses/customApiError";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const createUser = async (credentials: {
  email: string;
  password: string;
  username?: string;
}) => {
  const { email, password, username } = credentials;

  let user = await prisma.user.findFirst({ where: { email } });

  if (user) {
    throw new BadRequestError("User already exist!");
  }

  const hash = await bcrypt.hash(password, 10);

  user = await prisma.user.create({
    data: {
      email,
      username: username || null,
      password: hash,
    },
  });

  const token = process.env.JWT_SECRET
    ? jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      })
    : null;
  return { userId: user.id, username, email, token };
};

export const loginUser = async (credentials: {
  identifier: string;
  password: string;
}) => {
  const { identifier, password } = credentials;

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: identifier,
        },
        { email: identifier },
      ],
    },
  });

  if (!user) {
    throw new BadRequestError("User doesn´t exist!");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new BadRequestError("User or password invalid");
  }
  const token = process.env.JWT_SECRET
    ? jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
      })
    : null;

  return { userId: user.id, username: user.username, email: user.email, token };
};
