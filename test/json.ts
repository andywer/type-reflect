import Reflect from "ts-reflect"
import { parseJSON } from "ts-reflect/validate"

interface User {
  id: string | number,
  name: string,
  role: "admin" | "read-write" | "read-only"
}

export const schema = Reflect<User>()

const data = `{
  "id": "foo",
  "name": "Andy"
}`

console.log(">", parseJSON(data, schema))
