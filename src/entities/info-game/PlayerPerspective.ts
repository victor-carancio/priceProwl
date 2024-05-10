import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class PlayerPerspective extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.player_perspective)
  info_game: InfoGame;
}
