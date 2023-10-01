import { IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../../decorators";

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  readonly email: string;
}
