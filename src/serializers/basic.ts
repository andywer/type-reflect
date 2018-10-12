import ts from "typescript"
import {
  SerializedTypeBase,
  SerializedTypeWithValueBase,
  SerializedTypeIdentifier
} from "./_types"

function serializeBoolean (type: ts.Type): SerializedTypeBase | SerializedTypeWithValueBase | null {
  if (type.flags & ts.TypeFlags.BooleanLiteral) {
    return {
      type: SerializedTypeIdentifier.boolean,
      value: (type as ts.LiteralType).value
    }
  } else if (type.flags & ts.TypeFlags.Boolean || type.flags & ts.TypeFlags.BooleanLike) {
    return {
      type: SerializedTypeIdentifier.boolean
    }
  } else {
    return null
  }
}

function serializeNumber (type: ts.Type): SerializedTypeBase | SerializedTypeWithValueBase | null {
  if (type.flags & ts.TypeFlags.NumberLiteral) {
    return {
      type: SerializedTypeIdentifier.number,
      value: (type as ts.LiteralType).value
    }
  } else if (type.flags & ts.TypeFlags.Number || type.flags & ts.TypeFlags.NumberLike) {
    return {
      type: SerializedTypeIdentifier.number
    }
  } else {
    return null
  }
}

function serializeString (type: ts.Type): SerializedTypeBase | SerializedTypeWithValueBase | null {
  if (type.flags & ts.TypeFlags.StringLiteral) {
    return {
      type: SerializedTypeIdentifier.string,
      value: (type as ts.LiteralType).value
    }
  } else if (type.flags & ts.TypeFlags.String || type.flags & ts.TypeFlags.StringLike) {
    return {
      type: SerializedTypeIdentifier.string
    }
  } else {
    return null
  }
}

function serializeSymbol (type: ts.Type): SerializedTypeBase | null {
  if (type.flags & (ts.TypeFlags.ESSymbol | ts.TypeFlags.ESSymbolLike | ts.TypeFlags.UniqueESSymbol)) {
    return {
      type: SerializedTypeIdentifier.symbol
    }
  } else {
    return null
  }
}

const basicSerializers = [
  serializeBoolean,
  serializeNumber,
  serializeString,
  serializeSymbol
]

export default basicSerializers
