import Reflect from "type-reflect"

interface User<Logins> {
  id: 12
  name: string
  age?: number,
  created_at: Date,
  logins: Logins
  someNumbers: [1,2]
}

export const schema = Reflect<User<Date[]>>()
