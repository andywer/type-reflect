import ts from "typescript"
import { BasicType, IntrinsicType, SerializationContext, TypeSchema, UnionType } from "./_types"

interface ObjectProperties {
  [propName: string]: TypeSchema
}

const primitiveTypes = [
  IntrinsicType.any,
  IntrinsicType.boolean,
  IntrinsicType.never,
  IntrinsicType.null,
  IntrinsicType.number,
  IntrinsicType.string,
  IntrinsicType.undefined
]

function concat<T> (arrays: T[][]): T[] {
  return arrays.reduce(
    (concated, array) => [ ...concated, ...array ],
    [] as T[]
  )
}

function dedupe<T> (array: T[]): T[] {
  return Array.from(new Set(array))
}

function isPrimitiveType (serializedType: TypeSchema) {
  return Boolean(
    serializedType.type
    && !Array.isArray(serializedType.type)
    && primitiveTypes.indexOf(serializedType.type) > -1
  )
}

function isTypeOnly (serializedType: TypeSchema) {
  return Boolean(
    Object.keys(serializedType).length === 1
    && ("type" in serializedType)
  )
}

function getPropertyTypes (propertiesArray: Array<ObjectProperties>, propertyName: string): TypeSchema[] {
  const types: TypeSchema[] = []

  for (const properties of propertiesArray) {
    if (properties[propertyName]) {
      types.push(properties[propertyName])
    }
  }

  return types
}

function intersectProperties (propertiesArray: Array<ObjectProperties>): ObjectProperties {
  const propertyNamesWithDuplicates = concat(propertiesArray.map(properties => Object.keys(properties)))
  const propertyNames = dedupe(propertyNamesWithDuplicates)

  const properties: ObjectProperties = {}

  for (const propertyName of propertyNames) {
    const propertyTypes = getPropertyTypes(propertiesArray, propertyName)
    if (propertyTypes.length === 1) {
      properties[propertyName] = propertyTypes[0]
    } else {
      throw new Error("ts-reflect: Intersecting object properties is not yet supported.")
    }
  }

  return properties
}

function serializeIntersection (type: ts.Type, context: SerializationContext): TypeSchema | null {
  if (type.flags & ts.TypeFlags.Intersection) {
    const intersectionTypes = (type as ts.UnionOrIntersectionType).types
    const serializedTypes = intersectionTypes.map(intersectionType => context.serializeType(intersectionType))

    if (!serializedTypes.every(intersectionType => intersectionType.type === IntrinsicType.object)) {
      throw new Error("ts-reflect: Intersection types are supported for intersections of object types only.")
    }

    const properties = intersectProperties(
      serializedTypes.map(serializedType => serializedType.properties || {})
    )

    return {
      type: IntrinsicType.object,
      required: dedupe(concat(serializedTypes.map(serializedType => serializedType.required || []))),
      properties
    }
  } else {
    return null
  }
}

function serializeUnion (type: ts.Type, context: SerializationContext): UnionType | BasicType | null {
  // TODO: Aggregate union of same base types, all with enum values, to one schema type

  if (type.flags & ts.TypeFlags.Union) {
    const unionTypes = (type as ts.UnionOrIntersectionType).types
    const serializedUnionTypes = unionTypes.map(unionType => context.serializeType(unionType))

    if (serializedUnionTypes.every(unionType => isPrimitiveType(unionType) && isTypeOnly(unionType))) {
      return {
        type: serializedUnionTypes.map(unionType => unionType.type as IntrinsicType)
      }
    }

    return {
      anyOf: serializedUnionTypes
    }
  }
  return null
}

export default [
  serializeIntersection,
  serializeUnion
]
