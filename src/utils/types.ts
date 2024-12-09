import { StorePrice } from "@prisma/client";

export interface ShortInfoFormat {
  id: number;
  gameName: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
  stores: StoreShortPrismaFormat[];
}

export interface CompleteInfoFormat {
  id: number;
  gameName: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
  stores: StoreCompletePrismaFormat[];
}

export interface StoreShortPrismaFormat {
  id: number;
  store: string;
  type: string;
  url: string;
  edition: string;
  gamepass?: boolean;
  createdAt: Date;
  updatedAt: Date;
  game_id: number;
  info_price: StorePrice[];
  info_game: InfoGameClassShort;
}

export interface StoreCompletePrismaFormat {
  id: number;
  store: string;
  type: string;
  url: string;
  edition: string;
  gamepass?: boolean;
  createdAt: Date;
  updatedAt: Date;
  game_id: number;
  info_price: StorePrice[];
  info_game: InfoGameClassComplete;
}

export type OrderPriceByStore = Pick<StoreCompletePrismaFormat, "info_price">;

// export interface InfoGameShort {
//   game_id: number;
//   info_game_id: number;
//   info_game: InfoGameClassShort;
// }

export interface InfoGameComplete {
  game_id: number;
  info_game_id: number;
  info_game: InfoGameClassComplete;
}

export interface InfoGameClassComplete {
  id: number;
  storeIdGame: string;
  about: string;
  description: string;
  release_date: string;
  imgStore: string;
  developer: string;
  publisher: string;
  pc_requirements?: {
    id: number;
    minimum: string;
    recommended: string;
  };
  screenshots: {
    id: number;
    url: string;
    thumbUrl: string;
    info_game_id: number;
  }[];
  supportedLanguages?: string;
  videos?: {
    id: number;
    title: string;
    url: string;
    thumbnail: string;
    info_game_id: number;
  }[];
  website?: string;

  genres: GenreElement[];
  categories: CategoryElement[];
  ratings: RatingElement[];
}

export interface InfoGameClassShort {
  id: number;
  description: string;
  about: string;
  imgStore: string;
  release_date: string;
  storeIdGame: string;
  genres: GenreElement[];
  categories: CategoryElement[];
}

export interface GenreElement {
  genre_id: number;
  info_game_id: number;
  genre: {
    id: number;
    genre: string;
  };
}
export interface CategoryElement {
  category_id: number;
  info_game_id: number;
  category: {
    id: number;
    category: string;
  };
}

export interface RatingElement {
  rating_id: number;
  info_game_id: number;
  rating: {
    id: number;
    name: string;
    descriptors: string;
    rating: string;
  };
}

export interface Info {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  discount_percent: string;
  initial_price: string;
  final_price: string;
  offer_end_date: null;
  currency: string;
  store_game_id: number;
}

interface StoreFinalFormat {
  // id: number;
  // storeIdGame: string;
  // store: string;
  // type: string;
  // url: string;
  // imgStore: string;
  // edition: string;
  // gamepass?: boolean;
  // createdAt: Date;
  // updatedAt: Date;

  // game_id: number;
  info_price: StorePrice;
}
// interface InfoGameFinalClassShort {
//   id: number;
//   name: string;
//   first_release_date: string;
//   storyline: null;
//   summary: string;
//   version_title: string;
//   cover: Cover;

// }

export interface ShortFinalFormat {
  id: number;
  gameName: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
  stores: StoreFinalFormat[];
  // infoGame: InfoGameFinalClassShort[];
}

export type Jio = Pick<ShortFinalFormat, "stores">;

export interface StoreIds {
  id: number;
  store: string;
  info_game: { storeIdGame: string };
  game: { gameName: string };
}
