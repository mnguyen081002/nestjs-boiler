import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";

import { UserDto } from "../modules/user/dtos/user.dto";
import { UserEntity } from "./user.entity";

@Entity({ name: "user_settings" })
export class UserSettingsEntity extends BaseEntity {
  @Column({ default: false })
  isEmailVerified?: boolean;

  // @Column({ default: false })
  // isPhoneVerified?: boolean;

  @Column({ type: "bigint" })
  user_id?: number;

  @OneToOne(() => UserEntity, (user) => user.settings, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user?: UserEntity;
}
