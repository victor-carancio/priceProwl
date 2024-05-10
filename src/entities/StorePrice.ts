import {
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { StoreGame } from "./StoreGame";

@Entity()
export class StorePrice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column({ default: "-" })
  discount_percent: string;

  @Column({ default: "-" })
  initial_price: string;

  @Column()
  edition: string;

  @Column({ default: "-" })
  final_price: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => StoreGame, (store) => store.info)
  @JoinColumn({ name: "game_store_id" })
  store: StoreGame;
}
