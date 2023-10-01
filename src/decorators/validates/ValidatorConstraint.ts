import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

@ValidatorConstraint({ name: "arrayLength", async: false })
export class ArrayLengthValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!Array.isArray(value)) {
      return false;
    }
    return value.length > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must have a length greater than 0`;
  }
}

export function IsArrayLengthGreaterThanZero(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ArrayLengthValidator,
    });
  };
}
