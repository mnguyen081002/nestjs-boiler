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

import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from "../../decorators";
import { UserDto, UserUpdateRequest } from "./dtos/user.dto";
import { UsersPageOptionsDto } from "./dtos/users-page-options.dto";
import { UserEntity } from "../../entities/user.entity";
import { UserService } from "./user.service";
import { PageDto } from "../../common/dto/page.dto";
import { ResponseDefault } from "../../common/dto/response_default";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Auth()
  @Get("/me")
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user;
  }

  @Get("/info/:id")
  async getUserInfo(@Param("id") id: number) {
    const user = await this.userService.findOne({ id });

    return new ResponseDefault("Lấy thông tin thành công", user);
  }
}
