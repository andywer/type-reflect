import ts from "typescript"
import { IntrinsicType, TypeSchema } from "./_types"

function serializeAny (type: ts.Type): TypeSchema | null {
  if (type.flags === ts.TypeFlags.Any) {
    return {
      type: IntrinsicType.any
    }
  } else {
    return null
  }
}

function serializeNever (type: ts.Type): TypeSchema | null {
  if (type.flags === ts.TypeFlags.Never) {
    return {
      type: IntrinsicType.never
    }
  } else {
    return null
  }
}

function serializeNull (type: ts.Type): TypeSchema | null {
  if (type.flags === ts.TypeFlags.Null) {
    return {
      type: IntrinsicType.null
    }
  } else {
    return null
  }
}

function serializeUndefined (type: ts.Type): TypeSchema | null {
  if (type.flags === ts.TypeFlags.Undefined) {
    return {
      type: IntrinsicType.undefined
    }
  } else {
    return null
  }
}

function serializeUnknown (type: ts.Type): TypeSchema | null {
  if (type.flags === ts.TypeFlags.Unknown) {
    return {
      type: IntrinsicType.unknown
    }
  } else {
    return null
  }
}

function serializeVoid (type: ts.Type): TypeSchema | null {
  if (type.flags & ts.TypeFlags.Void || type.flags & ts.TypeFlags.VoidLike) {
    return {
      type: IntrinsicType.void
    }
  } else {
    return null
  }
}

const invariantSerializers = [
  serializeAny,
  serializeNever,
  serializeNull,
  serializeUndefined,
  serializeUnknown,
  serializeVoid
]

export default invariantSerializers
