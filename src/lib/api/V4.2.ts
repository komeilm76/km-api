import { z, ZodArray, ZodObject, ZodType, type ZodRawShape } from 'zod/v4';
import kmType from 'km-type';

// 🌐 HTTP Method Schema
// OpenAPI 3.0 & Swagger 2.0 support: GET, POST, PUT, DELETE, HEAD, OPTIONS, PATCH
// Using Zod v4 z.literal() with multiple values for better performance
const methodSchema = z.literal([
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
]);
type IMethod = z.infer<typeof methodSchema>;

// 📦 Response Content Type Schema (OpenAPI/Swagger Media Types)
// Based on OpenAPI 3.0 specification - Media Type Objects
// Reference: https://swagger.io/specification/#media-type-object
const responseContentTypeSchema = z.literal([
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
]);

// 📤 Request Content Type Schema (OpenAPI/Swagger Media Types)
// Based on OpenAPI 3.0 specification - Request Body Object
// Reference: https://swagger.io/specification/#request-body-object
const requestContentTypeSchema = z.literal([
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
]);

type IResponseContentType = z.infer<typeof responseContentTypeSchema>;
type IRequestContentType = z.infer<typeof requestContentTypeSchema>;

// 🔐 Authentication Status Schema
// OpenAPI: security schemes (apiKey, http, oauth2, openIdConnect)
// This is a simplified boolean indicator, actual auth details go in security definitions
const authStatusSchema = z.literal(['YES', 'NO']);
type IAuthStatus = z.infer<typeof authStatusSchema>;

// 🚫 Disable Status Schema
// Not part of OpenAPI spec - custom extension for internal use
const disableStatusSchema = z.literal(['YES', 'NO']);
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

// 🎯 Main API Configuration Factory
// Creates a fully typed API endpoint configuration with helper methods
// Can be used to generate OpenAPI/Swagger documentation
const makeApiConfig = <
  METHOD extends IMethod,
  PATH extends IPath,
  TAGS extends ITags,
  AUTH extends IAuthStatus,
  RESPONSE_CONTENT_TYPE extends IResponseContentType,
  REQUEST_CONTENT_TYPE extends IRequestContentType,
  DISABLE extends IDisableStatus,
  SUMMARY extends ISummary,
  DESCRIPTION extends IDescription,
  BODY extends IBody,
  PARAMS extends IParams,
  QUERY extends IQuery,
  HEADERS extends IHeaders,
  COOKIES extends ICookies,
  RESPONSE_SUCCESS_DATA extends IResponseSuccessData,
  RESPONSE_ERROR_DATA extends IResponseErrorData,
  CONFIG extends IMakeApiConfigEntry<
    METHOD,
    PATH,
    TAGS,
    AUTH,
    RESPONSE_CONTENT_TYPE,
    REQUEST_CONTENT_TYPE,
    DISABLE,
    SUMMARY,
    DESCRIPTION,
    BODY,
    PARAMS,
    QUERY,
    HEADERS,
    COOKIES,
    RESPONSE_SUCCESS_DATA,
    RESPONSE_ERROR_DATA
  >
>(
  entryConfig: CONFIG
) => {
  // 📦 Create type-safe request body
  const makeBody = <BODY extends z.infer<CONFIG['request']['body']>>(body: BODY) => {
    return body;
  };

  // ✅ Create type-safe success response
  const makeSuccessResponse = <DATA extends z.infer<CONFIG['response']['success']>>(data: DATA) => {
    return data;
  };

  // ❌ Create type-safe error response
  const makeErrorResponse = <DATA extends z.infer<CONFIG['response']['error']>>(data: DATA) => {
    return data;
  };

  // ❓ Create type-safe query parameters
  const makeQueries = <QUERIES extends z.infer<CONFIG['request']['query']>>(queries: QUERIES) => {
    return queries;
  };

  // 📢 Create type-safe URL parameters
  const makeParams = <PARAMS extends z.infer<CONFIG['request']['params']>>(params: PARAMS) => {
    return params;
  };

  // 📎 Create type-safe custom headers
  const makeHeaders = <HEADERS extends z.infer<CONFIG['request']['headers']>>(headers: HEADERS) => {
    return headers;
  };

  // 🍪 Create type-safe cookies
  const makeCookies = <COOKIES extends z.infer<CONFIG['request']['cookies']>>(cookies: COOKIES) => {
    return cookies;
  };

  // 📋 Create ordered list of parameter keys
  const makeParamsOrderedList = <
    KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
    KEYS extends [...KEY[]]
  >(
    list: KEYS
  ) => {
    return list;
  };

  // 🏷️ Generate parameter shape string (e.g., "/:id/:userId")
  const makeParamsStringShape = <
    KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
    LIST extends KEY[]
  >(
    list: [...LIST]
  ) => {
    return list
      .map((item) => `/:${item}`)
      .join('') as unknown as kmType.Advanced.JoinListOfStringInStart<[...LIST], '/:'>;
  };

  // 🔗 Generate parameter string from values
  const makeParamsString = <PARAMS extends z.infer<CONFIG['request']['params']>>(
    params: PARAMS,
    orderList: (keyof PARAMS)[]
  ) => {
    return orderList.map((item) => `/${params[item]}`).join('');
  };

  // 🛣️ Generate full path shape with parameters
  // Converts /users/:userId format to match OpenAPI path templating
  const makeFullPathShape = <
    KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
    LIST extends KEY[]
  >(
    list: [...LIST]
  ) => {
    let paramsShape = list
      .map((item) => `/:${item}`)
      .join('') as unknown as kmType.Advanced.JoinListOfStringInStart<[...LIST], '/:'>;

    let output = `${entryConfig.path}${paramsShape}`;
    return output as `${CONFIG['path']}${kmType.Advanced.JoinListOfStringInStart<[...LIST], '/:'>}`;
  };

  // 🎯 Generate complete path with parameter values
  const makeFullPath = <
    KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
    LIST extends KEY[],
    PARAMS extends z.infer<CONFIG['request']['params']>
  >(
    params: PARAMS,
    list: [...LIST]
  ) => {
    let output = `${entryConfig.path}${makeParamsString(params, list)}`;
    return output as `${CONFIG['path']}${kmType.Advanced.JoinListOfStringInStart<[...LIST], '/:'>}`;
  };

  // 📄 Generate OpenAPI-style path template
  // Converts /users/:userId to /users/{userId} (OpenAPI 3.0 format)
  const makeOpenAPIPath = <
    KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
    LIST extends KEY[]
  >(
    list: [...LIST]
  ) => {
    let paramsShape = list.map((item) => `/{${item}}`).join('');
    return `${entryConfig.path}${paramsShape}`;
  };

  return {
    ...entryConfig,
    makeParamsOrderedList,
    makeParamsStringShape,
    makeParamsString,
    makeFullPathShape,
    makeFullPath,
    makeOpenAPIPath,
    makeBody,
    makeSuccessResponse,
    makeErrorResponse,
    makeQueries,
    makeParams,
    makeHeaders,
    makeCookies,
  };
};

// 📊 Response Success Shape Factory
// Creates response wrappers for single items or lists with custom key names
// Follows common API response patterns compatible with OpenAPI schemas
const makeResponseSuccessShape = <
  RESPONSE extends IResponseSuccessData,
  KEY_OF_DATA extends string
>(
  response: RESPONSE,
  key: KEY_OF_DATA = 'data' as KEY_OF_DATA
) => {
  return {
    // 📦 Single item response wrapper
    item: () => {
      return z.object({
        [key]: response,
      }) as unknown as ZodObject<{
        [key in KEY_OF_DATA]: RESPONSE;
      }>;
    },
    // 📋 List response wrapper with additional fields
    list: <AND extends ZodObject<ZodRawShape>>(and: AND) => {
      let data = z.object({
        [key]: z.array(response),
      }) as unknown as ZodObject<{
        [key in KEY_OF_DATA]: ZodArray<RESPONSE>;
      }>;
      return data.merge(and);
    },
  };
};

// 📄 Pagination Schema Factory
// Standard pagination object for list responses
// Common pattern in REST APIs, compatible with OpenAPI
const paginationSchema = () => {
  return z.object({
    currentPage: z.number().int().min(1),
    totalItems: z.number().int().min(0),
    itemsPerPage: z.number().int().min(1),
    totalPages: z.number().int().min(0).optional(),
  });
};

// 🔄 Axios/Alova Adapter
// Converts OpenAPI content types to Axios/Alova compatible response types
// Based on Axios/Alova adapter specifications
type AlovaAxiosResponseType =
  | 'arraybuffer'
  | 'blob'
  | 'document'
  | 'json'
  | 'text'
  | 'stream'
  | 'formdata';

type AlovaAxiosResponseEncoding =
  | 'ascii'
  | 'ASCII'
  | 'ansi'
  | 'ANSI'
  | 'binary'
  | 'BINARY'
  | 'base64'
  | 'BASE64'
  | 'base64url'
  | 'BASE64URL'
  | 'hex'
  | 'HEX'
  | 'latin1'
  | 'LATIN1'
  | 'ucs-2'
  | 'UCS-2'
  | 'ucs2'
  | 'UCS2'
  | 'utf-8'
  | 'UTF-8'
  | 'utf8'
  | 'UTF8'
  | 'utf16le'
  | 'UTF16LE';

/**
 * Converts OpenAPI/Swagger content types to Axios/Alova compatible types
 *
 * @param responseContentType - OpenAPI response content type
 * @param requestContentType - OpenAPI request content type (optional)
 * @returns Object with Axios/Alova compatible responseType and optional responseEncoding
 *
 * @example
 * ```typescript
 * const adapter = makeAxiosAlovaAdapter('application/json');
 * // Returns: { responseType: 'json' }
 *
 * const pdfAdapter = makeAxiosAlovaAdapter('application/pdf');
 * // Returns: { responseType: 'blob' }
 *
 * const textAdapter = makeAxiosAlovaAdapter('text/plain', 'application/json');
 * // Returns: { responseType: 'text', responseEncoding: 'utf-8' }
 * ```
 */
const makeAxiosAlovaAdapter = (
  responseContentType: IResponseContentType,
  requestContentType?: IRequestContentType
): {
  responseType: AlovaAxiosResponseType;
  responseEncoding?: AlovaAxiosResponseEncoding;
} => {
  // Map OpenAPI content types to Axios/Alova response types
  const contentTypeMap: Record<string, AlovaAxiosResponseType> = {
    // JSON types → json
    'application/json': 'json',
    'application/ld+json': 'json',
    'application/vnd.api+json': 'json',
    'application/json-patch+json': 'json',
    'application/merge-patch+json': 'json',
    'application/x-ndjson': 'json',
    'application/vnd.github+json': 'json',
    'application/vnd.github.v3+json': 'json',

    // Binary/Blob types → blob
    'application/octet-stream': 'blob',
    'application/pdf': 'blob',
    'application/zip': 'blob',
    'application/gzip': 'blob',
    'application/msgpack': 'blob',
    'application/x-protobuf': 'blob',

    // Microsoft Office formats → blob
    'application/vnd.ms-excel': 'blob',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'blob',
    'application/vnd.ms-powerpoint': 'blob',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'blob',
    'application/msword': 'blob',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'blob',

    // Image types → blob
    'image/png': 'blob',
    'image/jpeg': 'blob',
    'image/gif': 'blob',
    'image/webp': 'blob',
    'image/svg+xml': 'blob',
    'image/bmp': 'blob',
    'image/tiff': 'blob',
    'image/x-icon': 'blob',
    'image/avif': 'blob',
    'image/vnd.djvu': 'blob',

    // Audio types → blob
    'audio/mpeg': 'blob',
    'audio/ogg': 'blob',
    'audio/wav': 'blob',
    'audio/webm': 'blob',
    'audio/aac': 'blob',
    'audio/flac': 'blob',

    // Video types → blob
    'video/mp4': 'blob',
    'video/mpeg': 'blob',
    'video/ogg': 'blob',
    'video/webm': 'blob',
    'video/quicktime': 'blob',
    'video/x-msvideo': 'blob',

    // Text types → text
    'text/plain': 'text',
    'text/html': 'text',
    'text/css': 'text',
    'text/javascript': 'text',
    'text/csv': 'text',
    'text/xml': 'text',
    'text/markdown': 'text',
    'text/yaml': 'text',

    // XML types → document
    'application/xml': 'document',
    'application/vnd.openstreetmap.data+xml': 'document',

    // Form data → formdata
    'multipart/form-data': 'formdata',
    'application/x-www-form-urlencoded': 'formdata',

    // GitHub specific → text (for diffs/patches)
    'application/vnd.github.v3.diff': 'text',
    'application/vnd.github.v3.patch': 'text',
  };

  const responseType = contentTypeMap[responseContentType] || 'json';

  // Determine encoding for text-based responses
  let responseEncoding: AlovaAxiosResponseEncoding | undefined;

  if (responseType === 'text' || responseType === 'document') {
    // Default to UTF-8 for text responses
    responseEncoding = 'utf-8';

    // Check if content type specifies charset
    if (responseContentType.includes('charset=')) {
      const charsetMatch = responseContentType.match(/charset=([a-zA-Z0-9-]+)/i);
      if (charsetMatch) {
        const charset = charsetMatch[1]?.toLowerCase() || 'not_founded_charset';
        // Map common charsets to Axios/Alova encoding values
        const encodingMap: Record<string, AlovaAxiosResponseEncoding> = {
          'utf-8': 'utf-8',
          utf8: 'utf8',
          ascii: 'ascii',
          latin1: 'latin1',
          'iso-8859-1': 'latin1',
          binary: 'binary',
          base64: 'base64',
          hex: 'hex',
        };
        responseEncoding = encodingMap[charset] || 'utf-8';
      }
    }
  }
  console.log('responseEncoding', responseEncoding);

  return responseEncoding ? { responseType, responseEncoding } : { responseType };
};

// 🔢 HTTP Status Code Schema
// OpenAPI: status codes for responses
// Reference: https://swagger.io/specification/#responses-object
const httpStatusCodeSchema = z.literal([
  // 2xx Success
  200, 201, 202, 203, 204, 205, 206,
  // 3xx Redirection
  300, 301, 302, 303, 304, 307, 308,
  // 4xx Client Errors
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418,
  422, 423, 424, 425, 426, 428, 429, 431, 451,
  // 5xx Server Errors
  500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511,
]);
type IHttpStatusCode = z.infer<typeof httpStatusCodeSchema>;

// 🎁 Export all utilities
export default {
  makeApiConfig,
  makeResponseSuccessShape,
  paginationSchema,
  makeAxiosAlovaAdapter,
};

// 📤 Export individual schemas for advanced usage
export {
  methodSchema,
  responseContentTypeSchema,
  requestContentTypeSchema,
  authStatusSchema,
  disableStatusSchema,
  pathSchema,
  tagsSchema,
  summarySchema,
  descriptionSchema,
  bodySchema,
  paramsSchema,
  querySchema,
  headersSchema,
  cookiesSchema,
  responseSuccessSchema,
  responseErrorSchema,
  httpStatusCodeSchema,
};

// 📤 Export types
export type {
  IMethod,
  IResponseContentType,
  IRequestContentType,
  IAuthStatus,
  IDisableStatus,
  IPath,
  ITags,
  ISummary,
  IDescription,
  IBody,
  IParams,
  IQuery,
  IHeaders,
  ICookies,
  IResponseSuccessData,
  IResponseErrorData,
  IMakeApiConfigEntry,
  IHttpStatusCode,
  AlovaAxiosResponseType,
  AlovaAxiosResponseEncoding,
};
