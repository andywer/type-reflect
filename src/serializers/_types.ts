import ts from "typescript"

export enum SerializedTypeIdentifier {
  any = "any",
  boolean = "boolean",
  builtin = "builtin",
  enum = "enum",
  intersection = "intersection",
  never = "never",
  null = "null",
  number = "number",
  object = "object",
  string = "string",
  symbol = "symbol",
  undefined = "undefined",
  union = "union",
  unknown = "unknown",
  void = "void",
}

export interface SerializedTypeBase {
  type: SerializedTypeIdentifier
  name?: string
  optional?: boolean
}

export interface SerializedTypeWithValueBase extends SerializedTypeBase {
  value: any
}

export interface SerializedObjectType extends SerializedTypeBase {
  members: {
    [key: string]: SerializedType
  }
}

export interface SerializedCombinedType extends SerializedTypeBase {
  subtypes: SerializedType[]
}

export interface SerializedArrayType extends SerializedTypeBase {
  type: SerializedTypeIdentifier.builtin,
  instance: "array",
  elementType: SerializedType
}

export interface SerializedDateType extends SerializedTypeBase {
  type: SerializedTypeIdentifier.builtin,
  instance: "date"
}

export type SerializedType = SerializedTypeBase
  | SerializedObjectType
  | SerializedCombinedType
  | SerializedArrayType
  | SerializedDateType

export type SerializeTypeFn = (type: ts.Type) => SerializedType
export type SerializeTypeSymbolAtFn = (symbol: ts.Symbol) => SerializedType

export type Serializer = (type: ts.Type, serializeTypeSymbolAt: SerializeTypeSymbolAtFn, serializeType: SerializeTypeFn) => SerializedTypeBase | null
