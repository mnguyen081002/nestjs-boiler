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
  @Length(6, 20, {
    message: "Tên người dùng phải có độ dài từ 8 đến 20 ký tự",
  })
  @IsNotEmpty()
  @Trim()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 30, {
    message: "Tên phải có độ dài từ 8 đến 30 ký tự",
  })
  @Trim()
  readonly name: string;

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
