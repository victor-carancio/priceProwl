import {
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
  // JoinColumn,
} from "typeorm";
import { AlternativeName } from "./info-game/AlternativeName";
import { AgeRating } from "./info-game/AgeRating";
import { Artwork } from "./info-game/Artwork";
import { GameEngine } from "./info-game/GameEngine";
import { Genre } from "./info-game/Genre";
import { InvolvedCompany } from "./info-game/InvolvedCompany";
import { Keyword } from "./info-game/Keyword";
import { Platform } from "./info-game/Platform";
import { PlayerPerspective } from "./info-game/PlayerPerspective";
import { ReleaseDate } from "./info-game/RealeaseDate";
import { Screenshot } from "./info-game/Screenshot";
import { Video } from "./info-game/Video";
import { LanguageSupport } from "./info-game/LanguageSupport";
import { Game } from "./Game";

@Entity()
export class InfoGame extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  first_release_date: number;

  @Column()
  storyline: string;

  @Column()
  summary: string;

  @Column({ nullable: true })
  version_title: string;

  @Column("json", { nullable: true })
  cover: { id: number; height: number; url: string; width: number };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AgeRating, (age_rating) => age_rating.info_game, {
    eager: true,
  })
  age_ratings: AgeRating[];

  @OneToMany(
    () => AlternativeName,
    (alternative_name) => alternative_name.info_game,
    { eager: true }
  )
  alternative_names: AlternativeName[];

  @OneToMany(() => Artwork, (artwork) => artwork.info_game, {
    eager: true,
    nullable: true,
  })
  artworks: Artwork[];

  @OneToMany(() => GameEngine, (game_engine) => game_engine.info_game, {
    eager: true,
    nullable: true,
  })
  game_engines: GameEngine[];

  //otras entidades

  @OneToMany(() => Genre, (genre) => genre.info_game, { eager: true })
  genres: Genre[];

  @OneToMany(
    () => InvolvedCompany,
    (involved_company) => involved_company.info_game,
    { eager: true }
  )
  involved_companies: InvolvedCompany[];

  @OneToMany(() => Keyword, (keyword) => keyword.info_game, { eager: true })
  keywords: Keyword[];

  //todo platform,playerperspective, release_dates, screenshots,videos,language_supports

  @OneToMany(() => Platform, (platform) => platform.info_game, { eager: true })
  platforms: Platform[];

  @OneToMany(
    () => PlayerPerspective,
    (player_perspective) => player_perspective.info_game,
    { eager: true }
  )
  player_perspective: PlayerPerspective[];

  @OneToMany(() => ReleaseDate, (release_date) => release_date.info_game, {
    eager: true,
  })
  release_dates: ReleaseDate[];

  @OneToMany(() => Screenshot, (screenshot) => screenshot.info_game, {
    eager: true,
  })
  screenshots: Screenshot[];

  @OneToMany(() => Video, (video) => video.info_game, { eager: true })
  videos: Video[];

  @OneToMany(
    () => LanguageSupport,
    (language_support) => language_support.info_game,
    { eager: true, nullable: true }
  )
  language_supports: LanguageSupport[];

  @ManyToOne(() => Game, (game) => game.infoGame)
  game: Game;
}
