import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

// import { ValidatorService } from '../../shared/services/validator.service';
import { Social, UserEntity } from "../../entities/user.entity";

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOneOrCreateByUsername(username: string): Promise<UserEntity> {
    const u = await this.userRepository.findOne({
      where: { username },
    });

    if (!u) {
      return this.userRepository.save({
        username,
      });
    }

    return u;
  }
}
