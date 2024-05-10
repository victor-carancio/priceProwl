import {
  Column,
  Entity,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { InfoGame } from "../InfoGame";
import { Company } from "./Company";

@Entity()
export class InvolvedCompany extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  developer: boolean;

  @Column()
  porting: boolean;

  @Column()
  publisher: boolean;

  @Column()
  supporting: boolean;

  @OneToOne(() => Company, (company) => company.involved_company)
  @JoinColumn({ name: "company_id" })
  company: Company;

  @ManyToOne(() => InfoGame, (info_game) => info_game.involved_companies)
  @JoinColumn({ name: "info_game_id" })
  info_game: InfoGame;
}
