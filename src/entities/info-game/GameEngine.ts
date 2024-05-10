import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class GameEngine extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.game_engines)
  info_game: InfoGame;
}
