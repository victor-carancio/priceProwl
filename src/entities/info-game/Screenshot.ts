import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class Screenshot extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Column()
  height: number;
  @Column()
  url: string;
  @Column()
  width: number;

  @ManyToOne(() => InfoGame, (info_game) => info_game.screenshots)
  info_game: InfoGame;
}
