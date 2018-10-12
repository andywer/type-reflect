import { Serializer } from "./_types"
import basicSerializers from "./basic"
import typeCombinationSerializers from "./type-combinations"
import invariantSerializers from "./invariants"
import objectSerializers from "./object"

const serializers: Serializer[] = [
  ...basicSerializers,
  ...invariantSerializers,
  ...objectSerializers,
  ...typeCombinationSerializers
]

export default serializers
