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
  XBOX_STORE = "Xbox",
  EPIC_STORE = "Epic",
}

export enum CurrencyCodes {
  CL = "CL",
  US = "US",
}

export enum SearchFilters {
  GENRE_CATEGORY = "genre category",
  GENRE = "genre",
  CATEGORY = "category",
}

export enum SortFilters {
  PRICE = "price",
  ALPHABETICAL = "alphabetical",
  // GENRE = "genre",
  // CATEGORY = "category",
}

export enum OrderFilters {
  ASC = "asc",
  DESC = "desc",
}

export interface GamePriceInfo {
  gameName: string;
  url: string;
  gamepass?: boolean;
  infoPrice: {
    discount_percent: string;
    initial_price: string;
    final_price: string;
    currency: string;
  };
  infoGame: {
    storeId: string;
    imgStore: string;
    storeName: string;
    about: string;
    description: string;
    short_description?: string;
    release_date: string;
    developer: string;
    publisher: string;
    categories: string[];
    screenshots: {
      url: string;
      thumbUrl?: string;
    }[];
    videos?: {
      title: string;
      thumbnail: string;
      url: string;
    }[];
    genres: string[];
    pc_requirements?: {
      minimum: string;
      recommended: string;
    };
    website?: string;
    supported_languages?: string;

    //añadir cooming soon y ver que todas las store retornen datos iguales o similares
  };
}

export interface SingleGame {
  store: string;
  type: string;
  storeInfo: GamePriceInfo | null;
}
export interface StoreInfo {
  store: string;
  type: string;
  storeInfo: GamePriceInfo[] | [];
}

export interface IGDBQueries {
  [key: string]: string;
}

export interface FeaturedGameDetail {
  gameName: string;
  url: string;
  type: string;
  store: string;
  feature: string;
  infoPrice: {
    discount_percent: string;
    initial_price: string;
    final_price: string;
    currency: string;
  };
  infoGame: StoreInfoGame;
}

export interface StorePriceInfo {
  store: string;
  type: string;
  url: string;
  edition: string;
  gamepass?: boolean;
  feature?: string;
  infoPrice: {
    discount_percent?: string;
    initial_price?: string;
    final_price?: string;
    currency: string;
  };
  infoGame: StoreInfoGame;
}
export interface GameStoresPrices {
  gameName: string;
  stores: StorePriceInfo[];
}
export interface StoreInfoGame {
  storeId: string;
  imgStore: string;

  about: string;
  description: string;
  release_date: string;
  developer: string;
  publisher: string;
  screenshots: {
    url: string;
    thumbUrl?: string;
  }[];
  videos?: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
  genres: string[];
  categories: string[];
  pc_requirements?: {
    minimum: string;
    recommended: string;
  };
  website?: string;
  supported_languages?: string;
}

export interface GameInfoAndPrices {
  gameName: string;
  stores: StorePriceInfo[];
}
// export interface GameInfoAndPrices {
//   gameName: string;
//   stores: StorePriceInfo[];
//   infoGame: {
//     origin: "IGDB" | "STORE";
//     data: InfoGame[] | StoreInfoGame[];
//   };
// }

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
  offerEndDate: string | null;
  currency: string;
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
  }[];
}
