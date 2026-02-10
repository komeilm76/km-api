# 🚀 km-api

[![npm version](https://img.shields.io/npm/v/km-api.svg)](https://www.npmjs.com/package/km-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Zod-3.25+-purple.svg)](https://zod.dev/)

A powerful TypeScript package that provides **IntelliSense** and **type-safe validation** for APIs using Zod schemas. Build robust, self-documenting API configurations with full OpenAPI/Swagger compatibility.

## ✨ Features

- 🔒 **Type-safe API configurations** with full IntelliSense support
- ✅ **Automatic validation** using Zod schemas
- 🎯 **Dual path syntax support** - Express (`:param`) and OpenAPI (`{param}`)
- 📊 **Response shape builders** for consistent API responses
- 🔐 **Authentication support** built-in
- 🔄 **HTTP client adapters** for Axios, Fetch, Alova, and more
- 📝 **Self-documenting** API configurations
- 🌐 **OpenAPI/Swagger compatible** - generate documentation from configs
- 🛠️ **Helper methods** for common API tasks

## 📦 Installation

```bash
npm install km-api
```

```bash
yarn add km-api
```

```bash
pnpm add km-api
```

```bash
bun add km-api
```

## ⚠️ Version Compatibility

| km-api Version | TypeScript | Zod | Node.js |
|----------------|------------|-----|---------|
| 0.1.0+         | 5.9+       | 3.25+ | 14+   |
| 0.0.7 and below| 4.x        | 3.x | 14+   |

> **Current Version:** 0.1.14 requires TypeScript 5.9+ and Zod 3.25+

## 🎯 Quick Start

```typescript
import { v4, schemas } from 'km-api';
import { z } from 'zod';

// Define your API endpoint
const getUserApi = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/users/{id}',
  tags: ['#users'],
  auth: 'YES',
  responseContentType: 'application/json',
  summary: 'Get user by ID',
  description: 'Retrieves a user by their unique identifier',
  request: {
    body: z.any(),
    params: z.object({
      id: z.string().uuid(),
    }),
    query: z.object({
      include: z.enum(['profile', 'settings']).optional(),
    }),
    headers: z.object({}),
    cookies: z.object({})
  },
  response: {
    success: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string().email(),
    }),
    error: z.object({
      message: z.string(),
      code: z.number(),
    }),
  },
});

// Use helper methods
const params = getUserApi.makeParams({ id: '123e4567-e89b-12d3-a456-426614174000' });
const fullPath = getUserApi.makeFullPath(params);
// Result: "/users/123e4567-e89b-12d3-a456-426614174000"
```

## 📚 Documentation

### Path Syntax Support

km-api supports both Express-style and OpenAPI-style path parameters:

```typescript
// Express-style (colon syntax)
const config1 = v4.makeApiConfig({
  pathShape: '/users/:userId/posts/:postId',
  // ...
});

// OpenAPI-style (curly braces)
const config2 = v4.makeApiConfig({
  pathShape: '/users/{userId}/posts/{postId}',
  // ...
});

// Both work the same way
const path = config1.makeFullPath({ userId: '123', postId: '456' });
// Result: "/users/123/posts/456"
```

### Creating API Configurations

#### GET Request

```typescript
import { v4 } from 'km-api';
import { z } from 'zod';

const listUsersApi = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/users',
  tags: ['#users'],
  auth: 'YES',
  responseContentType: 'application/json',
  summary: 'List all users',
  description: 'Returns a paginated list of users',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
      search: z.string().optional(),
    }),
    headers: z.object({}),
    cookies: z.object({})
  },
  response: {
    success: v4.makeResponseSuccessShape(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
      'users'
    ).list(v4.paginationSchema()),
    error: z.object({
      message: z.string(),
      code: z.number(),
    }),
  },
});

// Use it
const queries = listUsersApi.makeQueries({ page: 1, limit: 20, search: 'john' });
```

#### POST Request with Body

```typescript
const createUserApi = v4.makeApiConfig({
  method: 'POST',
  pathShape: '/users',
  tags: ['#users', '#admin'],
  auth: 'YES',
  requestContentType: 'application/json',
  responseContentType: 'application/json',
  summary: 'Create a new user',
  description: 'Creates a new user account with validation',
  request: {
    body: z.object({
      name: z.string().min(2).max(100),
      email: z.string().email(),
      age: z.number().int().min(18).max(120),
      role: z.enum(['user', 'admin', 'moderator']).default('user'),
    }),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({})
  },
  response: {
    success: z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string(),
      createdAt: z.string().datetime(),
    }),
    error: z.object({
      message: z.string(),
      errors: z.array(
        z.object({
          field: z.string(),
          issue: z.string(),
        })
      ).optional(),
    }),
  },
});

// Use it
const body = createUserApi.makeBody({
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  role: 'user',
});
```

#### PUT/PATCH Request with Path Parameters

```typescript
const updatePostApi = v4.makeApiConfig({
  method: 'PUT',
  pathShape: '/users/{userId}/posts/{postId}',
  tags: ['#posts'],
  auth: 'YES',
  requestContentType: 'application/json',
  responseContentType: 'application/json',
  summary: 'Update a post',
  description: 'Updates a specific post for a user',
  request: {
    body: z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1),
      published: z.boolean().optional(),
    }),
    params: z.object({
      userId: z.string().uuid(),
      postId: z.string().uuid(),
    }),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({})
  },
  response: {
    success: z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      published: z.boolean(),
      updatedAt: z.string().datetime(),
    }),
    error: z.object({
      message: z.string(),
    }),
  },
});

// Use it
const params = updatePostApi.makeParams({
  userId: 'user-123',
  postId: 'post-456',
});

const path = updatePostApi.makeFullPath(params);
// Result: "/users/user-123/posts/post-456"
```

#### DELETE Request

```typescript
const deleteUserApi = v4.makeApiConfig({
  method: 'DELETE',
  pathShape: '/users/{id}',
  tags: ['#users', '#admin'],
  auth: 'YES',
  responseContentType: 'application/json',
  summary: 'Delete a user',
  description: 'Permanently deletes a user account',
  request: {
    body: z.any(),
    params: z.object({
      id: z.string().uuid(),
    }),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({})
  },
  response: {
    success: z.object({
      message: z.string(),
      deletedAt: z.string().datetime(),
    }),
    error: z.object({
      message: z.string(),
      code: z.number(),
    }),
  },
});
```

### Response Shapes

#### Single Item Response

```typescript
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

// Create response wrapper
const userResponse = v4.makeResponseSuccessShape(userSchema, 'user');

// Single item
const singleItemSchema = userResponse.item();
// Validates: { user: { id, name, email } }
```

#### List Response with Pagination

```typescript
const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
});

// List with pagination
const productListSchema = v4.makeResponseSuccessShape(productSchema, 'products')
  .list(v4.paginationSchema());

// Validates:
// {
//   products: [{ id, name, price, category }, ...],
//   currentPage: 1,
//   totalItems: 100,
//   itemsPerPage: 20,
//   totalPages: 5
// }
```

#### Custom Pagination Schema

```typescript
const customPagination = z.object({
  page: z.number(),
  perPage: z.number(),
  total: z.number(),
  hasMore: z.boolean(),
});

const listSchema = v4.makeResponseSuccessShape(userSchema, 'users')
  .list(customPagination);
```

### HTTP Client Adapters

Convert response content types to adapter-specific configurations:

```typescript
const config = v4.makeApiConfig({
  responseContentType: 'application/json',
  // ...
});

// For Axios
const axiosConfig = config.convertResponseType('axios');
// Returns: { responseType: 'json' }

// For Fetch API
const fetchConfig = config.convertResponseType('fetch');
// Returns: { responseMethod: 'json' }

// For Alova with Axios adapter
const alovaAxiosConfig = config.convertResponseType('alova-axios');

// For Alova with UniApp adapter
const alovaUniAppConfig = config.convertResponseType('alova-uniapp');

// For Alova with XHR adapter
const alovaXHRConfig = config.convertResponseType('alova-xhr');

// For Alova with Taro adapter
const alovaTaroConfig = config.convertResponseType('alova-taro');
```

#### PDF Download Example

```typescript
const downloadPdfApi = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/reports/{id}/download',
  responseContentType: 'application/pdf',
  // ...
});

const axiosConfig = downloadPdfApi.convertResponseType('axios');
// Returns: { responseType: 'blob' }
```

### Request Body Conversion

Use the adapters module to convert request bodies to the correct format:

```typescript
import { adapters } from 'km-api';

// JSON conversion
const jsonBody = adapters.convertRequestBody(
  { name: 'John', email: 'john@example.com' },
  'application/json'
);
// Returns: '{"name":"John","email":"john@example.com"}'

// Form data conversion
const formData = adapters.convertRequestBody(
  { name: 'John', avatar: fileBlob },
  'multipart/form-data'
);
// Returns: FormData instance

// URL-encoded form
const urlEncoded = adapters.convertRequestBody(
  { username: 'john', password: 'secret' },
  'application/x-www-form-urlencoded'
);
// Returns: URLSearchParams instance

// Safe conversion (checks if needed)
const safeBody = adapters.safeConvertRequestBody(
  '{"already":"json"}',
  'application/json'
);
// Returns unchanged: '{"already":"json"}'
```

### File Upload Example

```typescript
const uploadFileApi = v4.makeApiConfig({
  method: 'POST',
  pathShape: '/upload',
  tags: ['#files'],
  auth: 'YES',
  requestContentType: 'multipart/form-data',
  responseContentType: 'application/json',
  summary: 'Upload a file',
  request: {
    body: z.object({
      file: z.instanceof(File),
      description: z.string().optional(),
    }),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({
      'X-Upload-Token': z.string(),
    }),
    cookies: z.object({})
  },
  response: {
    success: z.object({
      fileId: z.string(),
      url: z.string().url(),
      size: z.number(),
    }),
    error: z.object({
      message: z.string(),
    }),
  },
});

// Usage
const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
const body = uploadFileApi.makeBody({ file, description: 'Important document' });
const headers = uploadFileApi.makeHeaders({ 'X-Upload-Token': 'token123' });
```

### Authentication & Headers

```typescript
const protectedApi = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/admin/users',
  auth: 'YES', // Indicates authentication required
  request: {
    headers: z.object({
      'Authorization': z.string(), // Bearer token
      'X-API-Version': z.string().default('v1'),
    }),
    // ...
  },
  // ...
});

const headers = protectedApi.makeHeaders({
  'Authorization': 'Bearer eyJhbGc...',
  'X-API-Version': 'v1',
});
```

### Cookies Support

```typescript
const sessionApi = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/profile',
  request: {
    cookies: z.object({
      sessionId: z.string().uuid(),
      preferences: z.string().optional(),
    }),
    // ...
  },
  // ...
});

const cookies = sessionApi.makeCookies({
  sessionId: 'sess-123',
  preferences: 'theme=dark',
});
```

### Disabling Endpoints

```typescript
const deprecatedApi = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/old-endpoint',
  disable: 'YES', // Mark as disabled/deprecated
  description: 'This endpoint is deprecated. Use /v2/endpoint instead.',
  // ...
});
```

## 🎨 Configuration Options

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `method` | `'GET' \| 'POST' \| 'PUT' \| 'DELETE' \| 'PATCH' \| 'HEAD' \| 'OPTIONS'` | HTTP method (case-insensitive) |
| `pathShape` | `string` | API path starting with `/` |
| `request.body` | `ZodType` | Request body schema |
| `request.params` | `ZodObject` | URL parameters schema |
| `request.query` | `ZodObject` | Query parameters schema |
| `request.headers` | `ZodObject` | Custom headers schema |
| `request.cookies` | `ZodObject` | Cookie parameters schema |
| `response.success` | `ZodType` | Success response schema (2xx) |
| `response.error` | `ZodType` | Error response schema (4xx/5xx) |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `tags` | `string[]` | `[]` | Tags for grouping (start with `#`) |
| `auth` | `'YES' \| 'NO'` | `'NO'` | Authentication requirement |
| `responseContentType` | `IResponseContentType` | - | Response MIME type |
| `requestContentType` | `IRequestContentType` | - | Request MIME type |
| `disable` | `'YES' \| 'NO'` | `'NO'` | Disable endpoint flag |
| `summary` | `string` | - | Short description |
| `description` | `string` | - | Detailed description |

### Content Types

#### Response Content Types

Common response types include:

- `'application/json'` - JSON responses
- `'application/xml'` - XML responses
- `'application/pdf'` - PDF files
- `'application/zip'` - ZIP archives
- `'text/plain'` - Plain text
- `'text/html'` - HTML content
- `'text/csv'` - CSV data
- `'image/png'`, `'image/jpeg'` - Images
- `'audio/mpeg'`, `'video/mp4'` - Media files

[See full list in schemas.ts](./src/schemas.ts)

#### Request Content Types

Common request types include:

- `'application/json'` - JSON request body
- `'application/x-www-form-urlencoded'` - URL-encoded forms
- `'multipart/form-data'` - File uploads
- `'text/plain'` - Plain text
- `'application/xml'` - XML data

[See full list in schemas.ts](./src/schemas.ts)

## 🛠️ Helper Methods

### Configuration Helpers

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `makeBody(body)` | `body: T` | `T` | Type-safe request body |
| `makeParams(params)` | `params: T` | `T` | Type-safe URL parameters |
| `makeQueries(queries)` | `queries: T` | `T` | Type-safe query parameters |
| `makeHeaders(headers)` | `headers: T` | `T` | Type-safe headers |
| `makeCookies(cookies)` | `cookies: T` | `T` | Type-safe cookies |
| `makeSuccessResponse(data)` | `data: T` | `T` | Type-safe success response |
| `makeErrorResponse(data)` | `data: T` | `T` | Type-safe error response |

### Path Helpers

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `makeFullPath(params)` | `params: T` | `string` | Generate complete URL with parameter values |
| `makeOpenAPIPath()` | - | `string` | Convert to OpenAPI format (`{param}`) |
| `makeParamsStringShape(list)` | `list: string[]` | `string` | Generate parameter shape (`:param` format) |

### Response Helpers

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `makeResponseSuccessShape(schema, key)` | `schema: ZodType, key?: string` | `ResponseBuilder` | Create response wrapper |
| `.item()` | - | `ZodObject` | Single item response |
| `.list(meta)` | `meta: ZodObject` | `ZodObject` | List response with metadata |
| `paginationSchema()` | - | `ZodObject` | Standard pagination schema |

### Adapter Helpers

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `convertResponseType(adapter)` | `adapter: AdapterType` | `AdapterConfig` | Convert for HTTP client |
| `convertRequestBody(data, type)` | `data: any, type: string` | `any` | Convert request body format |
| `safeConvertRequestBody(data, type)` | `data: any, type: string` | `any` | Convert only if needed |
| `needsConversion(data, type)` | `data: any, type: string` | `boolean` | Check if conversion needed |

## 📖 Complete Example

Here's a complete example building a blog API:

```typescript
import { v4, adapters } from 'km-api';
import { z } from 'zod';

// Schemas
const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  authorId: z.string().uuid(),
  published: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const authorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

// List posts
const listPostsApi = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/posts',
  tags: ['#posts'],
  auth: 'NO',
  responseContentType: 'application/json',
  summary: 'List all posts',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({
      page: z.number().default(1),
      limit: z.number().default(20),
      published: z.boolean().optional(),
    }),
    headers: z.object({}),
    cookies: z.object({})
  },
  response: {
    success: v4.makeResponseSuccessShape(postSchema, 'posts')
      .list(v4.paginationSchema()),
    error: z.object({ message: z.string() }),
  },
});

// Get single post
const getPostApi = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/posts/{id}',
  tags: ['#posts'],
  auth: 'NO',
  responseContentType: 'application/json',
  summary: 'Get post by ID',
  request: {
    body: z.any(),
    params: z.object({ id: z.string().uuid() }),
    query: z.object({ include: z.enum(['author']).optional() }),
    headers: z.object({}),
    cookies: z.object({})
  },
  response: {
    success: v4.makeResponseSuccessShape(
      postSchema.extend({ author: authorSchema.optional() }),
      'post'
    ).item(),
    error: z.object({ message: z.string() }),
  },
});

// Create post
const createPostApi = v4.makeApiConfig({
  method: 'POST',
  pathShape: '/posts',
  tags: ['#posts'],
  auth: 'YES',
  requestContentType: 'application/json',
  responseContentType: 'application/json',
  summary: 'Create a new post',
  request: {
    body: z.object({
      title: z.string().min(1).max(200),
      content: z.string().min(1),
      published: z.boolean().default(false),
    }),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({
      'Authorization': z.string(),
    }),
    cookies: z.object({})
  },
  response: {
    success: v4.makeResponseSuccessShape(postSchema, 'post').item(),
    error: z.object({
      message: z.string(),
      errors: z.array(z.object({
        field: z.string(),
        issue: z.string(),
      })).optional(),
    }),
  },
});

// Usage
async function example() {
  // List posts
  const listQueries = listPostsApi.makeQueries({ page: 1, limit: 10, published: true });
  
  // Get post
  const postParams = getPostApi.makeParams({ id: 'post-123' });
  const postPath = getPostApi.makeFullPath(postParams);
  
  // Create post
  const newPost = createPostApi.makeBody({
    title: 'My New Post',
    content: 'Post content here...',
    published: true,
  });
  
  const authHeaders = createPostApi.makeHeaders({
    'Authorization': 'Bearer token123',
  });
  
  // Convert for Axios
  const axiosConfig = createPostApi.convertResponseType('axios');
  
  // Make request (pseudo-code)
  // const response = await axios.post(
  //   createPostApi.pathShape,
  //   newPost,
  //   { ...axiosConfig, headers: authHeaders }
  // );
}
```

## 🔧 Advanced Usage

### Custom Response Wrappers

```typescript
// Custom wrapper key
const customResponse = v4.makeResponseSuccessShape(userSchema, 'userData');

// Single item
const item = customResponse.item();
// Type: { userData: User }

// List
const list = customResponse.list(z.object({
  meta: z.object({
    page: z.number(),
    total: z.number(),
  }),
}));
// Type: { userData: User[], meta: { page, total } }
```

### OpenAPI Documentation Generation

```typescript
const api = v4.makeApiConfig({
  method: 'GET',
  pathShape: '/users/:id',
  summary: 'Get user',
  description: 'Retrieves user details by ID',
  tags: ['#users'],
  // ...
});

// Get OpenAPI-compatible path
const openApiPath = api.makeOpenAPIPath();
// Returns: "/users/{id}"

// Use in OpenAPI spec generation
const openApiSpec = {
  openapi: '3.0.0',
  paths: {
    [openApiPath]: {
      [api.method.toLowerCase()]: {
        summary: api.summary,
        description: api.description,
        tags: api.tags?.map(t => t.replace('#', '')),
        // ... more OpenAPI fields
      },
    },
  },
};
```

### Middleware Integration

```typescript
import express from 'express';
import { v4 } from 'km-api';

const getUserApi = v4.makeApiConfig({
  // ... configuration
});

const app = express();

// Validation middleware
app.get('/users/:id', async (req, res) => {
  try {
    // Validate params
    const params = getUserApi.request.params.parse(req.params);
    
    // Validate query
    const query = getUserApi.request.query.parse(req.query);
    
    // Your logic here
    const user = await db.users.findById(params.id);
    
    // Validate response
    const response = getUserApi.makeSuccessResponse(user);
    
    res.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorResponse = getUserApi.makeErrorResponse({
        message: 'Validation error',
        errors: error.errors,
      });
      res.status(400).json(errorResponse);
    }
  }
});
```

## 🧪 Testing

```typescript
import { describe, it, expect } from 'vitest';
import { v4 } from 'km-api';
import { z } from 'zod';

describe('User API', () => {
  const getUserApi = v4.makeApiConfig({
    method: 'GET',
    pathShape: '/users/{id}',
    request: {
      params: z.object({ id: z.string() }),
      // ...
    },
    response: {
      success: z.object({ id: z.string(), name: z.string() }),
      error: z.object({ message: z.string() }),
    },
  });

  it('should generate correct path', () => {
    const params = getUserApi.makeParams({ id: '123' });
    const path = getUserApi.makeFullPath(params);
    expect(path).toBe('/users/123');
  });

  it('should validate success response', () => {
    const response = { id: '123', name: 'John' };
    expect(() => getUserApi.response.success.parse(response)).not.toThrow();
  });

  it('should reject invalid response', () => {
    const response = { id: 123, name: 'John' }; // id should be string
    expect(() => getUserApi.response.success.parse(response)).toThrow();
  });
});
```

## 📦 Package Structure

```
km-api/
├── src/
│   ├── index.ts          # Main entry point
│   ├── v4.ts             # API configuration factory
│   ├── schemas.ts        # Zod schemas and types
│   └── adapters.ts       # HTTP client adapters
├── build/
│   ├── esm/              # ES modules
│   ├── cjs/              # CommonJS
│   ├── js/               # JavaScript
│   └── types/            # TypeScript declarations
└── README.md
```

## 🔄 Migration Guide

### From v0.0.x to v0.1.x

1. **Update dependencies:**
   ```bash
   npm install typescript@~5.9.2 zod@^3.25.67
   ```

2. **Property rename:**
   ```typescript
   // Before
   { path: '/users/:id' }
   
   // After
   { pathShape: '/users/:id' }
   ```

3. **Path generation:**
   ```typescript
   // Before
   const orderList = api.makeParamsOrderedList(['id']);
   const path = api.makeFullPath(params, orderList);
   
   // After
   const path = api.makeFullPath(params);
   ```

4. **Removed methods:**
   - `makeParamsOrderedList()` - No replacement needed
   - `makeParamsString()` - No replacement needed
   - `makeFullPathShape()` - Use `makeOpenAPIPath()` instead

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and add tests
4. Run tests: `bun test`
5. Format code: `bun run fix`
6. Commit: `git commit -m 'Add my feature'`
7. Push: `git push origin feature/my-feature`
8. Open a Pull Request

## 📄 License

MIT © [komeilm76](https://github.com/komeilm76)

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/km-api)
- [GitHub Repository](https://github.com/komeilm76/km-api)
- [Issue Tracker](https://github.com/komeilm76/km-api/issues)
- [Zod Documentation](https://zod.dev/)
- [OpenAPI Specification](https://swagger.io/specification/)

## 💬 Support

- 📧 Email: [komeilmohammadi76@gmail.com](mailto:komeilmohammadi76@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/komeilm76/km-api/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/komeilm76/km-api/discussions)

## 🌟 Show Your Support

If you find this package helpful, please give it a ⭐️ on [GitHub](https://github.com/komeilm76/km-api)!

---

Made with ❤️ by [komeilm76](https://github.com/komeilm76)
