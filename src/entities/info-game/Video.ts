import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class Video extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  video_id: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.videos)
  info_game: InfoGame;
}
