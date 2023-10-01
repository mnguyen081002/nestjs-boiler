import { Module } from "@nestjs/common";
import { JwtService } from "./jwt.service";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    NestJwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        // privateKey: configService.authConfig.privateKey,
        // publicKey: configService.authConfig.publicKey,
        secret: configService.authConfig.jwtSecret,
        signOptions: {
          // algorithm: 'RS256',
          expiresIn: configService.authConfig.jwtAccessExpirationTime,
        },
        // verifyOptions: {
        //   algorithms: ['RS256'],
        // },
        // if you want to use token with expiration date
        // signOptions: {
        //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        // },
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
