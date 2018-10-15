# type-reflect

TypeScript transformation plugin that provides access to TypeScript type information at runtime. Comes with a validation function and a type-checking `JSON.parse()`.

Use with TypeScript 3.

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
  name: string,
  role: "admin" | "read-write" | "read-only"
}

export const schema = Reflect<User>()
```

The `Reflect<>()` call above will be transpiled to:

```ts
export const schema = {
  type: "object",
  title: "User",
  properties: {
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
```

It works with all kinds of types, like strings, `any`, objects, arrays and much more:

```ts
const ageSchema = Reflect<"new" | "old">()
```

### Validating data

```ts
import { validate } from "type-reflect/validate"
import { getUser } from "./user"
import { schema } from "./user-schema"

const user = validate(getUser(), schema)

// Throws if the return value of `getUser()` does not match the schema
// TypeScript can automatically infer that `user` is of type `User`
```

### Validated JSON parsing

```ts
import { parseJSON } from "type-reflect/validate"
import { schema } from "./user-schema"

const json = `{
  "name": "Me",
  "role": "read-write"
}`

const user = parseJSON(json, schema)

// Throws if the JSON data does not match the schema
// TypeScript can automatically infer that `user` is of type `User`
```


## Compilation

To transpile the TypeScript code using the `type-reflect` transformation, use the [`ts` compiler](https://github.com/andywer/ts):

```sh
$ ts --transform type-reflect/transform ./source.ts
```

To permanently use the transformation in your project, add this configuration to your `package.json`:

```js
{
  // ...
  "ts": {
    "transforms": [
      "type-reflect"
    ]
  }
}
```

Note that you cannot use the standard `tsc`, since it does not expose the transformation API.


## Known Limitations

- Generic types / interfaces do not work correctly yet (generic type arguments don't work)
- Tuples are casted to `any[]` right now


## License

MIT
