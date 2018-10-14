import ts from "typescript"
import {
  ArrayType,
  GetTypeForSymbolAtFn,
  IntrinsicType,
  ObjectType,
  SerializeTypeFn,
  TypeSchema
} from "./_types"

function dedupe<T> (array: T[]): T[] {
  return Array.from(new Set(array))
}

function serializeMembers (members: ts.Symbol[], serializeType: SerializeTypeFn, getTypeForSymbolAt: GetTypeForSymbolAtFn): ObjectType["properties"] {
  const serialized: ObjectType["properties"] = {}

  for (const symbol of members) {
    const memberType = getTypeForSymbolAt(symbol)
    serialized[symbol.getName()] = serializeType(memberType)
  }

  return serialized
}

function serializeTuple (type: ts.Type): ArrayType | null {
  if (type.flags & ts.TypeFlags.Object) {
    const { objectFlags } = type as ts.ObjectType

    if (objectFlags & ts.ObjectFlags.Tuple) {
      return {
        type: IntrinsicType.array,
        items: {
          type: IntrinsicType.any
        }
      }
    }
  }
  return null
}

function serializeReference (type: ts.Type, serializeType: SerializeTypeFn): TypeSchema | null {
  if (!Boolean(type.flags & ts.TypeFlags.Object)) {
    return null
  }

  const { objectFlags } = type as ts.ObjectType

  if ((objectFlags & ts.ObjectFlags.Reference) && (type as ts.TypeReference).target !== type) {
    return serializeType((type as ts.TypeReference).target)
  }
  return null
}

function serializeObjectType (type: ts.Type, serializeType: SerializeTypeFn, getTypeForSymbolAt: GetTypeForSymbolAtFn): TypeSchema | null {
  if (type.flags & ts.TypeFlags.Object) {
    const { objectFlags } = type as ts.ObjectType
    let inheritedTypes: ObjectType[] = []

    if (objectFlags & ts.ObjectFlags.Interface) {
      const baseTypes = (type as ts.InterfaceType).getBaseTypes()

      if (baseTypes) {
        inheritedTypes = baseTypes
          .map(baseType => serializeObjectType(baseType, serializeType, getTypeForSymbolAt))
          .filter(serializedBaseType => serializedBaseType && serializedBaseType.type === "object") as ObjectType[]
      }
    }

    const inheritedMembers = inheritedTypes.reduce(
      (object, inheritedType) => ({ ...object, ...inheritedType.properties }),
      {} as ObjectType["properties"]
    )

    const symbol = type.getSymbol()
    const members = serializeMembers((type as ts.ObjectType).getProperties(), serializeType, getTypeForSymbolAt)

    // TODO: For all properties: If it's a union of [*, undefined], normalize to * and strip from `required`

    return {
      type: IntrinsicType.object,
      title: symbol ? symbol.getName() : undefined,
      properties: {
        ...inheritedMembers,
        ...members
      },
      required: dedupe([
        ...Object.keys(inheritedMembers || {}),
        ...Object.keys(members || {})
      ])
    }
  } else {
    return null
  }
}

export default [
  serializeReference,
  serializeTuple,
  serializeObjectType
]
