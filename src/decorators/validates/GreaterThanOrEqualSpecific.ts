import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "GreaterThanOrEqualSpecific", async: false })
export class GreaterThanOrEqualSpecific implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [equal, than] = args.constraints;
    return parseInt(value) === parseInt(equal) || parseInt(value) >= parseInt(than);
  }
}
