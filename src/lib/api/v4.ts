import { z, ZodArray, ZodObject, type ZodRawShape } from 'zod/v4';
import kmType from 'km-type';
import { convertResponseType as _convertResponseType, type AdapterType } from './adapters';
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
  // const makeParamsStringShape = <
  //   KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
  //   LIST extends KEY[]
  // >(
  //   list: [...LIST]
  // ) => {
  //   return list
  //     .map((item) => `/:${item}`)
  //     .join('') as unknown as kmType.Advanced.JoinListOfStringInStart<[...LIST], '/:'>;
  // };

  // 🔗 Generate parameter string from values
  const makeParamsString = <PARAMS extends z.infer<CONFIG['request']['params']>>(
    params: PARAMS,
    orderList: (keyof PARAMS)[]
  ) => {
    return orderList.map((item) => `/${params[item]}`).join('');
  };

  // 🛣️ Generate full path shape with parameters
  // Converts /users/:userId format to match OpenAPI path templating
  // const makeFullPathShape = <
  //   KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
  //   LIST extends KEY[]
  // >(
  //   list: [...LIST]
  // ) => {
  //   let paramsShape = list
  //     .map((item) => `/:${item}`)
  //     .join('') as unknown as kmType.Advanced.JoinListOfStringInStart<[...LIST], '/:'>;

  //   let output = `${entryConfig.path}${paramsShape}`;
  //   return output as `${CONFIG['path']}${kmType.Advanced.JoinListOfStringInStart<[...LIST], '/:'>}`;
  // };

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
  // const makeOpenAPIPath = <
  //   KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
  //   LIST extends KEY[]
  // >(
  //   list: [...LIST]
  // ) => {
  //   let paramsShape = list.map((item) => `/{${item}}`).join('');
  //   return `${entryConfig.path}${paramsShape}`;
  // };

  const convertResponseType = (adapterType: AdapterType) => {
    return _convertResponseType(entryConfig.responseContentType!, adapterType);
  };

  return {
    ...entryConfig,
    makeParamsOrderedList,
    // makeParamsStringShape,
    makeParamsString,
    // makeFullPathShape,
    makeFullPath,
    // makeOpenAPIPath,
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

// 🎁 Export all utilities
export { makeApiConfig, makeResponseSuccessShape, paginationSchema };
