/**
 * Our type information schema is based on JSON schema.
 * See <https://json-schema.org/>.
 *
 * Differences to the original JSON schema:
 *
 * - No sophisticated value validation props (TypeScript has no support for that)
 * - No `default`
 * - Additional `type` values to represent TypeScript types that don't exist in JSON
 *   - any
 *   - never
 *   - undefined
 *   - unknown
 *   - void
 * - type `builtin` to reflect things like
 */

export enum IntrinsicType {
  any = "any",
  array = "array",
  boolean = "boolean",
  never = "never",
  number = "number",
  null = "null",
  object = "object",
  string = "string",
  undefined = "undefined",
  unknown = "unknown",
  void = "void",
}

export interface BasicType {
  type: IntrinsicType | IntrinsicType[]
}

export interface ArrayType {
  type: IntrinsicType.array,
  items: TypeSchema | TypeSchema[],
  maxItems?: number,
  minItems?: number
}

export interface BuiltinType<BuiltinRef extends string> {
  "$ref": BuiltinRef
}

interface BooleanLiteralType<PossibleValues extends boolean[]> {
  type: IntrinsicType.boolean,
  enum: PossibleValues
}

interface NumberLiteralType<PossibleValues extends number[]> {
  type: IntrinsicType.number,
  enum: PossibleValues
}

interface StringLiteralType<PossibleValues extends string[]> {
  type: IntrinsicType.string,
  enum: PossibleValues
}

export interface ObjectType {
  type: IntrinsicType.object,
  properties?: {
    [propName: string]: TypeSchema
  }
  required?: string[]
  title?: string
}

export interface UnionType {
  anyOf: TypeSchema[]
}

type AnyType = BasicType
| ArrayType
| BuiltinType<any>
| ObjectType
| BooleanLiteralType<any>
| NumberLiteralType<any>
| StringLiteralType<any>
| UnionType

export type TypeSchema = AnyType & {
  type?: IntrinsicType | IntrinsicType[],
  "$ref"?: string,
  anyOf?: TypeSchema[],
  oneOf?: TypeSchema[],
  enum?: any[],
  items?: TypeSchema | TypeSchema[],
  properties?: {
    [propName: string]: TypeSchema
  },
  required?: string[],
  title?: string
}
