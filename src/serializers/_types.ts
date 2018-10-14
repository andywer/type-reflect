import ts from "typescript"
import { TypeSchema } from "../schema"

export { ArrayType, BasicType, BuiltinType, IntrinsicType, ObjectType, UnionType } from "../schema"
export { TypeSchema }

export interface SerializationContext {
  serializeType(type: ts.Type): TypeSchema
  getTypeForSymbolAt(symbol: ts.Symbol): ts.Type
}

export type Serializer = (type: ts.Type, context: SerializationContext) => TypeSchema | null
