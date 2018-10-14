import Reflect from "type-reflect"
import { validate } from "type-reflect/validate"

interface User {
  id: string | number,
  name: string,
  // created_at: Date
}

export const schema = Reflect<User>()

const data = {
  id: "foo",
  name: "Andy",
  // created_at: new Date()
}

console.log(">", validate(data, schema))
