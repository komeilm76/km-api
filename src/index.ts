/**
 * km-api — Type-safe API schema builder for TypeScript
 *
 * Build fully-typed, OpenAPI-compatible endpoint configurations with
 * Zod schema validation, dual path syntax support, and HTTP client adapters.
 *
 * @packageDocumentation
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { makeApiConfig, makeResponseSuccessShape, paginationSchema } from 'km-api';
 *
 * const getUsers = makeApiConfig({
 *   method: 'GET',
 *   pathShape: '/users',
 *   auth: 'YES',
 *   responseContentType: 'application/json',
 *   summary: 'List users',
 *   request: {
 *     body: z.any(),
 *     params: z.object({}),
 *     query: z.object({ page: z.number().optional() }),
 *     headers: z.object({}),
 *     cookies: z.object({}),
 *   },
 *   response: {
 *     200: makeResponseSuccessShape(
 *       z.object({ id: z.string(), name: z.string() }),
 *       'users'
 *     ).list(paginationSchema()),
 *   },
 * });
 *
 * const path = getUsers.makeFullPath({});
 * const axiosCfg = getUsers.convertResponseType('axios');
 * ```
 */

// Config utilities
export { makeApiConfig, makeResponseSuccessShape, paginationSchema } from './config';

// Schemas
export type {
  IResponseContentType,
  IRequestContentType,
  IMethod,
  IAuthStatus,
  IDisableStatus,
  IHttpStatusCode,
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
} from './schemas';

export {
  responseContentTypeSchema,
  requestContentTypeSchema,
  methodSchema,
  authStatusSchema,
  disableStatusSchema,
  httpStatusCodeSchema,
  successStatusCodes,
  redirectionStatusCodes,
  clientErrorStatusCodes,
  serverErrorStatusCodes,
  httpStatusCodes,
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
} from './schemas';

// Adapters
export type {
  AxiosResponseType,
  AxiosResponseEncoding,
  AxiosAdapterConfig,
  UniAppResponseType,
  UniAppDataType,
  UniAppAdapterConfig,
  XHRResponseType,
  XHRAdapterConfig,
  TaroResponseType,
  TaroDataType,
  TaroAdapterConfig,
  FetchResponseMethod,
  FetchAdapterConfig,
  AdapterType,
  AdapterConfig,
  AlovaRequestBody,
} from './adapters';

export {
  convertResponseType,
  toAxiosResponseType,
  toUniAppResponseType,
  toXHRResponseType,
  toTaroResponseType,
  toFetchResponseMethod,
  convertRequestBody,
  needsConversion,
  safeConvertRequestBody,
} from './adapters';
