import ts from "typescript"
import { SerializedTypeBase, SerializedTypeIdentifier } from "./_types"

function serializeAny (type: ts.Type): SerializedTypeBase | null {
  if (type.flags === ts.TypeFlags.Any) {
    return {
      type: SerializedTypeIdentifier.any
    }
  } else {
    return null
  }
}

function serializeNever (type: ts.Type): SerializedTypeBase | null {
  if (type.flags === ts.TypeFlags.Never) {
    return {
      type: SerializedTypeIdentifier.never
    }
  } else {
    return null
  }
}

function serializeNull (type: ts.Type): SerializedTypeBase | null {
  if (type.flags === ts.TypeFlags.Null) {
    return {
      type: SerializedTypeIdentifier.null
    }
  } else {
    return null
  }
}

function serializeUndefined (type: ts.Type): SerializedTypeBase | null {
  if (type.flags === ts.TypeFlags.Undefined) {
    return {
      type: SerializedTypeIdentifier.undefined
    }
  } else {
    return null
  }
}

function serializeUnknown (type: ts.Type): SerializedTypeBase | null {
  if (type.flags === ts.TypeFlags.Unknown) {
    return {
      type: SerializedTypeIdentifier.unknown
    }
  } else {
    return null
  }
}

function serializeVoid (type: ts.Type): SerializedTypeBase | null {
  if (type.flags & ts.TypeFlags.Void || type.flags & ts.TypeFlags.VoidLike) {
    return {
      type: SerializedTypeIdentifier.void
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
