import { IntrinsicType } from "../schema"
import { ValidatorsByType } from "./_types"

export const basicTypeValidatorsByType: ValidatorsByType = {
  [IntrinsicType.boolean]: (data, context) => {
    if (typeof data !== "boolean") {
      return context.fail(`Expected type boolean, got type ${typeof data}`)
    }
    if (context.schema.enum && context.schema.enum.indexOf(data) === -1) {
      return context.fail(`Expected data to be one of: ${context.schema.enum.join(", ")}. Got ${data}`)
    }
    return true
  },

  [IntrinsicType.number]: (data, context) => {
    if (typeof data !== "number") {
      return context.fail(`Expected type number, got type ${typeof data}`)
    }
    if (context.schema.enum && context.schema.enum.indexOf(data) === -1) {
      return context.fail(`Expected data to be one of: ${context.schema.enum.join(", ")}. Got ${data}`)
    }
    return true
  },

  [IntrinsicType.string]: (data, context) => {
    if (typeof data !== "string") {
      return context.fail(`Expected type string, got type ${typeof data}`)
    }
    if (context.schema.enum && context.schema.enum.indexOf(data) === -1) {
      const expected = context.schema.enum.map((value: string) => `"${value}"`).join(", ")
      return context.fail(`Expected data to be one of: ${expected}. Got ${data}`)
    }
    return true
  }
}
