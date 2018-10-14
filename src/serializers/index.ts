import { Serializer } from "./_types"
import basicSerializers from "./basic"
import invariantSerializers from "./invariants"
import objectSerializers from "./object"
import runtimeInstanceSerializers from "./runtime"
import typeCombinationSerializers from "./type-combinations"

const serializers: Serializer[] = [
  ...runtimeInstanceSerializers,
  ...objectSerializers,
  ...typeCombinationSerializers,
  ...basicSerializers,
  ...invariantSerializers
]

export default serializers
