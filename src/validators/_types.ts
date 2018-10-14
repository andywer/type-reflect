import { TypeSchema } from "../schema"

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
