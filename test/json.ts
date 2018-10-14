import Reflect from "type-reflect"
import { parseJSON } from "type-reflect/validate"

interface User {
  id: string | number,
  name: string,
  role: "admin" | "read-write" | "read-only"
}

export const schema = Reflect<User>()

const data = `{
  "id": "foo",
  "name": "Andy",
  "role": "foo"
}`

console.log(">", parseJSON(data, schema))
