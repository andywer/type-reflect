import ts from "typescript"
import { TypeSchema } from "../schema"

export { ArrayType, BuiltinType, IntrinsicType, ObjectType, UnionType } from "../schema"
export { TypeSchema }

export type SerializeTypeFn = (type: ts.Type) => TypeSchema
export type GetTypeForSymbolAtFn = (symbol: ts.Symbol) => ts.Type

export type Serializer = (type: ts.Type, serializeType: SerializeTypeFn, getTypeForSymbolAt: GetTypeForSymbolAtFn) => TypeSchema | null
