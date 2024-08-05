import {
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from "../../decorators";
import { OrderType } from "../enum/order";

export class PageOptionsDto {
  @IsOptional()
  @IsString()
  @IsIn(["created_at", "updated_at"])
  readonly sort?: string = "created_at";

  @EnumFieldOptional(() => OrderType, {
    default: OrderType.DESC,
  })
  readonly order: OrderType = OrderType.DESC;

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1;

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
    int: true,
  })
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @StringFieldOptional()
  readonly q?: string;

  constructor(partial: Partial<PageOptionsDto>) {
    Object.assign(this, partial);
  }
}
