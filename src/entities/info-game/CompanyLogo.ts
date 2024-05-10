import { Column, Entity, BaseEntity, PrimaryColumn, OneToOne } from "typeorm";
import { Company } from "./Company";
@Entity()
export class CompanyLogo extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  height: number;

  @Column()
  url: string;

  @Column()
  width: number;

  @OneToOne(() => Company, (company) => company.logo, { nullable: true })
  company: Company;
}
