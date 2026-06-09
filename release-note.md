## What's changed

### Renamed helper
`makeOpenAPIPath()` has been renamed to `makeOpenApiPathShape()` for consistent naming across the API.

```ts
// before (v0.3.0)
config.makeOpenAPIPath();

// after (v0.3.1)
config.makeOpenApiPathShape();
```

### New helper — `makeExpressPathShape()`
Converts any path to Express `:param` format. Useful when you define paths in OpenAPI style but need to register them with an Express router.

```ts
// pathShape: '/users/{id}/posts/{postId}'
config.makeExpressPathShape(); // '/users/:id/posts/:postId'

// already Express-style — returned unchanged
// pathShape: '/users/:id'
config.makeExpressPathShape(); // '/users/:id'
```

### Migration

| Before (v0.3.0) | After (v0.3.1) |
|---|---|
| `config.makeOpenAPIPath()` | `config.makeOpenApiPathShape()` |
| — | `config.makeExpressPathShape()` *(new)* |

All other APIs are unchanged.
