import { TypeSchema, Validator, ValidatorsByType, ValidationContext } from "./_types"
import { arrayValidatorsByType } from "./array"
import { basicTypeValidatorsByType } from "./basic"
import { invariantValidatorsByType } from "./invariants"
import { objectValidatorsByType } from "./object"

export const validatorsByType: ValidatorsByType = {
  ...invariantValidatorsByType,
  ...arrayValidatorsByType,
  ...objectValidatorsByType,
  ...basicTypeValidatorsByType
}
