import {
  Column,
  Entity,
  BaseEntity,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { InvolvedCompany } from "./InvolvedCompany";
import { CompanyLogo } from "./CompanyLogo";

@Entity()
export class Company extends BaseEntity {
  @PrimaryColumn()
  id: number;
  @Column({ nullable: true })
  country: number;
  @Column()
  name: string;

  @Column({ nullable: true })
  start_date: number;

  @OneToOne(
    () => InvolvedCompany,
    (involved_company) => involved_company.company
  )
  involved_company: InvolvedCompany;

  @OneToOne(() => CompanyLogo, (logo) => logo.company, {
    nullable: true,
  })
  @JoinColumn({ name: "logo_id" })
  logo: CompanyLogo;
}
