import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import winstonConfig from "src/config/winston";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "./shared/services/shared.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import typeorm from "./config/typeorm";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ? process.env.NODE_ENV : "local"}`],
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: async (configService: ApiConfigService) => configService.getPostgresConfig(),
      inject: [ApiConfigService],
    }),

    WinstonModule.forRoot(winstonConfig),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    JwtModule,
    HealthModule,
  ],
})
export class AppModule {}
