import { TypeSchema as GenericTypeSchema } from "../schema"

// We don't care about the generic type argument during validation,
// it's a high-level thing only
type TypeSchema = GenericTypeSchema<any>

export { TypeSchema }

export interface ValidationContext {
  propertyPath: string
  schema: TypeSchema
  fail (message: string): never
  validate (subData: any, subSchema: TypeSchema, propertyPathAppend: string): true | Error
}

export type Validator = (data: any, context: ValidationContext) => true | Error

export interface ValidatorsByType {
  [type: string]: Validator
}
