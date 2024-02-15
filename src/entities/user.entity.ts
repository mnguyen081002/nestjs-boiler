import { Column, Entity, OneToOne, OneToMany, ManyToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";

export type Social = "google" | "facebook" | "github";
@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column({ default: 100000 })
  money: number;
}
