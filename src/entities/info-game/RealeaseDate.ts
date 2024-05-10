import {
  Column,
  Entity,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { InfoGame } from "../InfoGame";
import { Platform } from "./Platform";

@Entity()
export class ReleaseDate extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  category: number;

  @Column()
  date: number;

  @Column()
  region: number;

  @ManyToOne(() => InfoGame, (info_game) => info_game.release_dates)
  info_game: InfoGame;

  @OneToOne(() => Platform, (platform) => platform.release_date)
  platform: Platform;
}
