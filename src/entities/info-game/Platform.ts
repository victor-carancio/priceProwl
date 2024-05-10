import {
  Column,
  Entity,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";
import { InfoGame } from "../InfoGame";
import { ReleaseDate } from "./RealeaseDate";
import { PlatformLogo } from "./PlatformLogo";

@Entity()
export class Platform extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  abbreviation: string;

  @Column({ nullable: true })
  alternative_name: string;

  @Column()
  name: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.platforms)
  info_game: InfoGame;

  @OneToOne(() => ReleaseDate, (release_date) => release_date.platform)
  release_date: ReleaseDate;

  @OneToOne(() => PlatformLogo, (platform_logo) => platform_logo.platform)
  platform_logo: PlatformLogo;
}
