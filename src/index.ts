import { TypeSchema } from "./schema"

function ReflectStub<Type = any> (): TypeSchema<Type> {
  throw new Error("Don't use type-reflect directly. Use the 'type-reflect/transform' transformation.")
}

export = ReflectStub
