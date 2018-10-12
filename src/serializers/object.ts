import ts from "typescript"
import {
  SerializedType,
  SerializedObjectType,
  SerializedTypeIdentifier,
  SerializeTypeFn,
  SerializeTypeSymbolAtFn
} from "./_types"

function includesAll<T> (array: T[], expectedElements: T[]) {
  return expectedElements.every(expectedElement => array.indexOf(expectedElement) > -1)
}

function isArraySymbol (symbol: ts.Symbol) {
  if (symbol.name === "Array" && symbol.members) {
    const memberKeys: string[] = Array.from(symbol.members.keys() as any)
    return includesAll(memberKeys, [
      "length",
      "pop",
      "push",
      "join",
      "shift",
      "slice",
      "sort"
    ])
  }
  return false
}

function isDateSymbol (symbol: ts.Symbol) {
  if (symbol.name === "Date" && symbol.members) {
    const memberKeys: string[] = Array.from(symbol.members.keys() as any)
    return includesAll(memberKeys, [
      "toString",
      "toDateString",
      "toISOString",
      "toTimeString",
      "valueOf",
      "getDate",
      "getTime"
    ])
  }
  return false
}

function serializeMembers (members: ts.UnderscoreEscapedMap<ts.Symbol>, serializeTypeSymbolAt: SerializeTypeSymbolAtFn): SerializedObjectType["members"] {
  const serialized: SerializedObjectType["members"] = {}

  members.forEach((symbol, key) => {
    serialized[key as string] = serializeTypeSymbolAt(symbol)
  })

  return serialized
}

function serializeTuple (type: ts.ObjectType) {
  if (type.flags & ts.TypeFlags.Object) {
    const { objectFlags } = type as ts.ObjectType

    if (objectFlags & ts.ObjectFlags.Tuple) {
      return {
        type: SerializedTypeIdentifier.builtin,
        instance: "array",
        elementType: SerializedTypeIdentifier.any
      }
    }
  }
  return null
}

function serializeBuiltin (type: ts.ObjectType, serializeType: SerializeTypeFn) {
  const { objectFlags } = type
  const symbol = type.getSymbol()

  if (symbol && isArraySymbol(symbol) && (objectFlags & ts.ObjectFlags.Reference)) {
    const { typeArguments } = type as ts.TypeReference
    return {
      type: SerializedTypeIdentifier.builtin,
      instance: "array",
      elementType: typeArguments && typeArguments.length === 1
        ? serializeType(typeArguments[0])
        : SerializedTypeIdentifier.any
    }
  } else if (symbol && isDateSymbol(symbol)) {
    return {
      type: SerializedTypeIdentifier.builtin,
      instance: "date"
    }
  }
  return null
}

function serializeObjectType (type: ts.Type, serializeTypeSymbolAt: SerializeTypeSymbolAtFn, serializeType: SerializeTypeFn): SerializedType | null {
  if (type.flags & ts.TypeFlags.Object) {
    const { objectFlags } = type as ts.ObjectType
    let inheritedTypes: SerializedObjectType[] = []

    const serializedBuiltin = serializeBuiltin(type as ts.ObjectType, serializeType)
    if (serializedBuiltin) return serializedBuiltin

    const serializedTuple = serializeTuple(type as ts.ObjectType)
    if (serializedTuple) return serializedTuple

    if (objectFlags & ts.ObjectFlags.Reference) {
      const serializedReference = serializeObjectType((type as ts.TypeReference).target, serializeTypeSymbolAt, serializeType)
      if (serializedReference) return serializedReference
    }

    if (objectFlags & ts.ObjectFlags.Interface) {
      const baseTypes = (type as ts.InterfaceType).getBaseTypes()

      if (baseTypes) {
        inheritedTypes = baseTypes
          .map(baseType => serializeObjectType(baseType, serializeTypeSymbolAt, serializeType))
          .filter(serializedBaseType => serializedBaseType && serializedBaseType.type === "object") as SerializedObjectType[]
      }
    }

    const inheritedMembers = inheritedTypes.reduce(
      (object, inheritedType) => ({ ...object, ...inheritedType.members }),
      {} as SerializedObjectType["members"]
    )

    const symbol = type.getSymbol()
    const members = symbol && symbol.members ? serializeMembers(symbol.members, serializeTypeSymbolAt) : {}

    return {
      type: SerializedTypeIdentifier.object,
      members: {
        ...inheritedMembers,
        ...members
      }
    }
  } else {
    return null
  }
}

export default [ serializeObjectType ]
