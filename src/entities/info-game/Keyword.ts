import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class Keyword extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.keywords)
  info_game: InfoGame;
}
