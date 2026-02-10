import { z, ZodArray, ZodObject, type ZodRawShape } from 'zod';
import kmType from 'km-type';
import * as adapters from './adapters';
import type {
  IAuthStatus,
  IBody,
  ICookies,
  IDescription,
  IDisableStatus,
  IHeaders,
  IMakeApiConfigEntry,
  IMethod,
  IParams,
  IPath,
  IQuery,
  IRequestContentType,
  IResponseContentType,
  IResponseErrorData,
  IResponseSuccessData,
  ISummary,
  ITags,
} from './schemas';

/**
 * Main API Configuration Factory
 *
 * Creates a fully typed API endpoint configuration with helper methods.
 * Can be used to generate OpenAPI/Swagger documentation and provides
 * type-safe utilities for building requests and responses.
 *
 * @template METHOD - HTTP method type (GET, POST, PUT, DELETE, etc.)
 * @template PATH - API path starting with / (e.g., '/users', '/admin/posts')
 * @template TAGS - Array of tags for API grouping
 * @template AUTH - Authentication requirement status ('YES' | 'NO')
 * @template RESPONSE_CONTENT_TYPE - Response MIME type
 * @template REQUEST_CONTENT_TYPE - Request MIME type
 * @template DISABLE - Endpoint disable status ('YES' | 'NO')
 * @template SUMMARY - Short operation summary
 * @template DESCRIPTION - Detailed operation description
 * @template BODY - Request body Zod schema
 * @template PARAMS - URL parameters Zod schema
 * @template QUERY - Query parameters Zod schema
 * @template HEADERS - Custom headers Zod schema
 * @template COOKIES - Cookie parameters Zod schema
 * @template RESPONSE_SUCCESS_DATA - Success response Zod schema
 * @template RESPONSE_ERROR_DATA - Error response Zod schema
 * @template CONFIG - Complete configuration entry type
 *
 * @param entryConfig - API endpoint configuration object
 * @returns API configuration with helper methods
 *
 * @example
 * ```typescript
 * // Define a user endpoint with path parameters
 * const getUserConfig = makeApiConfig({
 *   method: 'GET',
 *   pathShape: '/users/{id}',
 *   tags: ['#users'],
 *   auth: 'YES',
 *   responseContentType: 'application/json',
 *   request: {
 *     body: z.any(),
 *     params: z.object({ id: z.string() }),
 *     query: z.object({}),
 *     headers: z.object({}),
 *     cookies: z.object({})
 *   },
 *   response: {
 *     success: z.object({ name: z.string(), email: z.string() }),
 *     error: z.object({ message: z.string() })
 *   }
 * });
 *
 * // Use helper methods
 * const params = getUserConfig.makeParams({ id: '123' });
 * const path = getUserConfig.makeFullPath({ id: '123' }); // '/users/123'
 * ```
 */
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
  /**
   * Create type-safe request body
   *
   * Validates and returns a properly typed request body that matches
   * the configured body schema.
   *
   * @template BODY - Request body type inferred from schema
   * @param body - The request body data
   * @returns Type-safe request body
   *
   * @example
   * ```typescript
   * const createUserConfig = makeApiConfig({
   *   method: 'POST',
   *   pathShape: '/users',
   *   request: {
   *     body: z.object({ name: z.string(), email: z.string() }),
   *     // ... other request fields
   *   },
   *   // ... other config
   * });
   *
   * const body = createUserConfig.makeBody({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   * ```
   */
  const makeBody = <BODY extends z.infer<CONFIG['request']['body']>>(body: BODY) => {
    return body;
  };

  /**
   * Create type-safe success response
   *
   * Validates and returns a properly typed success response that matches
   * the configured success schema.
   *
   * @template DATA - Success response type inferred from schema
   * @param data - The success response data
   * @returns Type-safe success response
   *
   * @example
   * ```typescript
   * const getUserConfig = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/users/{id}',
   *   response: {
   *     success: z.object({ id: z.string(), name: z.string() }),
   *     error: z.object({ message: z.string() })
   *   },
   *   // ... other config
   * });
   *
   * const response = getUserConfig.makeSuccessResponse({
   *   id: '123',
   *   name: 'John Doe'
   * });
   * ```
   */
  const makeSuccessResponse = <DATA extends z.infer<CONFIG['response']['success']>>(data: DATA) => {
    return data;
  };

  /**
   * Create type-safe error response
   *
   * Validates and returns a properly typed error response that matches
   * the configured error schema.
   *
   * @template DATA - Error response type inferred from schema
   * @param data - The error response data
   * @returns Type-safe error response
   *
   * @example
   * ```typescript
   * const getUserConfig = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/users/{id}',
   *   response: {
   *     success: z.object({ id: z.string(), name: z.string() }),
   *     error: z.object({ code: z.number(), message: z.string() })
   *   },
   *   // ... other config
   * });
   *
   * const errorResponse = getUserConfig.makeErrorResponse({
   *   code: 404,
   *   message: 'User not found'
   * });
   * ```
   */
  const makeErrorResponse = <DATA extends z.infer<CONFIG['response']['error']>>(data: DATA) => {
    return data;
  };

  /**
   * Create type-safe query parameters
   *
   * Validates and returns properly typed query parameters that match
   * the configured query schema.
   *
   * @template QUERIES - Query parameters type inferred from schema
   * @param queries - The query parameters object
   * @returns Type-safe query parameters
   *
   * @example
   * ```typescript
   * const listUsersConfig = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/users',
   *   request: {
   *     query: z.object({
   *       page: z.number().optional(),
   *       limit: z.number().optional()
   *     }),
   *     // ... other request fields
   *   },
   *   // ... other config
   * });
   *
   * const queries = listUsersConfig.makeQueries({ page: 1, limit: 20 });
   * ```
   */
  const makeQueries = <QUERIES extends z.infer<CONFIG['request']['query']>>(queries: QUERIES) => {
    return queries;
  };

  /**
   * Create type-safe URL parameters
   *
   * Validates and returns properly typed URL path parameters that match
   * the configured params schema.
   *
   * @template PARAMS - URL parameters type inferred from schema
   * @param params - The URL parameters object
   * @returns Type-safe URL parameters
   *
   * @example
   * ```typescript
   * const getUserConfig = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/users/{id}/posts/{postId}',
   *   request: {
   *     params: z.object({ id: z.string(), postId: z.string() }),
   *     // ... other request fields
   *   },
   *   // ... other config
   * });
   *
   * const params = getUserConfig.makeParams({
   *   id: '123',
   *   postId: '456'
   * });
   * ```
   */
  const makeParams = <PARAMS extends z.infer<CONFIG['request']['params']>>(params: PARAMS) => {
    return params;
  };

  /**
   * Create type-safe custom headers
   *
   * Validates and returns properly typed custom headers that match
   * the configured headers schema.
   *
   * @template HEADERS - Headers type inferred from schema
   * @param headers - The headers object
   * @returns Type-safe headers
   *
   * @example
   * ```typescript
   * const uploadConfig = makeApiConfig({
   *   method: 'POST',
   *   pathShape: '/upload',
   *   request: {
   *     headers: z.object({
   *       'X-Upload-Token': z.string(),
   *       'X-File-Size': z.number()
   *     }),
   *     // ... other request fields
   *   },
   *   // ... other config
   * });
   *
   * const headers = uploadConfig.makeHeaders({
   *   'X-Upload-Token': 'abc123',
   *   'X-File-Size': 1024
   * });
   * ```
   */
  const makeHeaders = <HEADERS extends z.infer<CONFIG['request']['headers']>>(headers: HEADERS) => {
    return headers;
  };

  /**
   * Create type-safe cookies
   *
   * Validates and returns properly typed cookies that match
   * the configured cookies schema.
   *
   * @template COOKIES - Cookies type inferred from schema
   * @param cookies - The cookies object
   * @returns Type-safe cookies
   *
   * @example
   * ```typescript
   * const getProfileConfig = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/profile',
   *   request: {
   *     cookies: z.object({
   *       sessionId: z.string(),
   *       preferences: z.string().optional()
   *     }),
   *     // ... other request fields
   *   },
   *   // ... other config
   * });
   *
   * const cookies = getProfileConfig.makeCookies({
   *   sessionId: 'sess_12345',
   *   preferences: 'theme=dark'
   * });
   * ```
   */
  const makeCookies = <COOKIES extends z.infer<CONFIG['request']['cookies']>>(cookies: COOKIES) => {
    return cookies;
  };

  /**
   * Generate complete path with parameter values
   *
   * Replaces parameter placeholders in pathShape with actual values.
   * Supports both Express-style (:param) and OpenAPI-style ({param}) syntax.
   * Automatically detects the syntax used in pathShape.
   *
   * @template PARAMS - URL parameters type inferred from schema
   * @param params - Object containing parameter values
   * @returns Complete path with parameters replaced by values
   *
   * @example
   * ```typescript
   * // Using OpenAPI-style syntax
   * const config1 = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/admin/question/{id}/info/{userId}',
   *   request: {
   *     params: z.object({ id: z.string(), userId: z.string() }),
   *     // ... other request fields
   *   },
   *   // ... other config
   * });
   *
   * const path1 = config1.makeFullPath({ id: '7890', userId: '1234' });
   * // Returns: '/admin/question/7890/info/1234'
   *
   * // Using Express-style syntax
   * const config2 = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/admin/question/:id/info/:userId',
   *   request: {
   *     params: z.object({ id: z.string(), userId: z.string() }),
   *     // ... other request fields
   *   },
   *   // ... other config
   * });
   *
   * const path2 = config2.makeFullPath({ id: '7890', userId: '1234' });
   * // Returns: '/admin/question/7890/info/1234'
   * ```
   */
  const makeFullPath = <PARAMS extends z.infer<CONFIG['request']['params']>>(
    params: PARAMS
  ): string => {
    let path = entryConfig.pathShape as string;

    // Replace parameters in the path
    Object.entries(params as Object).forEach(([key, value]) => {
      // Support both :param and {param} syntax
      const expressRegex = new RegExp(`:${key}(?=/|$)`, 'g');
      const openApiRegex = new RegExp(`\\{${key}\\}`, 'g');

      path = path.replace(expressRegex, String(value));
      path = path.replace(openApiRegex, String(value));
    });

    return path;
  };

  /**
   * Generate OpenAPI-style path template
   *
   * Converts path parameters to OpenAPI 3.0 format with curly braces.
   * Transforms Express-style (:param) to OpenAPI-style ({param}).
   *
   * @returns OpenAPI 3.0 formatted path template
   *
   * @example
   * ```typescript
   * const config = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/users/:userId/posts/:postId',
   *   request: {
   *     params: z.object({ userId: z.string(), postId: z.string() }),
   *     // ... other request fields
   *   },
   *   // ... other config
   * });
   *
   * const openApiPath = config.makeOpenAPIPath();
   * // Returns: '/users/{userId}/posts/{postId}'
   * ```
   */
  const makeOpenAPIPath = (): string => {
    // Convert :param to {param} format
    return entryConfig.pathShape.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
  };

  /**
   * Convert response content type to adapter-specific configuration
   *
   * Transforms OpenAPI response content type to format required by
   * specific HTTP client adapters (Axios, Fetch, Alova variants, etc.).
   *
   * @param adapterType - Target HTTP client adapter type
   * @returns Adapter-specific response type configuration
   *
   * @example
   * ```typescript
   * const config = makeApiConfig({
   *   method: 'GET',
   *   pathShape: '/users/{id}',
   *   responseContentType: 'application/json',
   *   // ... other config
   * });
   *
   * // For Axios
   * const axiosConfig = config.convertResponseType('axios');
   * // Returns: { responseType: 'json' }
   *
   * // For Fetch API
   * const fetchConfig = config.convertResponseType('fetch');
   * // Returns: { responseMethod: 'json' }
   *
   * // For PDF response
   * const pdfConfig = makeApiConfig({
   *   responseContentType: 'application/pdf',
   *   // ... other config
   * });
   * const axiosPdfConfig = pdfConfig.convertResponseType('axios');
   * // Returns: { responseType: 'blob' }
   * ```
   */
  const convertResponseType = (adapterType: adapters.AdapterType) => {
    return adapters.convertResponseType(entryConfig.responseContentType!, adapterType);
  };

  return {
    ...entryConfig,
    makeFullPath,
    makeOpenAPIPath,
    makeBody,
    makeSuccessResponse,
    makeErrorResponse,
    makeQueries,
    makeParams,
    makeHeaders,
    makeCookies,
    convertResponseType,
  };
};

/**
 * Response Success Shape Factory
 *
 * Creates response wrappers for single items or lists with custom key names.
 * Follows common API response patterns compatible with OpenAPI schemas.
 * Useful for standardizing API response structures.
 *
 * @template RESPONSE - Success response data Zod schema
 * @template KEY_OF_DATA - Custom key name for the data field
 *
 * @param response - Zod schema for the response data
 * @param key - Custom key name for wrapping data (default: 'data')
 * @returns Object with item() and list() wrapper methods
 *
 * @example
 * ```typescript
 * const userSchema = z.object({
 *   id: z.string(),
 *   name: z.string(),
 *   email: z.string()
 * });
 *
 * const userResponse = makeResponseSuccessShape(userSchema, 'user');
 *
 * // Single item response
 * const singleItemSchema = userResponse.item();
 * // Schema for: { user: { id, name, email } }
 *
 * // List response with pagination
 * const paginationMeta = z.object({
 *   currentPage: z.number(),
 *   totalPages: z.number(),
 *   totalItems: z.number()
 * });
 *
 * const listSchema = userResponse.list(paginationMeta);
 * // Schema for: {
 * //   user: [{ id, name, email }, ...],
 * //   currentPage: number,
 * //   totalPages: number,
 * //   totalItems: number
 * // }
 * ```
 */
const makeResponseSuccessShape = <
  RESPONSE extends IResponseSuccessData,
  KEY_OF_DATA extends string
>(
  response: RESPONSE,
  key: KEY_OF_DATA = 'data' as KEY_OF_DATA
) => {
  return {
    /**
     * Create single item response wrapper
     *
     * Wraps the response schema in an object with a custom key.
     *
     * @returns Zod schema for single item response
     *
     * @example
     * ```typescript
     * const productSchema = z.object({
     *   id: z.string(),
     *   name: z.string()
     * });
     *
     * const response = makeResponseSuccessShape(productSchema, 'product');
     * const schema = response.item();
     * // Validates: { product: { id: '123', name: 'Widget' } }
     * ```
     */
    item: () => {
      return z.object({
        [key]: response,
      }) as unknown as ZodObject<{
        [key in KEY_OF_DATA]: RESPONSE;
      }>;
    },

    /**
     * Create list response wrapper with additional fields
     *
     * Wraps an array of response items with a custom key and merges
     * additional fields (like pagination metadata).
     *
     * @template AND - Additional Zod object schema to merge
     * @param and - Zod object schema for additional fields
     * @returns Zod schema for list response with merged fields
     *
     * @example
     * ```typescript
     * const postSchema = z.object({
     *   id: z.string(),
     *   title: z.string()
     * });
     *
     * const response = makeResponseSuccessShape(postSchema, 'posts');
     *
     * const meta = z.object({
     *   page: z.number(),
     *   perPage: z.number(),
     *   total: z.number()
     * });
     *
     * const listSchema = response.list(meta);
     * // Validates: {
     * //   posts: [{ id: '1', title: 'Post 1' }, ...],
     * //   page: 1,
     * //   perPage: 20,
     * //   total: 100
     * // }
     * ```
     */
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

/**
 * Pagination Schema Factory
 *
 * Creates a standard pagination object schema for list responses.
 * Common pattern in REST APIs, compatible with OpenAPI specifications.
 *
 * @returns Zod schema for pagination metadata
 *
 * @example
 * ```typescript
 * const pagination = paginationSchema();
 *
 * // Use with list responses
 * const userSchema = z.object({ id: z.string(), name: z.string() });
 * const userListResponse = makeResponseSuccessShape(userSchema, 'users')
 *   .list(pagination());
 *
 * // Validates responses like:
 * // {
 * //   users: [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }],
 * //   currentPage: 1,
 * //   totalItems: 50,
 * //   itemsPerPage: 20,
 * //   totalPages: 3
 * // }
 *
 * // Can also be used standalone
 * const paginatedData = {
 *   currentPage: 2,
 *   totalItems: 100,
 *   itemsPerPage: 25,
 *   totalPages: 4
 * };
 * const result = pagination().parse(paginatedData);
 * ```
 */
const paginationSchema = () => {
  return z.object({
    currentPage: z.number().int().min(1),
    totalItems: z.number().int().min(0),
    itemsPerPage: z.number().int().min(1),
    totalPages: z.number().int().min(0).optional(),
  });
};

// 🎯 Export all utilities
export { makeApiConfig, makeResponseSuccessShape, paginationSchema };
