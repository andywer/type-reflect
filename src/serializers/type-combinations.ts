import ts from "typescript"
import {
  SerializedCombinedType,
  SerializedTypeBase,
  SerializedTypeIdentifier,
  SerializeTypeFn
} from "./_types"

function destructureUnionWithUndefined (unionTypes: ts.Type[], serializeType: SerializeTypeFn): SerializedTypeBase | SerializedCombinedType {
  if (unionTypes.length === 2 && unionTypes.some(unionType => Boolean(unionType.flags & ts.TypeFlags.Undefined))) {
    const nonUndefinedTypes = unionTypes.filter(unionType => !Boolean(unionType.flags & ts.TypeFlags.Undefined))
    return nonUndefinedTypes.length > 0
      ? {
        ...serializeType(nonUndefinedTypes[0]),
        optional: true
      }
      : {
        type: SerializedTypeIdentifier.undefined
      }
  } else {
    return {
      type: SerializedTypeIdentifier.union,
      subtypes: unionTypes.map(unionType => serializeType(unionType))
    }
  }
}

function serializeIntersection (type: ts.Type, serializeSymbol: any, serializeType: SerializeTypeFn): SerializedTypeBase | SerializedCombinedType | null {
  if (type.flags & ts.TypeFlags.Intersection) {
    const intersectionTypes = (type as ts.UnionOrIntersectionType).types
    return {
      type: SerializedTypeIdentifier.union,
      subtypes: intersectionTypes.map(intersectionType => serializeType(intersectionType))
    }
  } else {
    return null
  }
}

function serializeUnion (type: ts.Type, serializeSymbol: any, serializeType: SerializeTypeFn): SerializedTypeBase | SerializedCombinedType | null {
  if (type.flags & ts.TypeFlags.Union) {
    return destructureUnionWithUndefined((type as ts.UnionOrIntersectionType).types, serializeType)
  } else {
    return null
  }
}

export default [
  serializeIntersection,
  serializeUnion
]
