import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PublicStrategy } from "./public.strategy";
import { JwtModule } from "../jwt/jwt.module";
import { UserEntity } from "../../entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PublicStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
