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
  @PrimaryColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // @DeleteDateColumn({ nullable: true })
  // deleted_at: Date;

  @BeforeInsert()
  generateId() {
    this.id = utils.generateId(9);
  }
}
