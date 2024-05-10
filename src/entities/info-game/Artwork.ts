import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class Artwork extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  height: number;
  @Column()
  width: number;

  @Column()
  url: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.artworks)
  info_game: InfoGame;
}
