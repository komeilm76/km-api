import { z } from 'zod';
import { convertResponseType, type AdapterType } from '../adapters/response';
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
} from '../schemas';

/**
 * Creates a fully-typed API endpoint configuration with built-in helper methods.
 *
 * The returned object contains every field from the input configuration plus
 * these helpers:
 * - `makeBody(data)` — type-safe request body
 * - `makeParams(data)` — type-safe path parameters
 * - `makeQueries(data)` — type-safe query parameters
 * - `makeHeaders(data)` — type-safe custom headers
 * - `makeCookies(data)` — type-safe cookies
 * - `makeFullPath(params)` — resolved URL (replaces `:param` / `{param}`)
 * - `makeOpenAPIPath()` — converts Express params to OpenAPI `{param}` format
 * - `convertResponseType(adapter)` — adapter-specific response config
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { makeApiConfig } from 'km-api';
 *
 * const getUser = makeApiConfig({
 *   method: 'GET',
 *   pathShape: '/users/{id}',
 *   tags: ['#users'],
 *   auth: 'YES',
 *   responseContentType: 'application/json',
 *   summary: 'Get user by ID',
 *   request: {
 *     body: z.any(),
 *     params: z.object({ id: z.string().uuid() }),
 *     query: z.object({ include: z.enum(['profile']).optional() }),
 *     headers: z.object({}),
 *     cookies: z.object({}),
 *   },
 *   response: {
 *     200: z.object({ id: z.string(), name: z.string() }),
 *     404: z.object({ message: z.string() }),
 *   },
 *   examples: {
 *     response: {
 *       200: { found: { value: { id: 'abc', name: 'Alice' } } },
 *     },
 *   },
 * });
 *
 * const path = getUser.makeFullPath({ id: '123' }); // '/users/123'
 * const openApi = getUser.makeOpenAPIPath();         // '/users/{id}'
 * const axiosCfg = getUser.convertResponseType('axios'); // { responseType: 'json' }
 * ```
 */
const makeApiConfig = <
  METHOD extends IMethod,
  PATH extends IPath,
  TAGS extends ITags,
  AUTH extends IAuthStatus,
  RESPONSE_CT extends IResponseContentType,
  REQUEST_CT extends IRequestContentType,
  DISABLE extends IDisableStatus,
  SUMMARY extends ISummary,
  DESCRIPTION extends IDescription,
  BODY extends IBody,
  PARAMS extends IParams,
  QUERY extends IQuery,
  HEADERS extends IHeaders,
  COOKIES extends ICookies,
  RESPONSE_SUCCESS extends IResponseSuccessData,
  RESPONSE_ERROR extends IResponseErrorData,
  CONFIG extends IMakeApiConfigEntry<
    METHOD,
    PATH,
    TAGS,
    AUTH,
    RESPONSE_CT,
    REQUEST_CT,
    DISABLE,
    SUMMARY,
    DESCRIPTION,
    BODY,
    PARAMS,
    QUERY,
    HEADERS,
    COOKIES,
    RESPONSE_SUCCESS,
    RESPONSE_ERROR
  >,
>(
  entryConfig: CONFIG
) => {
  /** Returns a type-safe request body that conforms to the configured body schema. */
  const makeBody = <B extends z.infer<CONFIG['request']['body']>>(body: B) => body;

  /** Returns type-safe query parameters that conform to the configured query schema. */
  const makeQueries = <Q extends z.infer<CONFIG['request']['query']>>(queries: Q) => queries;

  /** Returns type-safe path parameters that conform to the configured params schema. */
  const makeParams = <P extends z.infer<CONFIG['request']['params']>>(params: P) => params;

  /** Returns type-safe custom headers that conform to the configured headers schema. */
  const makeHeaders = <H extends z.infer<CONFIG['request']['headers']>>(headers: H) => headers;

  /** Returns type-safe cookies that conform to the configured cookies schema. */
  const makeCookies = <C extends z.infer<CONFIG['request']['cookies']>>(cookies: C) => cookies;

  /**
   * Resolves the path template to a full URL by substituting parameter values.
   *
   * Supports both Express-style (`:param`) and OpenAPI-style (`{param}`) placeholders.
   *
   * @example
   * ```typescript
   * // pathShape: '/users/{id}/posts/:postId'
   * makeFullPath({ id: '1', postId: '42' }); // '/users/1/posts/42'
   * ```
   */
  const makeFullPath = <P extends z.infer<CONFIG['request']['params']>>(params: P): string => {
    let path = entryConfig.pathShape as string;
    for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
      path = path.replace(new RegExp(`:${key}(?=/|$)`, 'g'), String(value));
      path = path.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
    }
    return path;
  };

  /**
   * Converts path parameters to OpenAPI 3.0 `{param}` format.
   *
   * @example
   * ```typescript
   * // pathShape: '/users/:id/posts/:postId'
   * makeOpenAPIPath(); // '/users/{id}/posts/{postId}'
   * ```
   */
  const makeOpenAPIPath = (): string =>
    entryConfig.pathShape.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');

  /**
   * Returns the adapter-specific response configuration for the endpoint's content type.
   *
   * @example
   * ```typescript
   * convertResponseType('axios');  // { responseType: 'json' }
   * convertResponseType('fetch');  // { responseMethod: 'json' }
   * ```
   */
  const convertResponseTypeHelper = (adapterType: AdapterType) =>
    convertResponseType(entryConfig.responseContentType!, adapterType);

  return {
    ...entryConfig,
    makeBody,
    makeQueries,
    makeParams,
    makeHeaders,
    makeCookies,
    makeFullPath,
    makeOpenAPIPath,
    convertResponseType: convertResponseTypeHelper,
  };
};

export { makeApiConfig };
