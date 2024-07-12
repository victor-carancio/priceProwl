// import { PrismaClient } from "@prisma/client";
import { UserTokenData } from "../types";
import { BadRequestError, NotFoundError } from "../responses/customApiError";
import prisma from "../db/client.db";

// const prisma = process.env.NODE_ENV === "test" ? prismaTest : prismaClient;

export const findWishListOfUser = async (user: UserTokenData) => {
  const { id } = user;

  const findWishList = await prisma.userGameWishList.findMany({
    where: {
      user: { id },
    },
    include: {
      game: {
        include: {
          stores: {
            include: {
              info: true,
            },
          },
          infoGame: {
            include: {
              info_game: {
                include: {
                  artworks: true,
                  cover: true,
                  platforms: {
                    include: {
                      platform: true,
                    },
                  },
                  screenshots: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return findWishList;
};

export const addGameToWishList = async (
  user: UserTokenData,
  game: { gameId: number },
) => {
  const { id } = user;
  const { gameId } = game;

  const existingWishList = await prisma.userGameWishList.findUnique({
    where: {
      game_id_user_id: {
        game_id: gameId,
        user_id: id,
      },
    },
  });

  if (existingWishList) {
    throw new BadRequestError("Game already in wishlist");
  }

  const wishList = await prisma.userGameWishList.create({
    data: {
      game: { connect: { id: gameId } },
      user: { connect: { id } },
    },
    include: {
      game: true,
    },
  });

  return { wishList };
};

export const removeFromWishList = async (
  user: UserTokenData,
  game: { gameId: number },
) => {
  const { id } = user;
  const { gameId } = game;

  const existingWishList = await prisma.userGameWishList.findUnique({
    where: {
      game_id_user_id: {
        game_id: gameId,
        user_id: id,
      },
    },
  });

  if (!existingWishList) {
    throw new NotFoundError("The game wasn't find in the wish list. ");
  }

  await prisma.userGameWishList.delete({
    where: {
      game_id_user_id: {
        game_id: gameId,
        user_id: id,
      },
    },
  });
};
