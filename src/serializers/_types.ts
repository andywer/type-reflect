import ts from "typescript"
import { TypeSchema as GenericTypeSchema } from "../schema"

// We don't care about the generic type argument during validation,
// it's a high-level thing only
type TypeSchema = GenericTypeSchema<any>

export { ArrayType, BasicType, BuiltinType, IntrinsicType, ObjectType, UnionType } from "../schema"
export { TypeSchema }

export interface SerializationContext {
  serializeType(type: ts.Type): TypeSchema
  getTypeForSymbolAt(symbol: ts.Symbol): ts.Type
}

export type Serializer = (type: ts.Type, context: SerializationContext) => TypeSchema | null
