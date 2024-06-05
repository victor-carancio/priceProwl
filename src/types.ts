// import { Request } from "express";
// import { User } from "@prisma/client";

// export interface customRequest extends Request {
//   user: User;
// }
// import express from "express";
import { User } from "@prisma/client";
declare module "express" {
  interface Request {
    user?: User;
  }
}
export enum StoreTypes {
  STEAM_STORE = "Steam",
  XBOX_STORE = "Xbox",
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
export interface GameInfoAndPrices extends GameStoresPrices {
  infoGame: InfoGame[];
}

export interface InfoGame {
  id: number;
  age_ratings: {
    id: number;
    category: number;
    rating: number;
    synopsis: string;
  }[];
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
  player_perspectives: { id: number; name: string }[];
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
  screenshots: Image[];
  storyline: string;
  summary: string;
  version_title?: string;
  videos: { id: number; name: string; video_id: string }[];
  language_supports: {
    id: number;
    language: { id: number; name: string; native_name: string; locale: string };
  }[];
}

interface Image {
  id: number;
  height: number;
  url: string;
  width: number;
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
}

export interface JwtToken {
  userId: Number;
  email: String;
}
