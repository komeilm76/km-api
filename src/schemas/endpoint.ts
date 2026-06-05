import z, { ZodObject, ZodType } from 'zod';
import type { IAuthStatus, IDisableStatus, IHttpStatusCode, IMethod } from './http';
import type { IRequestContentType, IResponseContentType } from './content-types';

// ==========================================
// PATH AND DOCUMENTATION SCHEMAS
// ==========================================

/**
 * Path Schema — must start with `/`.
 * Supports both Express-style (`:param`) and OpenAPI-style (`{param}`) parameters.
 *
 * @reference https://swagger.io/specification/#paths-object
 */
const pathSchema = z.string().startsWith('/');
type IPath = z.infer<typeof pathSchema>;

/**
 * Tags Schema — array of strings prefixed with `#`.
 *
 * @reference https://swagger.io/specification/#operation-object
 */
const tagsSchema = z.string().startsWith('#').array();
type ITags = z.infer<typeof tagsSchema>;

/** Short description of an API operation (1-2 sentences). */
const summarySchema = z.string();
type ISummary = z.infer<typeof summarySchema>;

/** Detailed description of an API operation. Supports Markdown. */
const descriptionSchema = z.string();
type IDescription = z.infer<typeof descriptionSchema>;

// ==========================================
// REQUEST / RESPONSE PARAMETER SCHEMAS
// ==========================================

/** Request body — any Zod schema. Maps to OpenAPI requestBody. */
const bodySchema = z.instanceof(ZodType);
type IBody = z.infer<typeof bodySchema>;

/** Path parameters — Zod object schema. Maps to OpenAPI `in: path` parameters. */
const paramsSchema = z.instanceof(ZodObject);
type IParams = z.infer<typeof paramsSchema>;

/** Query parameters — Zod object schema. Maps to OpenAPI `in: query` parameters. */
const querySchema = z.instanceof(ZodObject);
type IQuery = z.infer<typeof querySchema>;

/** Custom headers — Zod object schema. Maps to OpenAPI `in: header` parameters. */
const headersSchema = z.instanceof(ZodObject);
type IHeaders = z.infer<typeof headersSchema>;

/** Cookie parameters — Zod object schema. Maps to OpenAPI `in: cookie` parameters (3.0 only). */
const cookiesSchema = z.instanceof(ZodObject);
type ICookies = z.infer<typeof cookiesSchema>;

/** Success response schema — any Zod schema. Maps to 2xx OpenAPI response. */
const responseSuccessSchema = z.instanceof(ZodType);
type IResponseSuccessData = z.infer<typeof responseSuccessSchema>;

/** Error response schema — any Zod schema. Maps to 4xx/5xx OpenAPI response. */
const responseErrorSchema = z.instanceof(ZodType);
type IResponseErrorData = z.infer<typeof responseErrorSchema>;

// ==========================================
// OPENAPI EXAMPLE OBJECT
// ==========================================

/**
 * OpenAPI 3.0 Example Object.
 * Used to provide concrete example values for documentation tools.
 *
 * @reference https://spec.openapis.org/oas/v3.0.3#example-object
 */
type IExampleObject = {
  /** Short description of the example. */
  summary?: string;
  /** Long description. Supports CommonMark Markdown. */
  description?: string;
  /** The example value. Mutually exclusive with `externalValue`. */
  value?: unknown;
  /** URL pointing to an external example. Mutually exclusive with `value`. */
  externalValue?: string;
};

/**
 * Examples map — keyed by an arbitrary example name.
 *
 * @example
 * ```typescript
 * {
 *   'standard-user': { value: { id: '1', name: 'Alice' }, summary: 'A regular user' },
 *   'admin-user':    { value: { id: '2', name: 'Bob', role: 'admin' } }
 * }
 * ```
 */
type IExamplesMap = Record<string, IExampleObject>;

// ==========================================
// COMPLETE API CONFIGURATION TYPE
// ==========================================

/**
 * Complete API endpoint configuration type.
 *
 * Maps to an OpenAPI 3.0 Operation Object and contains everything needed
 * to define, document, and validate a single API endpoint.
 *
 * @template METHOD           - HTTP method
 * @template PATH             - Endpoint path (must start with `/`)
 * @template TAGS             - Grouping tags
 * @template AUTH             - Authentication requirement
 * @template RESPONSE_CT      - Response MIME type
 * @template REQUEST_CT       - Request MIME type
 * @template DISABLE          - Disable/deprecation flag
 * @template SUMMARY          - Short summary
 * @template DESCRIPTION      - Detailed description
 * @template BODY             - Request body Zod schema
 * @template PARAMS           - Path parameters Zod schema
 * @template QUERY            - Query parameters Zod schema
 * @template HEADERS          - Header parameters Zod schema
 * @template COOKIES          - Cookie parameters Zod schema
 * @template RESPONSE_SUCCESS - Success response Zod schema
 * @template RESPONSE_ERROR   - Error response Zod schema
 *
 * @reference https://swagger.io/specification/#operation-object
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { makeApiConfig } from 'km-api';
 *
 * const getUser = makeApiConfig({
 *   method: 'GET',
 *   pathShape: '/users/{id}',
 *   auth: 'YES',
 *   summary: 'Get user by ID',
 *   responseContentType: 'application/json',
 *   request: {
 *     body: z.any(),
 *     params: z.object({ id: z.string().uuid() }),
 *     query: z.object({}),
 *     headers: z.object({}),
 *     cookies: z.object({}),
 *   },
 *   response: {
 *     200: z.object({ id: z.string(), name: z.string() }),
 *     404: z.object({ message: z.string() }),
 *   },
 *   examples: {
 *     request: {
 *       default: { value: null, summary: 'No body for GET' },
 *     },
 *     response: {
 *       200: {
 *         found: { value: { id: 'abc-123', name: 'Alice' }, summary: 'User found' },
 *       },
 *       404: {
 *         notFound: { value: { message: 'User not found' }, summary: 'Missing user' },
 *       },
 *     },
 *   },
 * });
 * ```
 */
type IMakeApiConfigEntry<
  METHOD extends IMethod = IMethod,
  PATH extends IPath = IPath,
  TAGS extends ITags = ITags,
  AUTH extends IAuthStatus = IAuthStatus,
  RESPONSE_CT extends IResponseContentType = IResponseContentType,
  REQUEST_CT extends IRequestContentType = IRequestContentType,
  DISABLE extends IDisableStatus = IDisableStatus,
  SUMMARY extends ISummary = ISummary,
  DESCRIPTION extends IDescription = IDescription,
  BODY extends IBody = IBody,
  PARAMS extends IParams = IParams,
  QUERY extends IQuery = IQuery,
  HEADERS extends IHeaders = IHeaders,
  COOKIES extends ICookies = ICookies,
  RESPONSE_SUCCESS extends IResponseSuccessData = IResponseSuccessData,
  RESPONSE_ERROR extends IResponseErrorData = IResponseErrorData,
> = {
  /** HTTP method. Case-insensitive (GET, get, Get). */
  method: METHOD;
  /** Endpoint path, e.g. `/users/{id}` or `/users/:id`. */
  pathShape: PATH;
  /** Tags for grouping operations in documentation. */
  tags?: [...TAGS];
  /** Whether this endpoint requires authentication. */
  auth?: AUTH;
  /** MIME type of the response body. */
  responseContentType?: RESPONSE_CT;
  /** MIME type of the request body. */
  requestContentType?: REQUEST_CT;
  /** Mark endpoint as disabled (will not be called). */
  disable?: DISABLE;
  /** Short one-line summary of the operation. */
  summary?: SUMMARY;
  /** Detailed description. Supports Markdown. */
  description?: DESCRIPTION;
  /** Request parameters (body, path, query, headers, cookies). */
  request: {
    body: BODY;
    params: PARAMS;
    query: QUERY;
    headers: HEADERS;
    cookies: COOKIES;
  };
  /**
   * Responses keyed by HTTP status code.
   *
   * @example
   * ```typescript
   * response: {
   *   200: z.object({ id: z.string(), name: z.string() }),
   *   404: z.object({ message: z.string() }),
   * }
   * ```
   */
  response: {
    [statusCode in IHttpStatusCode | `${IHttpStatusCode}`]?: RESPONSE_SUCCESS | RESPONSE_ERROR;
  };
  /**
   * Optional OpenAPI 3.0 example values for documentation tools.
   *
   * @example
   * ```typescript
   * examples: {
   *   request: {
   *     createAlice: { value: { name: 'Alice', email: 'alice@example.com' }, summary: 'Alice example' },
   *   },
   *   response: {
   *     200: {
   *       success: { value: { id: '1', name: 'Alice' }, summary: 'Created user' },
   *     },
   *     422: {
   *       validation: { value: { message: 'Invalid email' }, summary: 'Validation error' },
   *     },
   *   },
   * }
   * ```
   */
  examples?: {
    /** Examples for the request body. */
    request?: IExamplesMap;
    /** Examples for responses, keyed by status code. */
    response?: Partial<Record<`${IHttpStatusCode}`, IExamplesMap>>;
  };
};

export type {
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
  IExampleObject,
  IExamplesMap,
  IMakeApiConfigEntry,
};

export {
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
};
