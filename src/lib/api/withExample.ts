import { AnyZodObject, z, ZodArray, ZodObject, ZodType } from 'zod';
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
  z.literal('arraybuffer'),
  z.literal('blob'),
  z.literal('document'),
  z.literal('json'),
  z.literal('text'),
  z.literal('stream'),
  z.literal('formdata'),
]);
type IResponseType = z.infer<typeof responseTypeSchema>;

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

// response
const responseSchema = z.instanceof(ZodType);
type IResponseData = z.infer<typeof responseSchema>;

type IMakeApiConfigEntry<
  METHOD extends IMethod = IMethod,
  PATH extends IPath = IPath,
  AUTH extends IAuthStatus = IAuthStatus,
  RESPONSE_TYPE extends IResponseType = IResponseType,
  DISABLE extends IDisableStatus = IDisableStatus,
  DESCRIPTION extends IDescription = IDescription,
  BODY extends IBody = IBody,
  PARAMS extends IParams = IParams,
  QUERY extends IQuery = IQuery,
  RESPONSE_DATA extends IResponseData = IResponseData
> = {
  method: METHOD;
  path: PATH;
  auth?: AUTH;
  responseType?: RESPONSE_TYPE;
  disable?: DISABLE;
  description?: DESCRIPTION;
  request: {
    body: BODY;
    params: PARAMS;
    query: QUERY;
  };
  response: {
    data: RESPONSE_DATA;
  };
};

const makeApiConfig = <
  METHOD extends IMethod,
  PATH extends IPath,
  AUTH extends IAuthStatus,
  RESPONSE_TYPE extends IResponseType,
  DISABLE extends IDisableStatus,
  DESCRIPTION extends IDescription,
  BODY extends IBody,
  PARAMS extends IParams,
  QUERY extends IQuery,
  RESPONSE_DATA extends IResponseData,
  CONFIG extends IMakeApiConfigEntry<
    METHOD,
    PATH,
    AUTH,
    RESPONSE_TYPE,
    DISABLE,
    DESCRIPTION,
    BODY,
    PARAMS,
    QUERY,
    RESPONSE_DATA
  >
>(
  entryConfig: CONFIG
) => {
  const makeBody = <BODY extends z.infer<CONFIG['request']['body']>>(body: BODY) => {
    return body;
  };
  const makeResponse = <DATA extends z.infer<CONFIG['response']['data']>>(data: DATA) => {
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
  const makeExamples = (data: {
    exampleOfRequestBody?: z.infer<CONFIG['request']['body']>;
    exampleOfRequestParms?: z.infer<CONFIG['request']['params']>;
    exampleOfRequestQuery?: z.infer<CONFIG['request']['query']>;
    exampleOfResponseData?: z.infer<CONFIG['response']['data']>;
  }) => {
    const examples = {
      ...data,
    };
    return {
      ...entryConfig,
      examples,
      makeParamsOrderedList,
      makeParamsStringShape,
      makeParamsString,
      makeFullPathShape,
      makeFullPath,
      makeBody,
      makeResponse,
      makeQueries,
      makeParams,
    };
  };

  return {
    ...entryConfig,
    makeParamsOrderedList,
    makeParamsStringShape,
    makeParamsString,
    makeFullPathShape,
    makeFullPath,
    makeBody,
    makeResponse,
    makeQueries,
    makeParams,
    makeExamples,
  };
};
const makeResponseShape = <RESPONSE extends IResponseData, KEY_OF_DATA extends string>(
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

const paginationSchema = () => {
  return z.object({
    currentPage: z.number().min(1),
    totalItems: z.number().min(0),
    itemsPerPage: z.number().min(1),
  });
};

export default {
  withExample: {
    makeApiConfig,
    makeResponseShape,
    paginationSchema,
  },
};
