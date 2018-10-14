import { IntrinsicType, TypeSchema } from "./schema"
import { ValidationContext, Validator } from "./validators/_types"
import { validatorsByType, } from "./validators/index"
import { getRuntimeInstanceValidator } from "./validators/runtime"

function getValidatorByType (type: IntrinsicType, context: ValidationContext): Validator | never {
  return validatorsByType[type] || context.fail(`Unknown type in schema: ${type}`)
}

function indent (size: number, message: string) {
  return message.split("\n").map(line => " ".repeat(size) + line).join("\n")
}

function createAnyOfValidator (validators: Validator[], context: ValidationContext): Validator {
  return (data: any, context: ValidationContext) => {
    const validationErrors: Error[] = []
    for (const validator of validators) {
      const result = validator(data, context)
      if (result === true) {
        return true
      } else {
        validationErrors.push(result)
      }
    }
    const details = validationErrors.map(error => indent(2, error.message)).join("\n")
    return context.fail("Data matched none of the possible types. Type validation results:\n" + details)
  }
}

function getValidator (schema: TypeSchema<any>, context: ValidationContext): Validator {
  if (schema.type && !Array.isArray(schema.type)) {
    return getValidatorByType(schema.type, context)
  } else if (schema.type && Array.isArray(schema.type)) {
    const validators = schema.type.map(type => getValidatorByType(type, context))
    return createAnyOfValidator(validators, context)
  } else if (schema.anyOf) {
    const validators = schema.anyOf.map(subSchema => getValidator(subSchema, context))
    return createAnyOfValidator(validators, context)
  } else if (schema["$ref"]) {
    const validator = getRuntimeInstanceValidator(schema["$ref"])
    return validator || context.fail(`Cannot validate schema with $ref: ${schema["$ref"]}`)
  }

  return context.fail(`Invalid schema: ${JSON.stringify(schema, null, 2)}`)
}

function validateData (data: any, context: ValidationContext): true | Error {
  const validator = getValidator(context.schema, context)
  return validator(data, context)
}

function createValidationContext (schema: TypeSchema<any>, propertyPath: string): ValidationContext {
  const errorPrefix = propertyPath ? `${propertyPath}: ` : ""
  if (!propertyPath && schema.title) {
    propertyPath = schema.title
  }
  return {
    propertyPath,
    schema,
    fail (errorMessage: string): never {
      throw new Error(errorPrefix + errorMessage)
    },
    validate (subData: any, subSchema: TypeSchema<any>, propertyPathAppend: string) {
      const delimiter = propertyPathAppend.charAt(0) === "[" ? "" : "."
      const subPropertyPath = propertyPath ? `${propertyPath}${delimiter}${propertyPathAppend}` : propertyPathAppend
      const subContext = createValidationContext(subSchema, subPropertyPath)
      return validateData(subData, subContext)
    }
  }
}

export function validate<ExpectedType> (data: any, schema: TypeSchema<ExpectedType>): data is ExpectedType {
  if (!schema) {
    throw new Error(`Expected a schema to use for validation. Got ${data}`)
  }

  const context = createValidationContext(schema, "")
  const result = validateData(data, context)

  if (result !== true) {
    throw result
  } else {
    return true
  }
}

export function parseJSON<ExpectedType> (jsonData: string, schema: TypeSchema<ExpectedType>): ExpectedType {
  const parsed = JSON.parse(jsonData)

  if (validate(parsed, schema)) {
    return parsed
  } else {
    // Will never be run, but we need to check the return value of `validate()`
    // to make the type guard work
    throw new Error("The JSON data does not match the provided schema.")
  }
}
