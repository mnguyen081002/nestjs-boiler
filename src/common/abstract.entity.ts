import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import * as utils from "../common/generate-nanoid";
export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // @DeleteDateColumn({ nullable: true })
  // deleted_at: Date;
}
