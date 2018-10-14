import ts from "typescript"
import {
  ArrayType,
  BuiltinType,
  IntrinsicType,
  SerializationContext
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

function isPromiseSymbol (symbol: ts.Symbol) {
  if (symbol.name === "Promise" && symbol.members) {
    const memberKeys: string[] = Array.from(symbol.members.keys() as any)
    return includesAll(memberKeys, [
      "catch",
      "then"
    ])
  }
  return false
}

function serializeBuiltin (type: ts.Type, context: SerializationContext): ArrayType | BuiltinType<any> | null {
  if (!Boolean(type.flags & ts.TypeFlags.Object)) {
    return null
  }

  const { objectFlags } = type as ts.ObjectType
  const symbol = type.getSymbol()

  if (symbol && isArraySymbol(symbol) && (objectFlags & ts.ObjectFlags.Reference)) {
    const { typeArguments } = type as ts.TypeReference
    return {
      type: IntrinsicType.array,
      items: typeArguments && typeArguments.length === 1
        ? context.serializeType(typeArguments[0])
        : {
          anyOf: (typeArguments || []).map(context.serializeType)
        }
    }
  } else if (symbol && isDateSymbol(symbol)) {
    return {
      "$ref": "runtime#date"
    }
  } else if (symbol && isPromiseSymbol(symbol)) {
    return {
      "$ref": "runtime#promise"
    }
  }
  return null
}

export default [
  serializeBuiltin
]
