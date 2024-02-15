import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserEntity } from "../../entities/user.entity";
import { BoardService } from "./board.service";
import { BoardGateway } from "./board.gateway";
import { UserModule } from "../user/user.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  exports: [BoardService],
  providers: [BoardService, BoardGateway],
})
export class BoardModule {}
