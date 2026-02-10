import z, { ZodObject, ZodType } from 'zod';

/**
 * OpenAPI/Swagger Schema Definitions
 * 
 * This module provides Zod schemas and TypeScript types for building
 * type-safe API configurations compatible with OpenAPI 3.0 and Swagger 2.0.
 * 
 * All schemas follow OpenAPI specifications:
 * - OpenAPI 3.0: https://swagger.io/specification/
 * - Swagger 2.0: https://swagger.io/docs/specification/2-0/
 */

// ==========================================
// CONTENT TYPE SCHEMAS
// ==========================================

/**
 * Response Content Type Schema
 * 
 * Defines valid MIME types for API responses based on OpenAPI/Swagger
 * Media Type specifications. These content types indicate the format
 * of data returned by API endpoints.
 * 
 * Categories:
 * - Application types: JSON, XML, PDF, ZIP, binary, etc.
 * - Microsoft Office formats: Excel, Word, PowerPoint
 * - Text types: Plain text, HTML, CSS, JavaScript, CSV, etc.
 * - Image types: PNG, JPEG, GIF, WebP, SVG, etc.
 * - Audio types: MP3, OGG, WAV, WebM, etc.
 * - Video types: MP4, MPEG, WebM, QuickTime, etc.
 * - Vendor-specific: GitHub API, OpenStreetMap, etc.
 *
 * @reference https://swagger.io/specification/#media-type-object
 *
 * @example
 * ```typescript
 * import { responseContentTypeSchema } from './schemas';
 *
 * // Validate response content type
 * const contentType = responseContentTypeSchema.parse('application/json');
 *
 * // Use in API config
 * const config = {
 *   responseContentType: 'application/json' as const,
 *   // ... other config
 * };
 *
 * // Type-safe options
 * const pdfType: IResponseContentType = 'application/pdf';
 * const imageType: IResponseContentType = 'image/png';
 * ```
 */
const responseContentTypeSchema = z.enum([
  // ========== APPLICATION TYPES ==========
  // swagger_&_openapi_supported - Standard JSON response
  'application/json',
  // swagger_&_openapi_supported - XML response
  'application/xml',
  // swagger_&_openapi_supported - Binary/file download
  'application/octet-stream',
  // swagger_&_openapi_supported - PDF documents
  'application/pdf',
  // swagger_&_openapi_supported - ZIP archives
  'application/zip',
  // openapi_supported - GZIP compressed data
  'application/gzip',
  // openapi_supported - Form responses (rare but valid)
  'application/x-www-form-urlencoded',
  // openapi_supported - Multipart responses
  'multipart/form-data',
  // openapi_supported - JSON Patch format (RFC 6902)
  'application/json-patch+json',
  // openapi_supported - JSON Merge Patch (RFC 7386)
  'application/merge-patch+json',
  // openapi_supported - JSON:API specification
  'application/vnd.api+json',
  // openapi_supported - JSON-LD (Linked Data)
  'application/ld+json',
  // openapi_supported - Newline-delimited JSON (streaming)
  'application/x-ndjson',
  // openapi_supported - Protocol Buffers
  'application/x-protobuf',
  // openapi_supported - MessagePack binary format
  'application/msgpack',

  // ========== MICROSOFT OFFICE FORMATS ==========
  // swagger_&_openapi_supported - Excel (legacy)
  'application/vnd.ms-excel',
  // swagger_&_openapi_supported - Excel (modern .xlsx)
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  // swagger_&_openapi_supported - PowerPoint (legacy)
  'application/vnd.ms-powerpoint',
  // swagger_&_openapi_supported - PowerPoint (modern .pptx)
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // swagger_&_openapi_supported - Word (legacy)
  'application/msword',
  // swagger_&_openapi_supported - Word (modern .docx)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // ========== TEXT TYPES ==========
  // swagger_&_openapi_supported - Plain text
  'text/plain',
  // swagger_&_openapi_supported - HTML content
  'text/html',
  // swagger_&_openapi_supported - CSS stylesheets
  'text/css',
  // swagger_&_openapi_supported - JavaScript code
  'text/javascript',
  // swagger_&_openapi_supported - CSV data
  'text/csv',
  // swagger_&_openapi_supported - XML as text
  'text/xml',
  // openapi_supported - Markdown content
  'text/markdown',
  // openapi_supported - YAML content
  'text/yaml',

  // ========== IMAGE TYPES ==========
  // swagger_&_openapi_supported - PNG images
  'image/png',
  // swagger_&_openapi_supported - JPEG images
  'image/jpeg',
  // swagger_&_openapi_supported - GIF images
  'image/gif',
  // swagger_&_openapi_supported - WebP images
  'image/webp',
  // swagger_&_openapi_supported - SVG vector graphics
  'image/svg+xml',
  // swagger_&_openapi_supported - BMP images
  'image/bmp',
  // swagger_&_openapi_supported - TIFF images
  'image/tiff',
  // openapi_supported - ICO favicons
  'image/x-icon',
  // openapi_supported - AVIF images
  'image/avif',
  // openapi_supported - DjVu documents
  'image/vnd.djvu',

  // ========== AUDIO TYPES ==========
  // swagger_&_openapi_supported - MP3 audio
  'audio/mpeg',
  // swagger_&_openapi_supported - OGG audio
  'audio/ogg',
  // swagger_&_openapi_supported - WAV audio
  'audio/wav',
  // swagger_&_openapi_supported - WebM audio
  'audio/webm',
  // openapi_supported - AAC audio
  'audio/aac',
  // openapi_supported - FLAC audio
  'audio/flac',

  // ========== VIDEO TYPES ==========
  // swagger_&_openapi_supported - MP4 video
  'video/mp4',
  // swagger_&_openapi_supported - MPEG video
  'video/mpeg',
  // swagger_&_openapi_supported - OGG video
  'video/ogg',
  // swagger_&_openapi_supported - WebM video
  'video/webm',
  // openapi_supported - QuickTime video
  'video/quicktime',
  // openapi_supported - AVI video
  'video/x-msvideo',

  // ========== VENDOR-SPECIFIC TYPES ==========
  // openapi_supported - GitHub API v3
  'application/vnd.github+json',
  'application/vnd.github.v3+json',
  // openapi_supported - GitHub diffs
  'application/vnd.github.v3.diff',
  // openapi_supported - GitHub patches
  'application/vnd.github.v3.patch',
  // openapi_supported - OpenStreetMap data
  'application/vnd.openstreetmap.data+xml',
] as const);

/**
 * Response Content Type
 * 
 * TypeScript type for valid response content types.
 * Extracted from responseContentTypeSchema.
 *
 * @example
 * ```typescript
 * const jsonType: IResponseContentType = 'application/json';
 * const pdfType: IResponseContentType = 'application/pdf';
 * 
 * function handleResponse(contentType: IResponseContentType) {
 *   if (contentType === 'application/json') {
 *     // Handle JSON
 *   } else if (contentType === 'application/pdf') {
 *     // Handle PDF
 *   }
 * }
 * ```
 */
type IResponseContentType = z.infer<typeof responseContentTypeSchema>;

/**
 * Request Content Type Schema
 * 
 * Defines valid MIME types for API request bodies based on OpenAPI/Swagger
 * Request Body specifications. These content types indicate the format
 * of data sent to API endpoints.
 * 
 * Categories:
 * - Application types: JSON, XML, form data, binary uploads
 * - Text types: Plain text, HTML, CSV, Markdown, YAML
 * - File uploads: Images, audio, video
 * - Vendor-specific: GitHub API, GraphQL
 *
 * @reference https://swagger.io/specification/#request-body-object
 *
 * @example
 * ```typescript
 * import { requestContentTypeSchema } from './schemas';
 *
 * // Validate request content type
 * const contentType = requestContentTypeSchema.parse('application/json');
 *
 * // Use in API config for JSON requests
 * const createUserConfig = {
 *   requestContentType: 'application/json' as const,
 *   // ... other config
 * };
 *
 * // Use for file uploads
 * const uploadConfig = {
 *   requestContentType: 'multipart/form-data' as const,
 *   // ... other config
 * };
 * ```
 */
const requestContentTypeSchema = z.enum([
  // ========== APPLICATION TYPES ==========
  // swagger_&_openapi_supported - JSON request body
  'application/json',
  // swagger_&_openapi_supported - XML request body
  'application/xml',
  // swagger_&_openapi_supported - URL-encoded form data
  'application/x-www-form-urlencoded',
  // swagger_&_openapi_supported - Multipart file upload
  'multipart/form-data',
  // swagger_&_openapi_supported - Binary data upload
  'application/octet-stream',
  // openapi_supported - PDF upload
  'application/pdf',
  // openapi_supported - ZIP upload
  'application/zip',
  // openapi_supported - GZIP upload
  'application/gzip',
  // openapi_supported - JSON Patch operations
  'application/json-patch+json',
  // openapi_supported - JSON Merge Patch operations
  'application/merge-patch+json',
  // openapi_supported - JSON:API specification
  'application/vnd.api+json',
  // openapi_supported - JSON-LD requests
  'application/ld+json',
  // openapi_supported - Protocol Buffers
  'application/x-protobuf',
  // openapi_supported - MessagePack
  'application/msgpack',
  // openapi_supported - GraphQL queries
  'application/graphql',

  // ========== TEXT TYPES ==========
  // swagger_&_openapi_supported - Plain text body
  'text/plain',
  // swagger_&_openapi_supported - HTML body
  'text/html',
  // swagger_&_openapi_supported - XML as text
  'text/xml',
  // openapi_supported - CSV upload
  'text/csv',
  // openapi_supported - Markdown content
  'text/markdown',
  // openapi_supported - YAML content
  'text/yaml',

  // ========== IMAGE TYPES (FILE UPLOADS) ==========
  // swagger_&_openapi_supported - PNG upload
  'image/png',
  // swagger_&_openapi_supported - JPEG upload
  'image/jpeg',
  // swagger_&_openapi_supported - GIF upload
  'image/gif',
  // swagger_&_openapi_supported - WebP upload
  'image/webp',
  // swagger_&_openapi_supported - SVG upload
  'image/svg+xml',

  // ========== AUDIO TYPES (FILE UPLOADS) ==========
  // swagger_&_openapi_supported - MP3 upload
  'audio/mpeg',
  // swagger_&_openapi_supported - WAV upload
  'audio/wav',
  // swagger_&_openapi_supported - OGG upload
  'audio/ogg',

  // ========== VIDEO TYPES (FILE UPLOADS) ==========
  // swagger_&_openapi_supported - MP4 upload
  'video/mp4',
  // swagger_&_openapi_supported - MPEG upload
  'video/mpeg',
  // swagger_&_openapi_supported - WebM upload
  'video/webm',

  // ========== VENDOR-SPECIFIC TYPES ==========
  // openapi_supported - GitHub API requests
  'application/vnd.github+json',
] as const);

/**
 * Request Content Type
 * 
 * TypeScript type for valid request content types.
 * Extracted from requestContentTypeSchema.
 *
 * @example
 * ```typescript
 * const jsonType: IRequestContentType = 'application/json';
 * const formType: IRequestContentType = 'multipart/form-data';
 * 
 * function prepareRequest(contentType: IRequestContentType, data: any) {
 *   if (contentType === 'application/json') {
 *     return JSON.stringify(data);
 *   } else if (contentType === 'multipart/form-data') {
 *     const formData = new FormData();
 *     // ... add data to formData
 *     return formData;
 *   }
 * }
 * ```
 */
type IRequestContentType = z.infer<typeof requestContentTypeSchema>;

// ==========================================
// HTTP METHOD SCHEMA
// ==========================================

/**
 * HTTP Method Schema
 * 
 * Defines valid HTTP methods for API operations based on OpenAPI 3.0
 * and Swagger 2.0 specifications. Supports multiple case variations
 * (lowercase, UPPERCASE, Capitalized) for flexibility.
 * 
 * Supported methods:
 * - GET: Retrieve resources
 * - POST: Create resources
 * - PUT: Update/replace resources
 * - DELETE: Remove resources
 * - PATCH: Partial update resources
 * - HEAD: Get headers only
 * - OPTIONS: Get allowed methods
 *
 * @reference https://swagger.io/specification/#operation-object
 *
 * @example
 * ```typescript
 * import { methodSchema } from './schemas';
 *
 * // Validate HTTP method
 * const method1 = methodSchema.parse('GET');
 * const method2 = methodSchema.parse('post');
 * const method3 = methodSchema.parse('Put');
 *
 * // Use in API config
 * const getUserConfig = {
 *   method: 'GET' as const,
 *   // ... other config
 * };
 *
 * const createUserConfig = {
 *   method: 'POST' as const,
 *   // ... other config
 * };
 * ```
 */
const methodSchema = z.enum([
  'get',
  'GET',
  'Get',
  'post',
  'POST',
  'Post',
  'put',
  'PUT',
  'Put',
  'delete',
  'DELETE',
  'Delete',
  'head',
  'HEAD',
  'Head',
  'options',
  'OPTIONS',
  'Options',
  'patch',
  'PATCH',
  'Patch',
] as const);

/**
 * HTTP Method Type
 * 
 * TypeScript type for valid HTTP methods with case variations.
 * Extracted from methodSchema.
 *
 * @example
 * ```typescript
 * const getMethod: IMethod = 'GET';
 * const postMethod: IMethod = 'post';
 * const patchMethod: IMethod = 'Patch';
 * 
 * function makeRequest(method: IMethod, url: string) {
 *   fetch(url, { method: method.toUpperCase() });
 * }
 * ```
 */
type IMethod = z.infer<typeof methodSchema>;

// ==========================================
// STATUS SCHEMAS
// ==========================================

/**
 * Authentication Status Schema
 * 
 * Indicates whether an API endpoint requires authentication.
 * Simplified boolean indicator based on OpenAPI security schemes.
 * 
 * In OpenAPI, actual authentication details are defined in:
 * - Security Schemes (apiKey, http, oauth2, openIdConnect)
 * - Security Requirements at operation level
 * 
 * This schema provides a simple YES/NO flag for basic auth requirement.
 *
 * @reference https://swagger.io/specification/#security-scheme-object
 *
 * @example
 * ```typescript
 * import { authStatusSchema } from './schemas';
 *
 * // Public endpoint (no auth required)
 * const publicConfig = {
 *   auth: 'NO' as const,
 *   // ... other config
 * };
 *
 * // Protected endpoint (auth required)
 * const protectedConfig = {
 *   auth: 'YES' as const,
 *   // ... other config
 * };
 * ```
 */
const authStatusSchema = z.enum(['YES', 'NO'] as const);

/**
 * Authentication Status Type
 * 
 * TypeScript type for authentication requirement status.
 * Extracted from authStatusSchema.
 *
 * @example
 * ```typescript
 * const requiresAuth: IAuthStatus = 'YES';
 * const publicEndpoint: IAuthStatus = 'NO';
 * 
 * function checkAuth(status: IAuthStatus) {
 *   if (status === 'YES') {
 *     // Verify authentication token
 *   }
 * }
 * ```
 */
type IAuthStatus = z.infer<typeof authStatusSchema>;

/**
 * Disable Status Schema
 * 
 * Custom extension for marking endpoints as disabled or deprecated.
 * Not part of the official OpenAPI specification, but useful for
 * internal API management and gradual deprecation.
 *
 * @example
 * ```typescript
 * import { disableStatusSchema } from './schemas';
 *
 * // Active endpoint
 * const activeConfig = {
 *   disable: 'NO' as const,
 *   // ... other config
 * };
 *
 * // Disabled/deprecated endpoint
 * const deprecatedConfig = {
 *   disable: 'YES' as const,
 *   description: 'This endpoint is deprecated. Use /v2/users instead.',
 *   // ... other config
 * };
 * ```
 */
const disableStatusSchema = z.enum(['YES', 'NO'] as const);

/**
 * Disable Status Type
 * 
 * TypeScript type for endpoint disable status.
 * Extracted from disableStatusSchema.
 *
 * @example
 * ```typescript
 * const enabled: IDisableStatus = 'NO';
 * const disabled: IDisableStatus = 'YES';
 * 
 * function isEndpointActive(status: IDisableStatus) {
 *   return status === 'NO';
 * }
 * ```
 */
type IDisableStatus = z.infer<typeof disableStatusSchema>;

// ==========================================
// PATH AND DOCUMENTATION SCHEMAS
// ==========================================

/**
 * Path Schema
 * 
 * Validates API endpoint paths according to OpenAPI specifications.
 * All paths must start with a forward slash (/).
 * 
 * Can include path parameters in two formats:
 * - Express-style: /users/:id/posts/:postId
 * - OpenAPI-style: /users/{id}/posts/{postId}
 *
 * @reference https://swagger.io/specification/#paths-object
 *
 * @example
 * ```typescript
 * import { pathSchema } from './schemas';
 *
 * // Valid paths
 * const path1 = pathSchema.parse('/users');
 * const path2 = pathSchema.parse('/users/{id}');
 * const path3 = pathSchema.parse('/admin/posts/:postId/comments');
 *
 * // Invalid paths (will throw)
 * // pathSchema.parse('users'); // Missing leading /
 * // pathSchema.parse(''); // Empty string
 * ```
 */
const pathSchema = z.string().startsWith('/');

/**
 * Path Type
 * 
 * TypeScript type for API endpoint paths.
 * Extracted from pathSchema.
 *
 * @example
 * ```typescript
 * const userPath: IPath = '/users/{id}';
 * const postPath: IPath = '/posts/:postId/comments';
 * 
 * function buildUrl(path: IPath, params: Record<string, string>) {
 *   let url = path;
 *   Object.entries(params).forEach(([key, value]) => {
 *     url = url.replace(`{${key}}`, value).replace(`:${key}`, value);
 *   });
 *   return url;
 * }
 * ```
 */
type IPath = z.infer<typeof pathSchema>;

/**
 * Tags Schema
 * 
 * Defines tags for grouping and categorizing API operations in
 * OpenAPI documentation. Tags help organize endpoints by feature,
 * resource type, or functional area.
 * 
 * Custom format: tags start with # (not OpenAPI standard, but
 * common practice for grouping).
 *
 * @reference https://swagger.io/specification/#operation-object
 *
 * @example
 * ```typescript
 * import { tagsSchema } from './schemas';
 *
 * // Single tag
 * const userTags = tagsSchema.parse(['#users']);
 *
 * // Multiple tags
 * const adminTags = tagsSchema.parse(['#admin', '#users', '#management']);
 *
 * // Use in API config
 * const config = {
 *   tags: ['#users', '#authentication'],
 *   // ... other config
 * };
 * ```
 */
const tagsSchema = z.string().startsWith('#').array();

/**
 * Tags Type
 * 
 * TypeScript type for API operation tags.
 * Extracted from tagsSchema.
 *
 * @example
 * ```typescript
 * const userTags: ITags = ['#users'];
 * const adminTags: ITags = ['#admin', '#users'];
 * 
 * function filterByTag(endpoints: any[], tag: string) {
 *   return endpoints.filter(e => e.tags?.includes(tag));
 * }
 * ```
 */
type ITags = z.infer<typeof tagsSchema>;

/**
 * Description Schema
 * 
 * Detailed description of an API operation. Used in OpenAPI
 * documentation to provide comprehensive information about
 * what the endpoint does, edge cases, and usage notes.
 *
 * @reference https://swagger.io/specification/#operation-object
 *
 * @example
 * ```typescript
 * import { descriptionSchema } from './schemas';
 *
 * const description = descriptionSchema.parse(`
 *   Retrieves a user by ID. Returns 404 if the user does not exist.
 *   Requires authentication token in the Authorization header.
 *   Rate limited to 100 requests per minute.
 * `);
 *
 * // Use in API config
 * const config = {
 *   description: 'Creates a new user account with the provided details',
 *   // ... other config
 * };
 * ```
 */
const descriptionSchema = z.string();

/**
 * Description Type
 * 
 * TypeScript type for API operation descriptions.
 * Extracted from descriptionSchema.
 *
 * @example
 * ```typescript
 * const desc: IDescription = 'Retrieves user profile information';
 * 
 * function generateDocs(summary: string, description: IDescription) {
 *   return `${summary}\n\n${description}`;
 * }
 * ```
 */
type IDescription = z.infer<typeof descriptionSchema>;

/**
 * Summary Schema
 * 
 * Short summary of an API operation (typically 1-2 sentences).
 * Used in OpenAPI documentation as a brief description that
 * appears in API documentation tools and lists.
 *
 * @reference https://swagger.io/specification/#operation-object
 *
 * @example
 * ```typescript
 * import { summarySchema } from './schemas';
 *
 * const summary = summarySchema.parse('Get user by ID');
 *
 * // Use in API config
 * const config = {
 *   summary: 'Create a new user',
 *   description: 'Creates a new user account with validation...',
 *   // ... other config
 * };
 * ```
 */
const summarySchema = z.string();

/**
 * Summary Type
 * 
 * TypeScript type for API operation summaries.
 * Extracted from summarySchema.
 *
 * @example
 * ```typescript
 * const summary: ISummary = 'List all users';
 * 
 * function createMenuItem(summary: ISummary, path: string) {
 *   return { label: summary, href: path };
 * }
 * ```
 */
type ISummary = z.infer<typeof summarySchema>;

// ==========================================
// REQUEST/RESPONSE PARAMETER SCHEMAS
// ==========================================

/**
 * Body Schema
 * 
 * Validates that request body is defined using a Zod schema.
 * The body schema defines the structure and validation rules
 * for data sent in the request body.
 *
 * Maps to OpenAPI requestBody schema.
 *
 * @reference https://swagger.io/specification/#request-body-object
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { bodySchema } from './schemas';
 *
 * // Define request body schema
 * const createUserBody = z.object({
 *   name: z.string().min(1),
 *   email: z.string().email(),
 *   age: z.number().int().min(18).optional()
 * });
 *
 * // Validate it's a proper body schema
 * bodySchema.parse(createUserBody); // ✓ Valid
 *
 * // Use in API config
 * const config = {
 *   request: {
 *     body: createUserBody,
 *     // ... other request fields
 *   },
 *   // ... other config
 * };
 * ```
 */
const bodySchema = z.instanceof(ZodType);

/**
 * Body Type
 * 
 * TypeScript type for request body schemas.
 * Extracted from bodySchema.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * 
 * const userBodySchema: IBody = z.object({
 *   name: z.string(),
 *   email: z.string()
 * });
 * ```
 */
type IBody = z.infer<typeof bodySchema>;

/**
 * Params Schema
 * 
 * Validates that path parameters are defined using a Zod object schema.
 * Path parameters are variables in the URL path (e.g., {id}, :userId).
 *
 * Maps to OpenAPI path parameters.
 *
 * @reference https://swagger.io/specification/#parameter-object (in: path)
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { paramsSchema } from './schemas';
 *
 * // Define path parameters schema
 * const userParams = z.object({
 *   id: z.string().uuid(),
 *   postId: z.string()
 * });
 *
 * // Validate it's a proper params schema
 * paramsSchema.parse(userParams); // ✓ Valid
 *
 * // Use in API config for /users/{id}/posts/{postId}
 * const config = {
 *   pathShape: '/users/{id}/posts/{postId}',
 *   request: {
 *     params: userParams,
 *     // ... other request fields
 *   },
 *   // ... other config
 * };
 * ```
 */
const paramsSchema = z.instanceof(ZodObject);

/**
 * Params Type
 * 
 * TypeScript type for path parameter schemas.
 * Extracted from paramsSchema.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * 
 * const pathParams: IParams = z.object({
 *   userId: z.string(),
 *   postId: z.string()
 * });
 * ```
 */
type IParams = z.infer<typeof paramsSchema>;

/**
 * Query Schema
 * 
 * Validates that query parameters are defined using a Zod object schema.
 * Query parameters appear after ? in URLs (e.g., ?page=1&limit=10).
 *
 * Maps to OpenAPI query parameters.
 *
 * @reference https://swagger.io/specification/#parameter-object (in: query)
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { querySchema } from './schemas';
 *
 * // Define query parameters schema
 * const listUsersQuery = z.object({
 *   page: z.number().int().min(1).default(1),
 *   limit: z.number().int().min(1).max(100).default(20),
 *   search: z.string().optional(),
 *   sortBy: z.enum(['name', 'email', 'createdAt']).optional()
 * });
 *
 * // Validate it's a proper query schema
 * querySchema.parse(listUsersQuery); // ✓ Valid
 *
 * // Use in API config for /users?page=1&limit=20
 * const config = {
 *   request: {
 *     query: listUsersQuery,
 *     // ... other request fields
 *   },
 *   // ... other config
 * };
 * ```
 */
const querySchema = z.instanceof(ZodObject);

/**
 * Query Type
 * 
 * TypeScript type for query parameter schemas.
 * Extracted from querySchema.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * 
 * const searchQuery: IQuery = z.object({
 *   q: z.string(),
 *   page: z.number()
 * });
 * ```
 */
type IQuery = z.infer<typeof querySchema>;

/**
 * Headers Schema
 * 
 * Validates that custom headers are defined using a Zod object schema.
 * Custom headers can be required by the API (excluding standard headers
 * like Authorization, Content-Type which are handled separately).
 *
 * Maps to OpenAPI header parameters.
 *
 * @reference https://swagger.io/specification/#parameter-object (in: header)
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { headersSchema } from './schemas';
 *
 * // Define custom headers schema
 * const uploadHeaders = z.object({
 *   'X-Upload-Token': z.string(),
 *   'X-File-Size': z.number().int().positive(),
 *   'X-Checksum': z.string().optional()
 * });
 *
 * // Validate it's a proper headers schema
 * headersSchema.parse(uploadHeaders); // ✓ Valid
 *
 * // Use in API config
 * const config = {
 *   request: {
 *     headers: uploadHeaders,
 *     // ... other request fields
 *   },
 *   // ... other config
 * };
 * ```
 */
const headersSchema = z.instanceof(ZodObject);

/**
 * Headers Type
 * 
 * TypeScript type for custom header schemas.
 * Extracted from headersSchema.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * 
 * const customHeaders: IHeaders = z.object({
 *   'X-API-Key': z.string(),
 *   'X-Request-ID': z.string()
 * });
 * ```
 */
type IHeaders = z.infer<typeof headersSchema>;

/**
 * Cookies Schema
 * 
 * Validates that cookie parameters are defined using a Zod object schema.
 * Cookie parameters are sent via the Cookie header.
 * 
 * Note: Cookie parameters are supported in OpenAPI 3.0 but NOT in Swagger 2.0.
 *
 * Maps to OpenAPI cookie parameters.
 *
 * @reference https://swagger.io/specification/#parameter-object (in: cookie)
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { cookiesSchema } from './schemas';
 *
 * // Define cookies schema
 * const authCookies = z.object({
 *   sessionId: z.string().uuid(),
 *   preferences: z.string().optional(),
 *   csrfToken: z.string()
 * });
 *
 * // Validate it's a proper cookies schema
 * cookiesSchema.parse(authCookies); // ✓ Valid
 *
 * // Use in API config
 * const config = {
 *   request: {
 *     cookies: authCookies,
 *     // ... other request fields
 *   },
 *   // ... other config
 * };
 * ```
 */
const cookiesSchema = z.instanceof(ZodObject);

/**
 * Cookies Type
 * 
 * TypeScript type for cookie parameter schemas.
 * Extracted from cookiesSchema.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * 
 * const sessionCookies: ICookies = z.object({
 *   sessionId: z.string(),
 *   token: z.string()
 * });
 * ```
 */
type ICookies = z.infer<typeof cookiesSchema>;

/**
 * Response Success Schema
 * 
 * Validates that successful response data (2xx status codes) is defined
 * using a Zod schema. This defines the structure of data returned when
 * the API call succeeds.
 *
 * Maps to OpenAPI response schema for 2xx status codes.
 *
 * @reference https://swagger.io/specification/#response-object
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { responseSuccessSchema } from './schemas';
 *
 * // Define success response schema
 * const userResponse = z.object({
 *   id: z.string().uuid(),
 *   name: z.string(),
 *   email: z.string().email(),
 *   createdAt: z.string().datetime()
 * });
 *
 * // Validate it's a proper success schema
 * responseSuccessSchema.parse(userResponse); // ✓ Valid
 *
 * // Use in API config
 * const config = {
 *   response: {
 *     success: userResponse,
 *     error: errorSchema
 *   },
 *   // ... other config
 * };
 * ```
 */
const responseSuccessSchema = z.instanceof(ZodType);

/**
 * Response Success Data Type
 * 
 * TypeScript type for success response schemas.
 * Extracted from responseSuccessSchema.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * 
 * const successSchema: IResponseSuccessData = z.object({
 *   data: z.any(),
 *   message: z.string()
 * });
 * ```
 */
type IResponseSuccessData = z.infer<typeof responseSuccessSchema>;

/**
 * Response Error Schema
 * 
 * Validates that error response data (4xx/5xx status codes) is defined
 * using a Zod schema. This defines the structure of data returned when
 * the API call fails.
 *
 * Maps to OpenAPI response schema for 4xx/5xx status codes.
 *
 * @reference https://swagger.io/specification/#response-object
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { responseErrorSchema } from './schemas';
 *
 * // Define error response schema
 * const apiError = z.object({
 *   code: z.number().int(),
 *   message: z.string(),
 *   details: z.array(z.string()).optional(),
 *   timestamp: z.string().datetime()
 * });
 *
 * // Validate it's a proper error schema
 * responseErrorSchema.parse(apiError); // ✓ Valid
 *
 * // Use in API config
 * const config = {
 *   response: {
 *     success: successSchema,
 *     error: apiError
 *   },
 *   // ... other config
 * };
 * ```
 */
const responseErrorSchema = z.instanceof(ZodType);

/**
 * Response Error Data Type
 * 
 * TypeScript type for error response schemas.
 * Extracted from responseErrorSchema.
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * 
 * const errorSchema: IResponseErrorData = z.object({
 *   error: z.string(),
 *   code: z.number()
 * });
 * ```
 */
type IResponseErrorData = z.infer<typeof responseErrorSchema>;

// ==========================================
// COMPLETE API CONFIGURATION TYPE
// ==========================================

/**
 * API Configuration Entry Type
 * 
 * Complete type definition for a single API endpoint configuration.
 * Maps to OpenAPI Operation Object and includes all necessary fields
 * for defining a fully documented, type-safe API endpoint.
 * 
 * This type combines:
 * - HTTP method and path
 * - Request parameters (body, path params, query, headers, cookies)
 * - Response schemas (success and error)
 * - Metadata (tags, summary, description)
 * - Configuration flags (auth, disable)
 * - Content types (request and response)
 *
 * @template METHOD - HTTP method type
 * @template PATH - API path type
 * @template TAGS - Tags array type
 * @template AUTH - Authentication status type
 * @template RESPONSE_CONTENT_TYPE - Response MIME type
 * @template REQUEST_CONTENT_TYPE - Request MIME type
 * @template DISABLE - Disable status type
 * @template SUMMARY - Summary string type
 * @template DESCRIPTION - Description string type
 * @template BODY - Request body schema type
 * @template PARAMS - Path parameters schema type
 * @template QUERY - Query parameters schema type
 * @template HEADERS - Headers schema type
 * @template COOKIES - Cookies schema type
 * @template RESPONSE_SUCCESS_DATA - Success response schema type
 * @template RESPONSE_ERROR_DATA - Error response schema type
 *
 * @reference https://swagger.io/specification/#operation-object
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import type { IMakeApiConfigEntry } from './schemas';
 *
 * // Define a complete API endpoint configuration
 * const getUserEndpoint: IMakeApiConfigEntry = {
 *   method: 'GET',
 *   pathShape: '/users/{id}',
 *   tags: ['#users'],
 *   auth: 'YES',
 *   responseContentType: 'application/json',
 *   requestContentType: 'application/json',
 *   disable: 'NO',
 *   summary: 'Get user by ID',
 *   description: 'Retrieves a single user by their unique identifier',
 *   request: {
 *     body: z.any(),
 *     params: z.object({ id: z.string().uuid() }),
 *     query: z.object({}),
 *     headers: z.object({}),
 *     cookies: z.object({})
 *   },
 *   response: {
 *     success: z.object({
 *       id: z.string(),
 *       name: z.string(),
 *       email: z.string()
 *     }),
 *     error: z.object({
 *       code: z.number(),
 *       message: z.string()
 *     })
 *   }
 * };
 * ```
 */
type IMakeApiConfigEntry<
  METHOD extends IMethod = IMethod,
  PATH extends IPath = IPath,
  TAGS extends ITags = ITags,
  AUTH extends IAuthStatus = IAuthStatus,
  RESPONSE_CONTENT_TYPE extends IResponseContentType = IResponseContentType,
  REQUEST_CONTENT_TYPE extends IRequestContentType = IRequestContentType,
  DISABLE extends IDisableStatus = IDisableStatus,
  SUMMARY extends ISummary = ISummary,
  DESCRIPTION extends IDescription = IDescription,
  BODY extends IBody = IBody,
  PARAMS extends IParams = IParams,
  QUERY extends IQuery = IQuery,
  HEADERS extends IHeaders = IHeaders,
  COOKIES extends ICookies = ICookies,
  RESPONSE_SUCCESS_DATA extends IResponseSuccessData = IResponseSuccessData,
  RESPONSE_ERROR_DATA extends IResponseErrorData = IResponseErrorData
> = {
  // OpenAPI: HTTP method (operation)
  method: METHOD;
  // OpenAPI: path (with parameters like /users/{userId})
  pathShape: PATH;
  // OpenAPI: tags for grouping operations
  tags?: [...TAGS];
  // OpenAPI: security requirement (simplified to YES/NO)
  auth?: AUTH;
  // OpenAPI: response content type (produces in Swagger 2.0)
  responseContentType?: RESPONSE_CONTENT_TYPE;
  // OpenAPI: request content type (consumes in Swagger 2.0)
  requestContentType?: REQUEST_CONTENT_TYPE;
  // Custom: disable endpoint (not in OpenAPI spec)
  disable?: DISABLE;
  // OpenAPI: summary field
  summary?: SUMMARY;
  // OpenAPI: description field
  description?: DESCRIPTION;
  // OpenAPI: parameters and requestBody
  request: {
    // OpenAPI: requestBody schema
    body: BODY;
    // OpenAPI: path parameters
    params: PARAMS;
    // OpenAPI: query parameters
    query: QUERY;
    // OpenAPI: header parameters
    headers: HEADERS;
    // OpenAPI 3.0: cookie parameters (not in Swagger 2.0)
    cookies: COOKIES;
  };
  // OpenAPI: responses object
  response: {
    // OpenAPI: 2xx response schema
    success: RESPONSE_SUCCESS_DATA;
    // OpenAPI: 4xx/5xx response schema
    error: RESPONSE_ERROR_DATA;
  };
};

// ==========================================
// HTTP STATUS CODE SCHEMA
// ==========================================

/**
 * HTTP Status Code Constants
 * 
 * Standard HTTP status codes organized by category:
 * - 2xx: Success responses
 * - 3xx: Redirection responses
 * - 4xx: Client error responses
 * - 5xx: Server error responses
 *
 * @reference https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
const httpStatusCodes = [
  // 2xx Success
  200, 201, 202, 203, 204, 205, 206,
  // 3xx Redirection
  300, 301, 302, 303, 304, 307, 308,
  // 4xx Client Errors
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418,
  422, 423, 424, 425, 426, 428, 429, 431, 451,
  // 5xx Server Errors
  500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511,
] as const;

/**
 * HTTP Status Code Schema
 * 
 * Validates HTTP status codes used in OpenAPI responses object.
 * Includes all standard status codes from 2xx to 5xx ranges.
 *
 * @reference https://swagger.io/specification/#responses-object
 *
 * @example
 * ```typescript
 * import { httpStatusCodeSchema } from './schemas';
 *
 * // Validate status codes
 * const ok = httpStatusCodeSchema.parse(200);
 * const created = httpStatusCodeSchema.parse(201);
 * const notFound = httpStatusCodeSchema.parse(404);
 * const serverError = httpStatusCodeSchema.parse(500);
 *
 * // Use in response definitions
 * const responses = {
 *   200: { description: 'Success', schema: successSchema },
 *   404: { description: 'Not Found', schema: errorSchema },
 *   500: { description: 'Server Error', schema: errorSchema }
 * };
 * ```
 */
const httpStatusCodeSchema = z.union([
  z.literal(200),
  z.literal(201),
  z.literal(202),
  z.literal(203),
  z.literal(204),
  z.literal(205),
  z.literal(206),
  z.literal(300),
  z.literal(301),
  z.literal(302),
  z.literal(303),
  z.literal(304),
  z.literal(307),
  z.literal(308),
  z.literal(400),
  z.literal(401),
  z.literal(402),
  z.literal(403),
  z.literal(404),
  z.literal(405),
  z.literal(406),
  z.literal(407),
  z.literal(408),
  z.literal(409),
  z.literal(410),
  z.literal(411),
  z.literal(412),
  z.literal(413),
  z.literal(414),
  z.literal(415),
  z.literal(416),
  z.literal(417),
  z.literal(418),
  z.literal(422),
  z.literal(423),
  z.literal(424),
  z.literal(425),
  z.literal(426),
  z.literal(428),
  z.literal(429),
  z.literal(431),
  z.literal(451),
  z.literal(500),
  z.literal(501),
  z.literal(502),
  z.literal(503),
  z.literal(504),
  z.literal(505),
  z.literal(506),
  z.literal(507),
  z.literal(508),
  z.literal(510),
  z.literal(511),
]);

/**
 * HTTP Status Code Type
 * 
 * TypeScript type for valid HTTP status codes.
 * Extracted from httpStatusCodeSchema.
 *
 * @example
 * ```typescript
 * const successCode: IHttpStatusCode = 200;
 * const notFoundCode: IHttpStatusCode = 404;
 * 
 * function handleResponse(status: IHttpStatusCode, data: any) {
 *   if (status >= 200 && status < 300) {
 *     // Success
 *   } else if (status >= 400 && status < 500) {
 *     // Client error
 *   } else if (status >= 500) {
 *     // Server error
 *   }
 * }
 * ```
 */
type IHttpStatusCode = z.infer<typeof httpStatusCodeSchema>;

// ==========================================
// EXPORTS
// ==========================================

export type {
  IResponseContentType,
  IRequestContentType,
  IMethod,
  IAuthStatus,
  IDisableStatus,
  IPath,
  ITags,
  IDescription,
  ISummary,
  IBody,
  IParams,
  IQuery,
  IHeaders,
  ICookies,
  IResponseSuccessData,
  IResponseErrorData,
  IMakeApiConfigEntry,
  IHttpStatusCode,
};

export {
  responseContentTypeSchema,
  requestContentTypeSchema,
  methodSchema,
  authStatusSchema,
  disableStatusSchema,
  pathSchema,
  tagsSchema,
  descriptionSchema,
  summarySchema,
  bodySchema,
  paramsSchema,
  querySchema,
  headersSchema,
  cookiesSchema,
  responseSuccessSchema,
  responseErrorSchema,
  httpStatusCodeSchema,
};