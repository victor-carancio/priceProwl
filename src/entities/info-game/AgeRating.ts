import { Column, Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { InfoGame } from "../InfoGame";

@Entity()
export class AgeRating extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  category: number;

  @Column()
  rating: number;

  @Column({ nullable: true })
  synopsis: string;

  @ManyToOne(() => InfoGame, (info_game) => info_game.age_ratings)
  info_game: InfoGame;
}
