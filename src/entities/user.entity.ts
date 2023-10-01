import { Column, Entity, OneToOne, OneToMany, ManyToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { UserRole } from "../common/enum/user-role";
import { VirtualColumn } from "../decorators";
import { UserDto } from "../modules/user/dtos/user.dto";
import { UserSettingsEntity } from "./user-settings.entity";

export type Social = "google" | "facebook" | "github";
@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: "active" })
  status: string;

  // TODO: Next use rbac
  @Column({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: true })
  social: Social;

  @Column({ nullable: true })
  bio?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  facebook_url?: string;

  @Column({ nullable: true })
  twitter_url?: string;

  @Column({ nullable: true })
  linkedin_url?: string;

  @Column({ nullable: true })
  youtube_url?: string;

  @VirtualColumn()
  fullName?: string;

  @Column({ nullable: true })
  bank_number?: string;

  @Column({ nullable: true })
  bank_owner_name?: string;

  @Column({ nullable: true })
  bank_code?: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  // @BeforeInsert()
  // hashPassword() {
  //   this.password = generateHash(this.password);
  // }

  toDto(): UserDto {
    delete this.password;
    return {
      ...this,
      fullName: this.fullName,
    };
  }
}
