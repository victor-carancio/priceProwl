import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class AlternativeName extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  name: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.alternative_names)
  info_game: InfoGame;
}
