import { Contains, IsOptional, IsString, IsUrl, Length } from "class-validator";
import { BaseDto } from "../../../common/abstract.dto";

export class UserDto extends BaseDto {
  username?: string;

  avatar?: string;

  bio?: string;

  facebook_url?: string;

  twitter_url?: string;

  linkedin_url?: string;

  youtube_url?: string;

  title?: string;

  isActive?: boolean;
}

export class UserUpdateRequest extends BaseDto {
  @IsString()
  @Length(1, 40)
  username?: string;

  @IsString({
    message: "Avatar không hợp lệ",
  })
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  @Length(1, 255)
  bio?: string;

  @IsUrl(
    {
      require_protocol: true,
      require_valid_protocol: true,
    },
    {
      message: "Facebook url không hợp lệ",
    },
  )
  @IsOptional()
  @Contains("facebook.com", { message: "Facebook url không hợp lệ" })
  facebook_url?: string;

  @IsUrl(
    {
      require_protocol: true,
      require_valid_protocol: true,
    },
    {
      message: "Twitter url không hợp lệ",
    },
  )
  @IsOptional()
  @Contains("twitter.com", { message: "Twitter url không hợp lệ" })
  twitter_url?: string;

  @IsUrl(
    {
      require_protocol: true,
      require_valid_protocol: true,
    },
    {
      message: "Linkedin url không hợp lệ",
    },
  )
  @IsOptional()
  @Contains("linkedin.com", { message: "Linkedin url không hợp lệ" })
  linkedin_url?: string;

  @IsUrl(
    {
      require_protocol: true,
      require_valid_protocol: true,
    },
    {
      message: "Youtube url không hợp lệ",
    },
  )
  @IsOptional()
  @Contains("youtube.com", { message: "Youtube url không hợp lệ" })
  youtube_url?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString()
  bank_number?: string;

  @IsOptional()
  @IsString()
  bank_owner_name?: string;

  @IsOptional()
  @IsString()
  bank_code?: string;
}
