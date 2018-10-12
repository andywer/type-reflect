import ts, { createArrayLiteral } from "typescript"
import { SerializedTypeBase, SerializedTypeIdentifier } from "./serializers/_types"
import serializers from "./serializers/index"

function createObjectLiteral (object: any): ts.ObjectLiteralExpression {
  const props = Object.keys(object)
    .filter(key => object[key] !== undefined)
    .map(key => ts.createPropertyAssignment(key, createExpression(object[key])))
  return ts.createObjectLiteral(props, true)
}

function createExpression (thing: any): ts.Expression {
  if (thing === undefined) {
    return ts.createVoidZero()
  } else if (thing === null) {
    return ts.createNull()
  } else if (typeof thing === "boolean") {
    return ts.createLiteral(thing)
  } else if (typeof thing === "number") {
    return ts.createNumericLiteral(String(thing))
  } else if (typeof thing === "string") {
    return ts.createStringLiteral(thing)
  } else if (Array.isArray(thing)) {
    return createArrayLiteral(thing.map(element => createExpression(element)), true)
  } else if (typeof thing === "object") {
    return createObjectLiteral(thing)
  } else {
    throw new Error(`Don't know how to turn a ${thing} into an AST expression.`)
  }
}

function serializeType (checker: ts.TypeChecker, type: ts.Type, node: ts.Node, typeName?: string): SerializedTypeBase {
  const _serializeTypeBySymbolAt = (symbol: ts.Symbol) => serializeTypeBySymbolAt(checker, symbol, node)
  const _serializeType = (type: ts.Type) => serializeType(checker, type, node)

  for (const serializer of serializers) {
    const serialized = serializer(type, _serializeTypeBySymbolAt, _serializeType)
    if (serialized) {
      return {
        name: serialized.type === SerializedTypeIdentifier.builtin ? undefined : typeName,
        ...serialized
      }
    }
  }

  console.log(`No serializer matched type flags: ${type.flags}. Falling back to "any".`)
  return {
    type: SerializedTypeIdentifier.any,
    name: typeName
  }
}

function getTypeName (type: ts.Type, node: ts.Node): string | null {
  const symbol = type.getSymbol()

  if (symbol) {
    return symbol.name
  } else if ((node as any).typeName) {
    return ((node as any).typeName as ts.Identifier).getText()
  } else {
    return null
  }
}

function serializeTypeBySymbolAt (checker: ts.TypeChecker, symbol: ts.Symbol, node: ts.Node) {
  const type = checker.getTypeOfSymbolAtLocation(symbol, node)
  return serializeType(checker, type, node)
}

export function serializeTypeNode (node: ts.TypeNode, checker: ts.TypeChecker): ts.Node {
  const type = checker.getTypeFromTypeNode(node)
  const typeName = getTypeName(type, node)

  return createObjectLiteral(serializeType(checker, type, node, typeName || undefined))
}
