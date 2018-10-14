import { IntrinsicType } from "../schema"
import { ValidatorsByType } from "./_types"

export const arrayValidatorsByType: ValidatorsByType = {
  [IntrinsicType.array]: (data, context) => {
    if (!Array.isArray(data)) {
      return context.fail(`Expected array, got ${data} (type ${typeof data})`)
    }
    if (context.schema.items && !Array.isArray(context.schema.items)) {
      const elementsType = context.schema.items

      data.forEach((dataElement, index) => {
        const result = context.validate(dataElement, elementsType, `[${index}]`)
        if (result !== true) {
          return result
        }
      })
    }
    if (context.schema.items && Array.isArray(context.schema.items)) {
      const elementTypes = context.schema.items

      if (data.length !== elementTypes.length) {
        return context.fail(
          `Array length does not match expected tuple length. ` +
          `Expected ${elementTypes.length}, got ${data.length}.`
        )
      }

      data.forEach((dataElement, index) => {
        const result = context.validate(dataElement, elementTypes[index], `[${index}]`)
        if (result !== true) {
          return result
        }
      })
    }
    return true
  }
}
