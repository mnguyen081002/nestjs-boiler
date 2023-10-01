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
import { UserSettingsEntity } from "../../entities/user-settings.entity";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { generateHash } from "../../common/utils";
import { RedisClientType } from "redis";

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingRepository: Repository<UserSettingsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOneById(id: number, password: boolean = false): Promise<UserEntity | null> {
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
      relations: {
        settings: settings,
      },
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
        email: userRegisterDto.email,
      },
      relations: ["settings"],
    });
    const hashPassword = generateHash(userRegisterDto.password);

    if (!findUser) {
      const user = this.userRepository.create({ ...userRegisterDto, password: hashPassword });

      const userRecord = await this.userRepository.save(user);
      const userSettings = this.userSettingRepository.create({
        isEmailVerified: false,
        user_id: userRecord.id,
      });

      user.settings = await this.userSettingRepository.save(userSettings);
      return user;
    }

    if (findUser.settings.isEmailVerified) {
      throw new CustomHttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Email ${userRegisterDto.email} đã tồn tại`,
        code: StatusCodesList.EmailAlreadyExists,
      });
    } else {
      await this.userRepository.update(findUser.id, {
        ...userRegisterDto,
        password: hashPassword,
      });
    }

    return findUser;
  }

  async createUserSocial(user: {
    email: string;
    username: string;
    avatar: string;
    social: Social;
  }): Promise<UserEntity> {
    const u = this.userRepository.create({ ...user });

    const userRecord = await this.userRepository.save(u);

    const userSettings = this.userSettingRepository.create({
      isEmailVerified: true,
      user_id: userRecord.id,
    });

    u.settings = await this.userSettingRepository.save(userSettings);
    return u;
  }

  async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    const q = this.userRepository
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.email",
        "user.username",
        "user.role",
        "user.phone",
        "user.created_at",
        "user.status",
        "user.avatar",
        "user.updated_at",
      ])
      .leftJoinAndSelect("user.settings", "settings");

    pageOptionsDto.role && q.andWhere("user.role = :role", { role: pageOptionsDto.role });
    pageOptionsDto.search &&
      q.andWhere("user.username ILIKE :username", {
        username: `%${pageOptionsDto.search}%`,
      });

    const [users, itemCount] = await q
      .take(pageOptionsDto.take)
      .skip(pageOptionsDto.skip)
      .orderBy(`user.${pageOptionsDto.sort}`, pageOptionsDto.order)
      .getManyAndCount();

    return new PageDto<UserDto>(
      users,
      new PageMetaDto({
        itemCount,
        pageOptionsDto,
      }),
    );
  }
}
