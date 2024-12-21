//TODO: se utilizara en futuras versiones

import * as bcrypt from "bcryptjs";
// import { PrismaClient } from "@prisma/client";
import {
  BadRequestError,
  ForbiddenRequestError,
} from "../responses/customApiError";
import jwt from "jsonwebtoken";
import { UserTokenData } from "../types";
import prisma from "../db/client.db";

export const createUser = async (credentials: {
  email: string;
  password: string;
  username?: string;
}) => {
  const { email, password, username } = credentials;

  let user = await prisma.user.findFirst({ where: { isActive: false } });

  if (user) {
    throw new ForbiddenRequestError(
      "User account was delete, to reactive, contact support team.",
    );
  }

  user = await prisma.user.findFirst({ where: { email } });

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

  if (!user.isActive) {
    throw new ForbiddenRequestError(
      "User account was delete, to reactive, contact support team.",
    );
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

export const updateUser = async (
  user: UserTokenData,
  info: {
    email?: string;
    password?: string;
    username?: string;
  },
) => {
  const {
    email: emailToUpdate,
    password: passwordToUpdate,
    username: usernameToUpdate,
  } = info;

  const { id } = user;

  // const currUser = await prisma.user.findFirst({where:{id}})
  let hash = passwordToUpdate
    ? await bcrypt.hash(passwordToUpdate, 10)
    : undefined;

  const newUser = await prisma.user.update({
    where: { id },
    data: {
      username: usernameToUpdate,
      email: emailToUpdate,
      password: hash,
    },
  });
  return { id: newUser.id, email: newUser.email, username: newUser.username };
};

export const deleteUser = async (user: UserTokenData) => {
  const { id } = user;

  await prisma.user.update({ where: { id }, data: { isActive: false } });
};
