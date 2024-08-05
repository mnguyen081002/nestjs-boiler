import { Injectable } from "@nestjs/common";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { PayloadDto, TokenPayloadDto } from "./dtos/TokenPayloadDto";
import { UserEntity } from "../../entities/user.entity";
import { TokenType } from "../../common/constants/token-type";

@Injectable()
export class JwtService {
  constructor(
    private configService: ApiConfigService,
    private nestJwtService: NestJwtService,
  ) {}
  async generateAuthToken(user: UserEntity): Promise<TokenPayloadDto> {
    const access_token = this.generateToken(
      user.id,
      TokenType.ACCESS_TOKEN,
      this.configService.authConfig.jwtAccessExpirationTime,
    );

    const refresh_token = this.generateToken(user.id, TokenType.REFRESH_TOKEN, 0);
    // await this.saveToken(refresh_token, user, TokenType.RefreshToken);
    return {
      access_token,
      refresh_token,
      expiresIn: this.configService.authConfig.jwtAccessExpirationTime,
    };
  }

  // async saveToken(token: string, user: UserEntity, tokenType: TokenType) {
  //   let tokenDoc = await this.tokenRepo.findOne({
  //     where: { user, type: tokenType },
  //   });
  //   if (tokenDoc) {
  //     tokenDoc.token = token;
  //     tokenDoc.active = true;
  //   } else {
  //     tokenDoc = this.tokenRepo.create({
  //       token,
  //       user,
  //       type: tokenType,
  //     });
  //   }
  //   return this.tokenRepo.save(tokenDoc);
  // }
  generateVerifyEmailToken(user_id: string) {
    return this.generateToken(user_id, TokenType.VERIFY_EMAIL_TOKEN, 3600);
  }

  generateResetPasswordToken(user_id: string) {
    return this.generateToken(user_id, TokenType.RESET_PASSWORD_TOKEN, 3600);
  }

  generateToken(user_id: string, type: TokenType, expiresIn: number | string) {
    const payload = { sub: user_id, type };
    return this.nestJwtService.sign(payload, {
      expiresIn: expiresIn,
      secret: this.configService.authConfig.jwtSecret,
    });
  }

  verifyToken(token: string, type: TokenType = TokenType.ACCESS_TOKEN) {
    const payload = this.nestJwtService.verify<PayloadDto>(token, {
      secret: this.configService.authConfig.jwtSecret,
    });

    if (payload.type !== type) {
      throw new Error("Invalid token");
    }

    return payload;
  }
}
