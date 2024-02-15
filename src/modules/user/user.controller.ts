import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { UserDto, UserUpdateRequest } from "./dtos/user.dto";
import { UsersPageOptionsDto } from "./dtos/users-page-options.dto";
import { UserEntity } from "../../entities/user.entity";
import { UserService } from "./user.service";
import { PageDto } from "../../common/dto/page.dto";
import { ResponseDefault } from "../../common/dto/response_default";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}
}
