import z, { ZodObject, ZodType } from 'zod';

// Re-export of the stable schemas, using the public `zod` entrypoint
// to avoid depending on internal Zod module paths.

// 📦 Response Content Type Schema (OpenAPI/Swagger Media Types)
// Based on OpenAPI 3.0 specification - Media Type Objects
// Reference: https://swagger.io/specification/#media-type-object
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

// 📤 Request Content Type Schema (OpenAPI/Swagger Media Types)
// Based on OpenAPI 3.0 specification - Request Body Object
// Reference: https://swagger.io/specification/#request-body-object
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

type IResponseContentType = z.infer<typeof responseContentTypeSchema>;
type IRequestContentType = z.infer<typeof requestContentTypeSchema>;

// 🌐 HTTP Method Schema
// OpenAPI 3.0 & Swagger 2.0 support: GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH
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
type IMethod = z.infer<typeof methodSchema>;

// 🔐 Authentication Status Schema
// OpenAPI: security schemes (apiKey, http, oauth2, openIdConnect)
// This is a simplified boolean indicator, actual auth details go in security definitions
const authStatusSchema = z.enum(['YES', 'NO'] as const);
type IAuthStatus = z.infer<typeof authStatusSchema>;

// 🚫 Disable Status Schema
// Not part of OpenAPI spec - custom extension for internal use
const disableStatusSchema = z.enum(['YES', 'NO'] as const);
type IDisableStatus = z.infer<typeof disableStatusSchema>;

// 🛣️ Path Schema
// OpenAPI: paths object - must start with /
// Reference: https://swagger.io/specification/#paths-object
const pathSchema = z.string().startsWith('/');
type IPath = z.infer<typeof pathSchema>;

// 🏷️ Tags Schema
// OpenAPI: tags array for API operation grouping
// Reference: https://swagger.io/specification/#operation-object
// Custom format: starting with # (not OpenAPI standard, but common practice)
const tagsSchema = z.string().startsWith('#').array();
type ITags = z.infer<typeof tagsSchema>;

// 📝 Description Schema
// swagger_&_openapi_supported - Operation description
// Reference: https://swagger.io/specification/#operation-object
const descriptionSchema = z.string();
type IDescription = z.infer<typeof descriptionSchema>;

// 📝 Summary Schema
// swagger_&_openapi_supported - Operation summary (short description)
// Reference: https://swagger.io/specification/#operation-object
const summarySchema = z.string();
type ISummary = z.infer<typeof summarySchema>;

// 📋 Body Schema
// OpenAPI: requestBody schema
// Zod schema for request body validation
const bodySchema = z.instanceof(ZodType);
type IBody = z.infer<typeof bodySchema>;

// 📢 Params Schema
// OpenAPI: path parameters
// Reference: https://swagger.io/specification/#parameter-object (in: path)
const paramsSchema = z.instanceof(ZodObject);
type IParams = z.infer<typeof paramsSchema>;

// ❓ Query Schema
// OpenAPI: query parameters
// Reference: https://swagger.io/specification/#parameter-object (in: query)
const querySchema = z.instanceof(ZodObject);
type IQuery = z.infer<typeof querySchema>;

// 📎 Headers Schema
// OpenAPI: header parameters
// Reference: https://swagger.io/specification/#parameter-object (in: header)
const headersSchema = z.instanceof(ZodObject);
type IHeaders = z.infer<typeof headersSchema>;

// 🍪 Cookies Schema
// OpenAPI 3.0: cookie parameters
// Reference: https://swagger.io/specification/#parameter-object (in: cookie)
// Note: Not supported in Swagger 2.0
const cookiesSchema = z.instanceof(ZodObject);
type ICookies = z.infer<typeof cookiesSchema>;

// ✅ Response Success Schema
// OpenAPI: response schema for 2xx status codes
// Reference: https://swagger.io/specification/#response-object
const responseSuccessSchema = z.instanceof(ZodType);
type IResponseSuccessData = z.infer<typeof responseSuccessSchema>;

// ❌ Response Error Schema
// OpenAPI: response schema for 4xx/5xx status codes
// Reference: https://swagger.io/specification/#response-object
const responseErrorSchema = z.instanceof(ZodType);
type IResponseErrorData = z.infer<typeof responseErrorSchema>;

// 🗝️ API Configuration Entry Type
// Complete type definition for a single API endpoint configuration
// Maps to OpenAPI Operation Object
// Reference: https://swagger.io/specification/#operation-object
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
  path: PATH;
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

// 🔢 HTTP Status Code Schema
// OpenAPI: status codes for responses
// Reference: https://swagger.io/specification/#responses-object
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
type IHttpStatusCode = z.infer<typeof httpStatusCodeSchema>;

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
