import { Body, Controller, Post, Req } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "./dto/UserLoginDto";
import { JwtService } from "../../jwt/jwt.service";

@Controller("auth")
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post("login")
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.userService.findOneOrCreateByUsername(userLoginDto.username);
    return { user };
  }
}
