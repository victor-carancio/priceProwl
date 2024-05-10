import {
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { StoreTypes } from "../types";
import { StorePrice } from "./StorePrice";
import { Game } from "./Game";

@Entity()
export class StoreGame extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: StoreTypes,
  })
  store: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => StorePrice, (price) => price.store, { eager: true })
  info: StorePrice[];

  @ManyToOne(() => Game, (game) => game.infoGame)
  game: Game;
}
