import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class Genre extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.genres)
  info_game: InfoGame;
}
