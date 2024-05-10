import {
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
} from "typeorm";
import { InfoGame } from "./InfoGame";
import { StoreGame } from "./StoreGame";

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameName: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => InfoGame, (infoGame) => infoGame.game, { eager: true })
  infoGame: InfoGame[];

  @OneToMany(() => StoreGame, (storeGame) => storeGame.game, { eager: true })
  stores: StoreGame[];
}
