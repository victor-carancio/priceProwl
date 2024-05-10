import { Column, Entity, BaseEntity, PrimaryColumn, OneToOne } from "typeorm";

import { LanguageSupport } from "./LanguageSupport";

@Entity()
export class Language extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  native_name: string;
  @Column()
  locale: string;

  @OneToOne(
    () => LanguageSupport,
    (language_support) => language_support.language
  )
  language_support: LanguageSupport;
}
