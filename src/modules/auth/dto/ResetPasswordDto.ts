import { IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../../decorators";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly token: string;
}
