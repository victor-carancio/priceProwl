import { DataSource } from "typeorm";
import {
  Game,
  StoreGame,
  StorePrice,
  InfoGame,
  AgeRating,
  AlternativeName,
  Artwork,
  GameEngine,
  Genre,
  InvolvedCompany,
  Company,
  CompanyLogo,
  Language,
  LanguageSupport,
  PlatformLogo,
  Screenshot,
  Video,
  PlayerPerspective,
  ReleaseDate,
  Platform,
  Keyword,
} from "../entities/index.entity";

const DBOrigin = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env?.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // no usar en produccion
  logging: true,
  entities: [
    Game,
    StoreGame,
    StorePrice,
    InfoGame,
    AgeRating,
    AlternativeName,
    Artwork,
    GameEngine,
    Genre,
    InvolvedCompany,
    Company,
    CompanyLogo,
    Language,
    LanguageSupport,
    PlatformLogo,
    Screenshot,
    Video,
    PlayerPerspective,
    ReleaseDate,
    Platform,
    Keyword,
  ],
  // ssl: true,
  // subscribers: [],
  // migrations: [],
});

export const AppDataSource = DBOrigin;
