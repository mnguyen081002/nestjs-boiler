import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { UserService } from "../../user/user.service";
import { JwtService } from "../../jwt/jwt.service";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
}
