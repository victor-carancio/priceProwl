import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  OneToOne,
} from "typeorm";

import { Language } from "./Language";
import { InfoGame } from "../InfoGame";

@Entity()
export class LanguageSupport extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @OneToOne(() => Language, (language) => language.language_support)
  language: Language;

  @ManyToOne(() => InfoGame, (info_game) => info_game.language_supports)
  info_game: InfoGame;
}
