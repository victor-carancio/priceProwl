import { Column, Entity, BaseEntity, PrimaryColumn, OneToOne } from "typeorm";
import { Platform } from "./Platform";

@Entity()
export class PlatformLogo extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  height: number;

  @Column()
  url: string;

  @Column()
  width: number;

  @OneToOne(() => Platform, (platform) => platform.platform_logo)
  platform: Platform;
}
