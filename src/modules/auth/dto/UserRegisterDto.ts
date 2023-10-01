import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MinLength,
} from "class-validator";
import { Column } from "typeorm";

import { Trim } from "../../../decorators/transform.decorators";

export class UserRegisterDto {
  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // @Trim()
  // readonly firstName: string;

  @IsString()
  @Length(8, 20, {
    message: "Tên người dùng phải có độ dài từ 8 đến 20 ký tự",
  })
  @IsNotEmpty()
  @Trim()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Trim()
  readonly email: string;

  @IsString()
  @MinLength(6, {
    message: "Mật khẩu quá ngắn",
  })
  readonly password: string;

  // @ApiProperty()
  // @Column()
  // @IsPhoneNumber("VN")
  // @IsOptional()
  // phone: string;
}
