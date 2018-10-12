
function ReflectStub<Type = any> () {
  throw new Error("Don't use ts-reflect directly. Use the 'ts-reflect/transform' transformation.")
}

export = ReflectStub
