import { IntrinsicType } from "../schema"
import { ValidatorsByType } from "./_types"

export const objectValidatorsByType: ValidatorsByType = {
  [IntrinsicType.object]: (data, context) => {
    if (typeof data !== "object") {
      return context.fail(`Expected object type, got type ${typeof data}`)
    } else if (data === null) {
      return context.fail(`Expected object, got 'null'`)
    }

    if (typeof context.schema.properties !== "object" || !context.schema.properties) {
      return context.fail("Internal error: Expected schema to have properties.")
    }

    for (const propName of Object.keys(context.schema.properties)) {
      if (!(propName in data)) {
        return context.failOnProperty(propName, `Property is missing.`)
      } else {
        const propValidationResult = context.validate(data[propName], context.schema.properties[propName], propName)
        if (propValidationResult !== true) {
          return propValidationResult
        }
      }
    }
    return true
  }
}
