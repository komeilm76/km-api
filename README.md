# km-api

km-api is a Typescript library for make schema for apis.

## Installation

Use the package manager [npm](https://www.npmjs.com/package/km-api) to install km-api.

```bash
npm install km-api
```

## Usage

```typescript

// example 1
import kmApi from "km-api";
import { z } from "zod";
const getUserByIdApiConfig = kmApi.makeApiConfig({
    method: 'get',
    path: '/admin/user/{id}',
    description: 'Information of Selected User by ID',
    request: {
        body: z.undefined(),
        params: z.object({}),
        query: z.object({}),
    },
    response: {
        data: z.object({
            name: z.string(),
            age: z.number(),
            isMarid: z.boolean()
        })
    },
    auth: 'YES',
    disable: 'YES',
})
// -----------------------------
// example 2
import kmApi from "km-api";
import { z } from "zod";
const getUsersByRoleApiConfig = kmApi.makeApiConfig({
    method: 'get',
    path: '/admin/users/{role}',
    description: 'Information of Selected User by ID',
    request: {
        body: z.undefined(),
        params: z.object({ role: z.union([z.literal('employee'), z.literal('applicant'), z.literal('guest')]) }),
        query: z.object({
            searchTerm: z.string(),
            pageSize: z.number(),
            totalItems: z.number()
        }),
    },
    response: {
        data: z.object({
            name: z.string(),
            age: z.number(),
            isMarid: z.boolean()
        }).array()
    },
    auth: 'YES',
    disable: 'YES',
}).makeExamples({
    exampleOfRequestBody: undefined,
    exampleOfRequestParms: { role: 'employee' },
    exampleOfRequestQuery: { pageSize: 1, searchTerm: 'foo', totalItems: 1000 },
    exampleOfResponseData: [
        {
            age: 27,
            isMarid: false,
            name: 'komeil'
        }
    ]
})
// -----------------------------
```

## dependensies

Required Dependensies is [ZOD](https://zod.dev/)

## License

[MIT](https://choosealicense.com/licenses/mit/)