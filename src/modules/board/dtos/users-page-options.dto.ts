import { PageOptionsDto } from "../../../common/dto/page-options.dto";

export class UsersPageOptionsDto extends PageOptionsDto {
  role?: string;
  search?: string;
}
