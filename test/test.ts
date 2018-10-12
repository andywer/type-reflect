import Reflect from "ts-reflect"

interface User {
  id: 12
  name: string
  age?: number,
  created_at: Date,
  logins: Date[]
  someNumbers: [1,2]
}

interface PowerUser extends User {
  admin: true
}

export const schema = Reflect<PowerUser>()
