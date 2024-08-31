import { StoreGame } from "@prisma/client";

export interface ShortInfoFormat {
  id: number;
  gameName: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
  stores: StoreGame[];
  infoGame: InfoGameShort[];
}

export interface CompleteInfoFormat {
  id: number;
  gameName: string;
  platform: string;
  createdAt: Date;
  updatedAt: Date;
  stores: StoreGame[];
  infoGame: InfoGameComplete[];
}

export interface InfoGameShort {
  game_id: number;
  info_game_id: number;
  info_game: InfoGameClassShort;
}

export interface InfoGameComplete {
  game_id: number;
  info_game_id: number;
  info_game: InfoGameClassComplete;
}

export interface InfoGameClassComplete {
  id: number;
  name: string;
  first_release_date: string;
  storyline: null;
  summary: string;
  version_title: string;
  cover: Cover;
  artworks: Cover[];
  alternative_names: AlternativeNameElement[];
  game_engines: GameEngine[];
  involved_companies: InvolvedCompany[];
  videos: Video[];
  genres: GenreElement[];
  keywords: Keyword[];
  platforms: PlatformElement[];
}

export interface InfoGameClassShort {
  id: number;
  name: string;
  first_release_date: string;
  storyline: null;
  summary: string;
  version_title: string;
  cover: Cover;
  genres: GenreElement[];
  keywords: Keyword[];
  platforms: PlatformElement[];
}

export interface Cover {
  id: number;
  height: number;
  url: string;
  width: number;
  image_id: string;
  info_game_id: number;
}

export interface GenreElement {
  genre: KeywordClass;
}

export interface KeywordClass {
  name: string;
  id: number;
}

export interface Keyword {
  keyword: KeywordClass;
}

export interface PlatformElement {
  platform: PlatformPlatform;
}

export interface PlatformPlatform {
  id: number;
  name: string;
  abbreviation: string;
  alternative_name: string;
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

export interface AlternativeNameElement {
  alternative_name: GameEngineClass;
}

export interface GameEngineClass {
  id: number;
  name: string;
}

export interface GameEngine {
  game_engine: GameEngineClass;
}

export interface InvolvedCompany {
  id: number;
  developer: boolean;
  porting: boolean;
  publisher: boolean;
  supporting: boolean;
  company: Company;
}

export interface Company {
  id: number;
  country: number;
  name: string;
  start_date: string;
}

export interface Video {
  id: number;
  name: string;
  video_id: string;
  info_game_id: number;
}
