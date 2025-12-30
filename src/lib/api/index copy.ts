import { z, ZodArray, ZodObject, ZodType } from 'zod/v4';
import kmType from 'km-type';

// method
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

// response type
const responseTypeSchema = z.union([
  z.literal('array_buffer'),
  z.literal('blob'),
  z.literal('document'),
  z.literal('json'),
  z.literal('text'),
  z.literal('stream'),
  z.literal('form_data'),
]);

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

// auth status
const authStatusSchema = z.union([z.literal('YES'), z.literal('NO')]);
type IAuthStatus = z.infer<typeof authStatusSchema>;

// disable status
const disableStatusSchema = z.union([z.literal('YES'), z.literal('NO')]);
type IDisableStatus = z.infer<typeof disableStatusSchema>;

// path
const pathSchema = z.string().startsWith('/');
type IPath = z.infer<typeof pathSchema>;

// description
const descriptionSchema = z.string();
type IDescription = z.infer<typeof descriptionSchema>;

// body
const bodySchema = z.instanceof(ZodType);
type IBody = z.infer<typeof bodySchema>;

// params
const paramsSchema = z.instanceof(ZodObject);
type IParams = z.infer<typeof paramsSchema>;

// query
const querySchema = z.instanceof(ZodObject);
type IQuery = z.infer<typeof querySchema>;

// response success
const responseSuccessSchema = z.instanceof(ZodType);
type IResponseSuccessData = z.infer<typeof responseSuccessSchema>;

// response error
const responseErrorSchema = z.instanceof(ZodType);
type IResponseErrorData = z.infer<typeof responseErrorSchema>;

type IMakeApiConfigEntry<
  METHOD extends IMethod = IMethod,
  PATH extends IPath = IPath,
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

const makeApiConfig = <
  METHOD extends IMethod,
  PATH extends IPath,
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
  const makeBody = <BODY extends z.infer<CONFIG['request']['body']>>(body: BODY) => {
    return body;
  };
  const makeSuccessResponse = <DATA extends z.infer<CONFIG['response']['success']>>(data: DATA) => {
    return data;
  };
  const makeErrorResponse = <DATA extends z.infer<CONFIG['response']['error']>>(data: DATA) => {
    return data;
  };
  const makeQueries = <QUERIES extends z.infer<CONFIG['request']['query']>>(queries: QUERIES) => {
    return queries;
  };
  const makeParams = <PARAMS extends z.infer<CONFIG['request']['params']>>(params: PARAMS) => {
    return params;
  };
  const makeParamsOrderedList = <
    KEY extends z.infer<ReturnType<CONFIG['request']['params']['keyof']>>,
    KEYS extends [...KEY[]]
  >(
    list: KEYS
  ) => {
    return list;
  };
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
  const makeParamsString = <PARAMS extends z.infer<CONFIG['request']['params']>>(
    params: PARAMS,
    orderList: (keyof PARAMS)[]
  ) => {
    return orderList.map((item) => `/${params[item]}`).join('');
  };
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
const makeResponseSuccessShape = <
  RESPONSE extends IResponseSuccessData,
  KEY_OF_DATA extends string
>(
  response: RESPONSE,
  key: KEY_OF_DATA = 'data' as KEY_OF_DATA
) => {
  return {
    item: () => {
      return z.object({
        [key]: response,
      }) as unknown as ZodObject<{
        [key in KEY_OF_DATA]: RESPONSE;
      }>;
    },
    list: <AND extends ZodObject>(and: AND) => {
      let data = z.object({
        [key]: response,
      }) as unknown as ZodObject<{
        [key in KEY_OF_DATA]: ZodArray<RESPONSE>;
      }>;
      return data.extend(and);
    },
  };
};

const paginationSchema = () => {
  return z.object({
    currentPage: z.number().min(1),
    totalItems: z.number().min(0),
    itemsPerPage: z.number().min(1),
  });
};

export default {
  makeApiConfig,
  makeResponseSuccessShape,
  paginationSchema,
};
