# km-api

[![npm version](https://img.shields.io/npm/v/km-api.svg)](https://www.npmjs.com/package/km-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Zod-4.x-purple.svg)](https://zod.dev/)

Type-safe API schema builder for TypeScript. Define HTTP endpoints with Zod validation, full OpenAPI 3.0 compatibility, and adapters for Axios, Fetch, and Alova.

## Features

- **Type-safe API definitions** — full IntelliSense for every field
- **OpenAPI 3.0 compatible** — path, methods, parameters, responses, examples
- **Dual path syntax** — Express `:param` and OpenAPI `{param}` both work
- **Zod schema validation** — runtime-safe request and response data
- **HTTP client adapters** — Axios, Fetch, Alova (UniApp, XHR, Taro)
- **Request body conversion** — auto-converts JSON, form-data, multipart, binary
- **Response shape builders** — standardised single-item and paginated-list wrappers
- **OpenAPI examples** — optional per-endpoint request/response examples

## Installation

```bash
npm install km-api zod
# or
yarn add km-api zod
# or
pnpm add km-api zod
# or
bun add km-api zod
```

## Compatibility

| km-api  | TypeScript | Zod  | Node.js |
|---------|------------|------|---------|
| 0.3.x   | 5.9+       | 4.x  | 14+     |
| 0.2.x   | 5.9+       | 4.x  | 14+     |
| 0.1.x   | 5.x        | 3.x  | 14+     |

---

## Quick Start

```typescript
import { z } from 'zod';
import { makeApiConfig } from 'km-api';

const getUser = makeApiConfig({
  method: 'GET',
  pathShape: '/users/{id}',
  tags: ['#users'],
  auth: 'YES',
  responseContentType: 'application/json',
  summary: 'Get user by ID',
  description: 'Retrieves a single user by their unique identifier.',
  request: {
    body: z.any(),
    params: z.object({ id: z.string().uuid() }),
    query: z.object({ include: z.enum(['profile', 'settings']).optional() }),
    headers: z.object({ 'x-api-key': z.string().optional() }),
    cookies: z.object({ sessionId: z.string().optional() }),
  },
  response: {
    200: z.object({ id: z.string(), name: z.string(), email: z.string() }),
    404: z.object({ message: z.string() }),
  },
});

// Resolve path
getUser.makeFullPath({ id: '550e8400-e29b-41d4-a716-446655440000' });
// → '/users/550e8400-e29b-41d4-a716-446655440000'

// OpenAPI path format
getUser.makeOpenAPIPath();
// → '/users/{id}'

// HTTP client adapter config
getUser.convertResponseType('axios');   // { responseType: 'json' }
getUser.convertResponseType('fetch');   // { responseMethod: 'json' }
```

---

## API Reference

### `makeApiConfig(config)`

Creates a typed endpoint configuration with helper methods attached.

#### Configuration fields

| Field                | Type                       | Required | Description |
|----------------------|----------------------------|----------|-------------|
| `method`             | `IMethod`                  | ✅       | HTTP method (case-insensitive) |
| `pathShape`          | `IPath`                    | ✅       | Path starting with `/` |
| `request.body`       | `ZodType`                  | ✅       | Request body Zod schema |
| `request.params`     | `ZodObject`                | ✅       | Path parameters Zod schema |
| `request.query`      | `ZodObject`                | ✅       | Query parameters Zod schema |
| `request.headers`    | `ZodObject`                | ✅       | Custom headers Zod schema |
| `request.cookies`    | `ZodObject`                | ✅       | Cookie parameters Zod schema |
| `response`           | `Record<statusCode, ZodType>` | ✅    | Response schemas keyed by status code |
| `tags`               | `string[]`                 | –        | Tags prefixed with `#` |
| `auth`               | `'YES' \| 'NO'`            | –        | Authentication requirement |
| `responseContentType`| `IResponseContentType`     | –        | Response MIME type |
| `requestContentType` | `IRequestContentType`      | –        | Request body MIME type |
| `disable`            | `'YES' \| 'NO'`            | –        | Mark endpoint as disabled |
| `summary`            | `string`                   | –        | Short summary (1–2 sentences) |
| `description`        | `string`                   | –        | Detailed description (Markdown) |
| `examples`           | `IEndpointExamples`        | –        | OpenAPI 3.0 examples for docs |

#### Returned helper methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `makeBody` | `(data) => data` | Returns type-safe request body |
| `makeParams` | `(params) => params` | Returns type-safe path parameters |
| `makeQueries` | `(queries) => queries` | Returns type-safe query parameters |
| `makeHeaders` | `(headers) => headers` | Returns type-safe headers |
| `makeCookies` | `(cookies) => cookies` | Returns type-safe cookies |
| `makeFullPath` | `(params) => string` | Resolves the path template to a URL |
| `makeOpenAPIPath` | `() => string` | Converts path to OpenAPI `{param}` format |
| `convertResponseType` | `(adapter) => AdapterConfig` | Returns adapter-specific response config |

---

### Path syntax

Both path parameter styles are supported and can be mixed:

```typescript
// Express-style
pathShape: '/users/:id/posts/:postId'

// OpenAPI-style
pathShape: '/users/{id}/posts/{postId}'

// Mixed (valid)
pathShape: '/users/:id/posts/{postId}'
```

```typescript
config.makeFullPath({ id: '1', postId: '42' }); // '/users/1/posts/42'
config.makeOpenAPIPath();                         // '/users/{id}/posts/{postId}'
```

---

### Response schemas

Map status codes to Zod schemas. Both number and string keys are accepted:

```typescript
response: {
  200: z.object({ id: z.string(), name: z.string() }),
  201: z.object({ id: z.string() }),           // alternate success
  400: z.object({ message: z.string() }),
  '404': z.object({ message: z.string() }),    // string key also works
  500: z.object({ error: z.string() }),
}
```

---

### Response shape builders

Use `makeResponseSuccessShape` to create consistent wrappers for item and list responses.

#### Single item

```typescript
import { makeResponseSuccessShape } from 'km-api';

const userSchema = z.object({ id: z.string(), name: z.string() });

const shape = makeResponseSuccessShape(userSchema, 'user');
const itemSchema = shape.item();

// Validates: { user: { id: '1', name: 'Alice' } }
```

#### Paginated list

```typescript
import { makeResponseSuccessShape, paginationSchema } from 'km-api';

const listSchema = makeResponseSuccessShape(userSchema, 'users')
  .list(paginationSchema());

// Validates:
// {
//   users: [{ id: '1', name: 'Alice' }, ...],
//   currentPage: 1,
//   totalItems: 50,
//   itemsPerPage: 20,
//   totalPages: 3         (optional)
// }
```

#### Custom metadata

```typescript
const meta = z.object({ page: z.number(), total: z.number(), nextCursor: z.string().optional() });

const cursorListSchema = makeResponseSuccessShape(userSchema, 'users').list(meta);
```

---

### HTTP client adapters

#### Response type conversion

```typescript
const config = makeApiConfig({ responseContentType: 'application/pdf', ... });

// Axios
config.convertResponseType('axios');        // { responseType: 'blob' }

// Fetch API
config.convertResponseType('fetch');        // { responseMethod: 'blob' }

// Alova variants
config.convertResponseType('alova-axios');  // { responseType: 'blob' }
config.convertResponseType('alova-uniapp'); // { responseType: 'arraybuffer' }
config.convertResponseType('alova-xhr');    // { responseType: 'blob' }
config.convertResponseType('alova-taro');   // { responseType: 'arraybuffer', dataType: 'arraybuffer' }
```

#### Request body conversion

```typescript
import { convertRequestBody, safeConvertRequestBody } from 'km-api';

// JSON
convertRequestBody({ name: 'Alice' }, 'application/json');
// → '{"name":"Alice"}'

// Form URL-encoded
convertRequestBody({ q: 'search term' }, 'application/x-www-form-urlencoded');
// → URLSearchParams { 'q' => 'search term' }

// Multipart
convertRequestBody({ file: myBlob, title: 'photo' }, 'multipart/form-data');
// → FormData instance

// safeConvertRequestBody — only converts if needed
safeConvertRequestBody('{"name":"Alice"}', 'application/json'); // returned unchanged
safeConvertRequestBody({ name: 'Alice' }, 'application/json');  // converted to string
```

---

### OpenAPI examples (optional)

Add `examples` to any endpoint for documentation tools that support OpenAPI 3.0 examples:

```typescript
const createUser = makeApiConfig({
  method: 'POST',
  pathShape: '/users',
  requestContentType: 'application/json',
  responseContentType: 'application/json',
  request: {
    body: z.object({ name: z.string(), email: z.string().email() }),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    201: z.object({ id: z.string(), name: z.string() }),
    422: z.object({ message: z.string() }),
  },
  examples: {
    request: {
      alice: {
        summary: 'Create Alice',
        value: { name: 'Alice', email: 'alice@example.com' },
      },
    },
    response: {
      '201': {
        created: {
          summary: 'User created successfully',
          value: { id: 'uuid-here', name: 'Alice' },
        },
      },
      '422': {
        invalidEmail: {
          summary: 'Invalid email address',
          value: { message: 'email: Invalid email' },
        },
      },
    },
  },
});
```

Each example follows the [OpenAPI 3.0 Example Object](https://spec.openapis.org/oas/v3.0.3#example-object):

| Field           | Type      | Description |
|-----------------|-----------|-------------|
| `summary`       | `string`  | Short description of the example |
| `description`   | `string`  | Long description, Markdown supported |
| `value`         | `unknown` | The example value (mutually exclusive with `externalValue`) |
| `externalValue` | `string`  | URL to an external example file |

---

### Authentication and headers

```typescript
const protectedEndpoint = makeApiConfig({
  method: 'GET',
  pathShape: '/admin/users',
  auth: 'YES',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({
      Authorization: z.string(),
      'x-tenant-id': z.string().uuid(),
    }),
    cookies: z.object({}),
  },
  response: {
    200: z.array(z.object({ id: z.string() })),
    401: z.object({ message: z.string() }),
    403: z.object({ message: z.string() }),
  },
});

const headers = protectedEndpoint.makeHeaders({
  Authorization: 'Bearer token123',
  'x-tenant-id': '550e8400-e29b-41d4-a716-446655440000',
});
```

---

### Disabling endpoints

```typescript
const legacyEndpoint = makeApiConfig({
  method: 'GET',
  pathShape: '/v1/users',
  disable: 'YES',
  description: 'Deprecated. Use /v2/users instead.',
  request: { ... },
  response: { ... },
});

if (legacyEndpoint.disable === 'YES') {
  console.warn('This endpoint is disabled');
}
```

---

### Complete blog API example

```typescript
import { z } from 'zod';
import { makeApiConfig, makeResponseSuccessShape, paginationSchema } from 'km-api';

const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  authorId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

const errorSchema = z.object({ message: z.string(), code: z.number().int() });

const blogApi = {
  listPosts: makeApiConfig({
    method: 'GET',
    pathShape: '/posts',
    auth: 'NO',
    responseContentType: 'application/json',
    summary: 'List all posts',
    request: {
      body: z.any(),
      params: z.object({}),
      query: z.object({
        page: z.number().int().min(1).optional(),
        limit: z.number().int().max(100).optional(),
        tag: z.string().optional(),
      }),
      headers: z.object({}),
      cookies: z.object({}),
    },
    response: {
      200: makeResponseSuccessShape(postSchema, 'posts').list(paginationSchema()),
    },
  }),

  getPost: makeApiConfig({
    method: 'GET',
    pathShape: '/posts/{slug}',
    auth: 'NO',
    responseContentType: 'application/json',
    summary: 'Get post by slug',
    request: {
      body: z.any(),
      params: z.object({ slug: z.string() }),
      query: z.object({}),
      headers: z.object({}),
      cookies: z.object({}),
    },
    response: {
      200: makeResponseSuccessShape(postSchema, 'post').item(),
      404: errorSchema,
    },
  }),

  createPost: makeApiConfig({
    method: 'POST',
    pathShape: '/posts',
    auth: 'YES',
    requestContentType: 'application/json',
    responseContentType: 'application/json',
    summary: 'Create a new post',
    tags: ['#posts', '#write'],
    request: {
      body: z.object({
        title: z.string().min(3).max(200),
        content: z.string().min(10),
        tags: z.array(z.string()).optional(),
      }),
      params: z.object({}),
      query: z.object({}),
      headers: z.object({ Authorization: z.string() }),
      cookies: z.object({}),
    },
    response: {
      201: makeResponseSuccessShape(postSchema, 'post').item(),
      400: errorSchema,
      401: errorSchema,
    },
  }),

  deletePost: makeApiConfig({
    method: 'DELETE',
    pathShape: '/posts/{id}',
    auth: 'YES',
    summary: 'Delete a post',
    request: {
      body: z.any(),
      params: z.object({ id: z.string().uuid() }),
      query: z.object({}),
      headers: z.object({ Authorization: z.string() }),
      cookies: z.object({}),
    },
    response: {
      204: z.object({}),
      403: errorSchema,
      404: errorSchema,
    },
  }),
};

// Usage
const listQuery = blogApi.listPosts.makeQueries({ page: 2, limit: 10 });
const postPath = blogApi.getPost.makeFullPath({ slug: 'hello-world' });
const axiosCfg = blogApi.createPost.convertResponseType('axios');
```

---

## Testing with Jest

Install test dependencies:

```bash
npm install --save-dev jest ts-jest @types/jest
```

Configure Jest (`jest.config.ts`):

```typescript
import type { Config } from 'jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
} satisfies Config;
```

Write tests against your endpoint configs:

```typescript
import { getUser } from './api/users';

describe('getUser', () => {
  it('resolves path correctly', () => {
    expect(getUser.makeFullPath({ id: '123' })).toBe('/users/123');
  });

  it('converts to OpenAPI path', () => {
    expect(getUser.makeOpenAPIPath()).toBe('/users/{id}');
  });

  it('returns axios config for JSON', () => {
    expect(getUser.convertResponseType('axios')).toEqual({ responseType: 'json' });
  });

  it('validates params schema', () => {
    const validParams = getUser.request.params.parse({ id: '550e8400-e29b-41d4-a716-446655440000' });
    expect(validParams).toEqual({ id: '550e8400-e29b-41d4-a716-446655440000' });
  });
});
```

---

## Migration: v0.2.x → v0.3.x

### Import style

v0.2.x used a deeply nested namespace:

```typescript
// OLD (v0.2.x)
import { kmApi } from 'km-api';
kmApi.apiConfig.makeApiConfig({ ... });
```

v0.3.x uses flat exports:

```typescript
// NEW (v0.3.x)
import { makeApiConfig } from 'km-api';
makeApiConfig({ ... });
```

All names are the same — only the import path changed.

### Removed dependency

`km-type` is no longer required. Remove it from your `package.json` if you installed it separately.

---

## Migration: v0.1.x → v0.2.x

### Breaking changes

**`path` renamed to `pathShape`**

```typescript
// v0.1.x
{ path: '/users/{id}' }

// v0.2.x+
{ pathShape: '/users/{id}' }
```

**Response object restructured**

```typescript
// v0.1.x
response: {
  success: z.object({ ... }),
  error: z.object({ ... }),
}

// v0.2.x+
response: {
  200: z.object({ ... }),
  400: z.object({ ... }),
}
```

**Removed functions**

- `makeParamsOrderedList()` — removed
- `makeParamsString()` — removed
- `makeFullPathShape()` — removed
- `makeFullPath(params, orderList)` → `makeFullPath(params)` (no second argument)

---

## Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/my-feature`
3. Run tests: `npm test`
4. Submit a PR

## License

[MIT](./LICENSE) © komeilm76
