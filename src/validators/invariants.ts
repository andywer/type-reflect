import { IntrinsicType } from "../schema"
import { ValidatorsByType } from "./_types"

export const invariantValidatorsByType: ValidatorsByType = {
  [IntrinsicType.any]: () => true,

  [IntrinsicType.never]: (data, context) => context.fail("Expected type is 'never'."),

  [IntrinsicType.null]: (data, context) => {
    return data === null
      ? true
      : context.fail(`Expected 'null', got ${data}`)
  },

  [IntrinsicType.undefined]: (data, context) => {
    return typeof data === "undefined"
      ? true
      : context.fail(`Expected 'undefined', got type ${typeof data}`)
  },

  [IntrinsicType.void]: (data, context) => {
    return typeof data === "undefined"
      ? true
      : context.fail(`Expected 'undefined' (void), got type ${typeof data}`)
  }
}
