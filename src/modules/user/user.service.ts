import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import type { FindOptionsWhere } from "typeorm";
import { Repository } from "typeorm";

import { PageDto } from "../../common/dto/page.dto";
// import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from "../auth/dto/UserRegisterDto";
import type { UserDto, UserUpdateRequest } from "./dtos/user.dto";
import type { UsersPageOptionsDto } from "./dtos/users-page-options.dto";
import { Social, UserEntity } from "../../entities/user.entity";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { generateHash } from "../../common/utils";
import { RedisClientType } from "redis";

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: string, password: boolean = false): Promise<UserEntity | null> {
    const u = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!u) {
      throw new CustomHttpException({
        code: StatusCodesList.UserNotFound,
        message: "Không tìm thấy người dùng",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    if (!password) delete u.password;

    return u;
  }

  async findOne(
    findData: FindOptionsWhere<UserEntity>,
    password: boolean = false,
    settings: boolean = true,
  ): Promise<UserEntity | null> {
    const u = await this.userRepository.findOne({
      where: findData,
    });

    if (!password) delete u.password;

    if (!u) {
      throw new CustomHttpException({
        code: StatusCodesList.UserNotFound,
        message: "Không tìm thấy người dùng",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return u;
  }

  deleteUserById(id: number) {
    return this.userRepository.delete(id);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.settings", "settings");

    if (options.email) {
      queryBuilder.orWhere("user.email = :email", {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere("user.username = :username", {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const findUser = await this.userRepository.findOne({
      where: {
        username: userRegisterDto.username,
      },
    });
    const hashPassword = generateHash(userRegisterDto.password);

    if (!findUser) {
      const user = this.userRepository.create({ ...userRegisterDto, password: hashPassword });
      const userRecord = await this.userRepository.save(user);
      return user;
    }

    throw new CustomHttpException({
      code: StatusCodesList.EmailAlreadyExists,
      statusCode: HttpStatus.BAD_REQUEST,
      message: `Username ${userRegisterDto.username} đã tồn tại`,
    });
  }

  // async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
  //   const q = this.userRepository
  //     .createQueryBuilder("user")
  //     .select([
  //       "user.id",
  //       "user.email",
  //       "user.username",
  //       "user.role",
  //       "user.phone",
  //       "user.created_at",
  //       "user.status",
  //       "user.avatar",
  //       "user.updated_at",
  //     ])
  //     .leftJoinAndSelect("user.settings", "settings");

  //   pageOptionsDto.role && q.andWhere("user.role = :role", { role: pageOptionsDto.role });
  //   pageOptionsDto.search &&
  //     q.andWhere("user.username ILIKE :username", {
  //       username: `%${pageOptionsDto.search}%`,
  //     });
    
  //   // TODO: Need optimize
  //   const [users, itemCount] = await q
  //     .take(pageOptionsDto.take)
  //     .skip(pageOptionsDto.skip)
  //     .orderBy(`user.${pageOptionsDto.sort}`, pageOptionsDto.order)
  //     .getManyAndCount();

  //   return new PageDto<UserDto>(
  //     users,
  //     new PageMetaDto({
  //       itemCount,
  //       pageOptionsDto,
  //     }),
  //   );
  // }
}
