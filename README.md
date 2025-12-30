# 🚀 km-api

A powerful TypeScript package that provides **IntelliSense** and **type-safe validation** for APIs, forms, and more using Zod schemas.

## ⚠️ Important Version Notice

> **Version Compatibility Alert:**
>
> - **Version 0.0.7 and below**: Works with TypeScript v4 and Zod v3
> - **Version 0.1.0 and above**: Requires TypeScript v5 and Zod v4
>
> Please ensure you're using the correct versions based on your project requirements!

## 📥 Installation

```bash
npm install km-api
```

## ✨ Features

- 🔒 **Type-safe API configurations** with full IntelliSense support
- ✅ **Automatic validation** using Zod schemas
- 🎯 **Path parameter handling** with type inference
- 📊 **Response shape builders** for consistent API responses
- 🔐 **Authentication support** built-in
- 📝 **Self-documenting** API configurations
- 🛠️ **Helper methods** for common API tasks

## 🎓 Basic Usage

### 1️⃣ Simple API Configuration

```typescript
import kmApi from 'km-api';
import { z } from 'zod';

// Define your API endpoint
const getUserApi = kmApi.makeApiConfig({
  method: 'get',
  path: '/users',
  auth: 'YES',
  responseType: 'json',
  description: 'Get user by ID',
  request: {
    body: z.never(),
    params: z.object({
      id: z.string().uuid(),
    }),
    query: z.object({
      include: z.enum(['profile', 'settings']).optional(),
    }),
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
```

### 2️⃣ Using Helper Methods

```typescript
// Create type-safe parameters
const params = getUserApi.makeParams({ id: '123e4567-e89b-12d3-a456-426614174000' });

// Create type-safe query
const queries = getUserApi.makeQueries({ include: 'profile' });

// Generate full path with parameters
const orderedParams = getUserApi.makeParamsOrderedList(['id']);
const fullPath = getUserApi.makeFullPath(params, orderedParams);
// Result: "/users/123e4567-e89b-12d3-a456-426614174000"

// Get path shape
const pathShape = getUserApi.makeFullPathShape(['id']);
// Result type: "/users/:id"
```

### 3️⃣ Response Handling

```typescript
// Create response shapes
const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

// Single item response
const singleResponse = kmApi.makeResponseSuccessShape(userSchema, 'user').item();
// Type: { user: User }

// List response with pagination
const listResponse = kmApi
  .makeResponseSuccessShape(z.array(userSchema), 'users')
  .list(kmApi.paginationSchema());
// Type: { users: User[], currentPage: number, totalItems: number, itemsPerPage: number }
```

## 🎯 Advanced Examples

### POST Request with Body

```typescript
const createUserApi = kmApi.makeApiConfig({
  method: 'post',
  path: '/users',
  auth: 'YES',
  requestType: 'json_object',
  responseType: 'json',
  description: 'Create a new user',
  request: {
    body: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      age: z.number().min(18),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    success: z.object({
      id: z.string(),
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
      ),
    }),
  },
});

// Use it
const body = createUserApi.makeBody({
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
});
```

### Complex Path with Multiple Parameters

```typescript
const updatePostApi = kmApi.makeApiConfig({
  method: 'put',
  path: '/users',
  auth: 'YES',
  description: 'Update a specific post for a user',
  request: {
    body: z.object({
      title: z.string(),
      content: z.string(),
    }),
    params: z.object({
      userId: z.string().uuid(),
      postId: z.string().uuid(),
    }),
    query: z.object({}),
  },
  response: {
    success: z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      updatedAt: z.string(),
    }),
    error: z.object({
      message: z.string(),
    }),
  },
});

// Generate path
const params = updatePostApi.makeParams({
  userId: 'user-123',
  postId: 'post-456',
});

const orderedList = updatePostApi.makeParamsOrderedList(['userId', 'postId']);
const path = updatePostApi.makeFullPath(params, orderedList);
// Result: "/users/user-123/post-456"
```

### Paginated List Response

```typescript
const getProductsApi = kmApi.makeApiConfig({
  method: 'get',
  path: '/products',
  auth: 'NO',
  description: 'Get paginated list of products',
  request: {
    body: z.never(),
    params: z.object({}),
    query: z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(20),
      category: z.string().optional(),
    }),
  },
  response: {
    success: kmApi
      .makeResponseSuccessShape(
        z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            price: z.number(),
            category: z.string(),
          })
        ),
        'products'
      )
      .list(kmApi.paginationSchema()),
    error: z.object({
      message: z.string(),
    }),
  },
});
```

### Disabled Endpoint

```typescript
const deprecatedApi = kmApi.makeApiConfig({
  method: 'get',
  path: '/old-endpoint',
  auth: 'NO',
  disable: 'YES', // Temporarily disable this endpoint
  description: 'This endpoint is deprecated',
  request: {
    body: z.never(),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    success: z.object({}),
    error: z.object({}),
  },
});
```

## 🏗️ API Configuration Options

| Option             | Type                                                                     | Required | Description                  |
| ------------------ | ------------------------------------------------------------------------ | -------- | ---------------------------- |
| `method`           | `'get' \| 'post' \| 'put' \| 'delete' \| 'head' \| 'options' \| 'patch'` | ✅ Yes   | HTTP method                  |
| `path`             | `string` (starts with `/`)                                               | ✅ Yes   | API endpoint path            |
| `auth`             | `'YES' \| 'NO'`                                                          | ❌ No    | Authentication requirement   |
| `responseType`     | `'json' \| 'text' \| 'blob' \| ...`                                      | ❌ No    | Expected response format     |
| `requestType`      | `'json_object' \| 'form_data' \| ...`                                    | ❌ No    | Request body format          |
| `disable`          | `'YES' \| 'NO'`                                                          | ❌ No    | Temporarily disable endpoint |
| `description`      | `string`                                                                 | ❌ No    | Endpoint documentation       |
| `request.body`     | `ZodType`                                                                | ✅ Yes   | Request body schema          |
| `request.params`   | `ZodObject`                                                              | ✅ Yes   | URL parameters schema        |
| `request.query`    | `ZodObject`                                                              | ✅ Yes   | Query parameters schema      |
| `response.success` | `ZodType`                                                                | ✅ Yes   | Success response schema      |
| `response.error`   | `ZodType`                                                                | ✅ Yes   | Error response schema        |

## 📚 Helper Methods

- `makeBody(body)` - Create type-safe request body
- `makeParams(params)` - Create type-safe URL parameters
- `makeQueries(queries)` - Create type-safe query parameters
- `makeSuccessResponse(data)` - Create type-safe success response
- `makeErrorResponse(data)` - Create type-safe error response
- `makeParamsOrderedList(['key1', 'key2'])` - Define parameter order
- `makeParamsStringShape(['key1', 'key2'])` - Generate path shape template
- `makeParamsString(params, orderList)` - Generate parameter string
- `makeFullPathShape(['key1'])` - Get full path with parameter placeholders
- `makeFullPath(params, orderList)` - Generate complete URL path

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT

## 👨‍💻 Author

Created with "komeilm76" for better TypeScript API development

---

## 📦 Download

**[Download km-api Package](https://www.npmjs.com/package/km-api)**

Or install directly:

```bash
npm install km-api
```

---

**Need help?** Open an issue on [GitHub](https://github.com/komeilm76/km-api) or check the examples above!

🌟 If you find this package helpful, please give it a star!
