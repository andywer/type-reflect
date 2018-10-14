import { IntrinsicType } from "../schema"
import { ValidationContext, ValidatorsByType } from "./_types"

function valueMismatch<T> (context: ValidationContext, actualValue: T, expectedValues: T[]) {
  if (expectedValues.length === 1) {
    const expected = JSON.stringify(expectedValues[0])
    return context.fail(`Expected data to be: ${expected}. Got ${JSON.stringify(actualValue)}.`)
  } else {
    const expected = expectedValues.map((value) => JSON.stringify(value)).join(", ")
    return context.fail(`Expected data to be one of: ${expected}. Got ${JSON.stringify(actualValue)}.`)
  }
}

export const basicTypeValidatorsByType: ValidatorsByType = {
  [IntrinsicType.boolean]: (data, context) => {
    if (typeof data !== "boolean") {
      return context.fail(`Expected type boolean, got type ${typeof data}`)
    }
    if (context.schema.enum && context.schema.enum.indexOf(data) === -1) {
      return valueMismatch(context, data, context.schema.enum)
    }
    return true
  },

  [IntrinsicType.number]: (data, context) => {
    if (typeof data !== "number") {
      return context.fail(`Expected type number, got type ${typeof data}`)
    }
    if (context.schema.enum && context.schema.enum.indexOf(data) === -1) {
      return valueMismatch(context, data, context.schema.enum)
    }
    return true
  },

  [IntrinsicType.string]: (data, context) => {
    if (typeof data !== "string") {
      return context.fail(`Expected type string, got type ${typeof data}`)
    }
    if (context.schema.enum && context.schema.enum.indexOf(data) === -1) {
      return valueMismatch(context, data, context.schema.enum)
    }
    return true
  }
}
