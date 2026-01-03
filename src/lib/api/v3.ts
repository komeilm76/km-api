import { z, ZodArray, ZodObject, ZodType, type AnyZodObject } from 'zod/v3';
import kmType from 'km-type';

// 🌐 HTTP Method Schema
// Defines all supported HTTP methods for API configuration
const methodSchema = z.union([
  z.literal('get'),
  z.literal('post'),
  z.literal('put'),
  z.literal('delete'),
  z.literal('head'),
  z.literal('options'),
  z.literal('patch'),
]);
type IMethod = z.infer<typeof methodSchema>;

// 📦 Response Type Schema
// Defines how the API response should be parsed
const responseTypeSchema = z.union([
  z.literal('array_buffer'),
  z.literal('blob'),
  z.literal('document'),
  z.literal('json'),
  z.literal('text'),
  z.literal('stream'),
  z.literal('form_data'),
]);

// 📤 Request Type Schema
// Defines the format of data being sent to the API
const requestTypeSchema = z.union([
  z.literal('form_data'),
  z.literal('url_search_params'),
  z.literal('json_object'),
  z.literal('blob'),
  z.literal('buffer_source'),
  z.literal('raw_string'),
  z.literal('readable_stream'),
]);

type IResponseType = z.infer<typeof responseTypeSchema>;
type IRequestType = z.infer<typeof requestTypeSchema>;

// 🔐 Authentication Status Schema
// Indicates whether the endpoint requires authentication
const authStatusSchema = z.union([z.literal('YES'), z.literal('NO')]);
type IAuthStatus = z.infer<typeof authStatusSchema>;

// 🚫 Disable Status Schema
// Allows temporarily disabling endpoints without removing configuration
const disableStatusSchema = z.union([z.literal('YES'), z.literal('NO')]);
type IDisableStatus = z.infer<typeof disableStatusSchema>;

// 🛣️ Path Schema
// Validates that API paths start with forward slash
const pathSchema = z.string().startsWith('/');
type IPath = z.infer<typeof pathSchema>;

// 🛣️ Tags Schema
// Validates that API tags
const tagsSchema = z.string().startsWith('#').array();
type ITags = z.infer<typeof tagsSchema>;

// 📝 Description Schema
// Optional text description for API endpoints
const descriptionSchema = z.string();
type IDescription = z.infer<typeof descriptionSchema>;

// 📋 Body Schema
// Zod schema for request body validation
const bodySchema = z.instanceof(ZodType);
type IBody = z.infer<typeof bodySchema>;

// 🔢 Params Schema
// Zod object schema for URL path parameters
const paramsSchema = z.instanceof(ZodObject);
type IParams = z.infer<typeof paramsSchema>;

// ❓ Query Schema
// Zod object schema for URL query parameters
const querySchema = z.instanceof(ZodObject);
type IQuery = z.infer<typeof querySchema>;

// ✅ Response Success Schema
// Zod schema for successful API responses
const responseSuccessSchema = z.instanceof(ZodType);
type IResponseSuccessData = z.infer<typeof responseSuccessSchema>;

// ❌ Response Error Schema
// Zod schema for error API responses
const responseErrorSchema = z.instanceof(ZodType);
type IResponseErrorData = z.infer<typeof responseErrorSchema>;

// 🏗️ API Configuration Entry Type
// Complete type definition for a single API endpoint configuration
type IMakeApiConfigEntry<
  METHOD extends IMethod = IMethod,
  PATH extends IPath = IPath,
  TAGS extends ITags = ITags,
  AUTH extends IAuthStatus = IAuthStatus,
  RESPONSE_TYPE extends IResponseType = IResponseType,
  REQUEST_TYPE extends IRequestType = IRequestType,
  DISABLE extends IDisableStatus = IDisableStatus,
  DESCRIPTION extends IDescription = IDescription,
  BODY extends IBody = IBody,
  PARAMS extends IParams = IParams,
  QUERY extends IQuery = IQuery,
  RESPONSE_SUCCESS_DATA extends IResponseSuccessData = IResponseSuccessData,
  RESPONSE_ERROR_DATA extends IResponseErrorData = IResponseErrorData
> = {
  method: METHOD;
  path: PATH;
  tags?: [...TAGS];
  auth?: AUTH;
  responseType?: RESPONSE_TYPE;
  requestType?: REQUEST_TYPE;
  disable?: DISABLE;
  description?: DESCRIPTION;
  request: {
    body: BODY;
    params: PARAMS;
    query: QUERY;
  };
  response: {
    success: RESPONSE_SUCCESS_DATA;
    error: RESPONSE_ERROR_DATA;
  };
};

// 🎯 Main API Configuration Factory
// Creates a fully typed API endpoint configuration with helper methods
const makeApiConfig = <
  METHOD extends IMethod,
  PATH extends IPath,
  TAGS extends ITags,
  AUTH extends IAuthStatus,
  RESPONSE_TYPE extends IResponseType,
  REQUEST_TYPE extends IRequestType,
  DISABLE extends IDisableStatus,
  DESCRIPTION extends IDescription,
  BODY extends IBody,
  PARAMS extends IParams,
  QUERY extends IQuery,
  RESPONSE_SUCCESS_DATA extends IResponseSuccessData,
  RESPONSE_ERROR_DATA extends IResponseErrorData,
  CONFIG extends IMakeApiConfigEntry<
    METHOD,
    PATH,
    TAGS,
    AUTH,
    RESPONSE_TYPE,
    REQUEST_TYPE,
    DISABLE,
    DESCRIPTION,
    BODY,
    PARAMS,
    QUERY,
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

  // 🔢 Create type-safe URL parameters
  const makeParams = <PARAMS extends z.infer<CONFIG['request']['params']>>(params: PARAMS) => {
    return params;
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

  return {
    ...entryConfig,
    makeParamsOrderedList,
    makeParamsStringShape,
    makeParamsString,
    makeFullPathShape,
    makeFullPath,
    makeBody,
    makeSuccessResponse,
    makeErrorResponse,
    makeQueries,
    makeParams,
  };
};

// 📊 Response Success Shape Factory
// Creates response wrappers for single items or lists with custom key names
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
    list: <AND extends AnyZodObject>(and: AND) => {
      let data = z.object({
        [key]: response,
      }) as unknown as ZodObject<{
        [key in KEY_OF_DATA]: ZodArray<RESPONSE>;
      }>;
      return data.merge(and);
    },
  };
};

// 📄 Pagination Schema Factory
// Standard pagination object for list responses
const paginationSchema = () => {
  return z.object({
    currentPage: z.number().min(1),
    totalItems: z.number().min(0),
    itemsPerPage: z.number().min(1),
  });
};

// 🎁 Export all utilities
export default {
  makeApiConfig,
  makeResponseSuccessShape,
  paginationSchema,
};
