import { TypeSchema } from "./schema"

function ReflectStub<Type = any> (): TypeSchema {
  throw new Error("Don't use ts-reflect directly. Use the 'ts-reflect/transform' transformation.")
}

export = ReflectStub