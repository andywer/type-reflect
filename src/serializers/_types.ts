import ts from "typescript"
import { TypeSchema } from "../schema"

export { ArrayType, BuiltinType, IntrinsicType, ObjectType, UnionType } from "../schema"
export { TypeSchema }

export type SerializeTypeFn = (type: ts.Type) => TypeSchema
export type SerializeTypeSymbolAtFn = (symbol: ts.Symbol) => TypeSchema

export type Serializer = (type: ts.Type, serializeTypeSymbolAt: SerializeTypeSymbolAtFn, serializeType: SerializeTypeFn) => TypeSchema | null
