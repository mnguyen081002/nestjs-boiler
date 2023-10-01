import { ApiProperty } from "@nestjs/swagger";

import { UserDto } from "../../user/dtos/user.dto";
import { TokenPayloadDto } from "../../jwt/dtos/TokenPayloadDto";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Social } from "../../../entities/user.entity";

export class LoginPayloadDto {
  user: UserDto;

  token: TokenPayloadDto;

  constructor(user: UserDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}

export class LoginSocialRequest {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEnum(["facebook", "google", "github"], {
    message: "Social type không hợp lệ",
  })
  social: Social;

  @IsString({
    message: "Social user id phải là string",
  })
  @IsOptional()
  social_user_id: string;
}
