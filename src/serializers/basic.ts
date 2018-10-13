import ts from "typescript"
import { IntrinsicType, TypeSchema } from "./_types"

function serializeBoolean (type: ts.Type): TypeSchema | null {
  if (type.flags & ts.TypeFlags.BooleanLiteral) {
    return {
      type: IntrinsicType.boolean,
      enum: [ (type as any).intrinsicName === "true" ]
    }
  } else if (type.flags & ts.TypeFlags.Boolean || type.flags & ts.TypeFlags.BooleanLike) {
    return {
      type: IntrinsicType.boolean
    }
  } else {
    return null
  }
}

function serializeNumber (type: ts.Type): TypeSchema | null {
  if (type.flags & ts.TypeFlags.NumberLiteral) {
    return {
      type: IntrinsicType.number,
      enum: [ (type as ts.LiteralType).value ]
    }
  } else if (type.flags & ts.TypeFlags.Number || type.flags & ts.TypeFlags.NumberLike) {
    return {
      type: IntrinsicType.number
    }
  } else {
    return null
  }
}

function serializeString (type: ts.Type): TypeSchema | null {
  if (type.flags & ts.TypeFlags.StringLiteral) {
    return {
      type: IntrinsicType.string,
      enum: [ (type as ts.LiteralType).value ]
    }
  } else if (type.flags & ts.TypeFlags.String || type.flags & ts.TypeFlags.StringLike) {
    return {
      type: IntrinsicType.string
    }
  } else {
    return null
  }
}

const basicSerializers = [
  serializeBoolean,
  serializeNumber,
  serializeString
]

export default basicSerializers
