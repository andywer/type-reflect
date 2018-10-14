# type-reflect

TypeScript transformation and runtime that allows you to access TypeScript type information on runtime.

⚠️ Status: Experimental


## Installation

```sh
$ npm install type-reflect
```


## Usage

Accessing type information in your code is easy:

```ts
import Reflect from "type-reflect"

interface User {
  id: string | number,
  name: string,
  role: "admin" | "read-write" | "read-only"
}

export const schema = Reflect<User>()

/*
  `Reflect<User>()` will be transpiled to:

  {
    type: "object",
    title: "User",
    properties: {
      id: {
        type: ["string", "number"]
      },
      name: {
        type: "string"
      },
      role: {
        type: "string",
        enum: ["admin", "read-write", "read-only"]
      }
    },
    required: ["id", "name", "role"]
  }
 */
```

To transpile the TypeScript code using the `type-reflect` transformation, use the [`ts` compiler](https://github.com/andywer/ts):

```sh
$ ts --transform type-reflect/transform ./source.ts
```


## Validating data

```ts
import { validate } from "type-reflect/validate"
import { getUser } from "./user"
import { schema } from "./user-schema"

const user = validate(getUser(), schema)

// Will throw an error if the return value of `getUser()` does not match the schema
// TypeScript can automatically infer that `user` is of type `User` after validation
```


## Validated JSON parsing

```ts
import { parseJSON } from "type-reflect/validate"
import { schema } from "./user-schema"

const json = `{
  "id": 1,
  "name": "Me",
  "role": "read-write"
}`

const user = parseJSON(json, schema)

// Will throw an error if the JSON data does not match the schema
// TypeScript can automatically infer that `user` is of type `User`
```

## Known Limitations

- Generic types / interfaces do not work correctly yet (generic type arguments don't work)
- Tuples are casted to `any[]` right now


## License

MIT
