// import { Request } from "express";
// import { User } from "@prisma/client";

// export interface customRequest extends Request {
//   user: User;
// }
// import express from "express";

declare module "express" {
  interface Request {
    user?: UserTokenData;
  }
}

export interface UserTokenData {
  id: number;
  username: string | null;
  email: string;
}
export enum StoreTypes {
  STEAM_STORE = "Steam",
  // XBOX_STORE = "Xbox",
  EPIC_STORE = "Epic",
}

export interface GamePriceInfo {
  gameName: string;
  url: string;
  discount_percent?: string;
  initial_price?: string;
  final_price?: string;
  gamepass?: boolean;
}

export interface StoreInfo {
  [storeName: string]: GamePriceInfo[] | [];
}

export interface IGDBQueries {
  [key: string]: string;
}

export interface StorePriceInfo {
  store: string;
  url: string;
  edition: string;
  gamepass?: boolean;
  info: {
    discount_percent?: string;
    initial_price?: string;
    final_price?: string;
  };
}
export interface GameStoresPrices {
  gameName: string;
  stores: StorePriceInfo[];
}
export interface GameInfoAndPrices {
  gameName: string;
  stores: StorePriceInfo[];
  infoGame: InfoGame[];
}

export interface InfoGame {
  id: number;
  alternative_names: AlternativeName[];
  artworks: Image[];
  cover: Image;
  first_release_date: number;
  game_engines: { id: number; name: string }[];
  genres: { id: number; name: string }[];
  involved_companies: {
    id: number;
    developer: boolean;
    porting: boolean;
    publisher: boolean;
    supporting: boolean;
    company: {
      id: number;
      country: number;
      logo: Image;
      name: string;
      start_date: number;
    };
  }[];
  keywords: { id: number; name: string }[];
  name: string;
  platforms: {
    id: number;
    abbreviation: string;
    alternative_name: string;
    name: string;
    platform_logo: Image;
  }[];
  release_dates: {
    id: number;
    category: number;
    date: number;
    platform: {
      id: number;
      abbreviation: string;
      alternative_name: string;
      name: string;
      platform_logo: Image;
    };
    region: number;
  }[];
  storyline: string;
  summary: string;
  version_title?: string;
  videos: { id: number; name: string; video_id: string }[];
}

interface Image {
  id: number;
  height: number;
  url: string;
  width: number;
  image_id: string;
}

export interface AlternativeName {
  id: number;
  comment: string;
  name: string;
}

export interface PriceFromUrlScraped {
  gamepass?: boolean;
  discount_percent: string;
  initial_price: string;
  final_price: string;
  offerEndDate?: string;
}

export interface JwtToken {
  userId: Number;
  email: String;
}

export interface WishList {
  user: {
    userId: number;
    email: string;
    notified: boolean;
    userName: string | null;
  };
  games: {
    gameName: string;
    store: string;
    gamepass: boolean | null;
    url: string;
    storeGame: number;
    initial_price: string;
    final_price: string;
    offer_end_date: Date | null;
    discount_percent: string;
    cover: Image | null;
    summary: string | null;
  }[];
}
