import {
  convertRequestBody,
  convertResponseType,
  convertResponseTypes,
  needsConversion,
  safeConvertRequestBody,
  toAxiosResponseType,
  toFetchResponseMethod,
  toTaroResponseType,
  toUniAppResponseType,
  toXHRResponseType,
} from './lib/api/adapters';
import {
  authStatusSchema,
  bodySchema,
  cookiesSchema,
  descriptionSchema,
  disableStatusSchema,
  headersSchema,
  httpStatusCodeSchema,
  methodSchema,
  paramsSchema,
  pathSchema,
  querySchema,
  requestContentTypeSchema,
  responseContentTypeSchema,
  responseErrorSchema,
  responseSuccessSchema,
  summarySchema,
  tagsSchema,
} from './lib/api-new/schemas';
import { makeApiConfig, makeResponseSuccessShape, paginationSchema } from './lib/api-new/v4';

export {
  makeApiConfig,
  makeResponseSuccessShape,
  paginationSchema,
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
  // Response type conversion
  convertResponseType,
  convertResponseTypes,
  toAxiosResponseType,
  toUniAppResponseType,
  toXHRResponseType,
  toTaroResponseType,
  toFetchResponseMethod,

  // Request body conversion
  convertRequestBody,
  safeConvertRequestBody,
  needsConversion,
};

// const config = makeApiConfig({
//   method: 'DELETE',
//   path: '/admin/AgeRange/get',
//   tags: ['#test'],
//   disable: 'YES',
//   auth: 'YES',
//   summary: 'summary',
//   description: 'desc',
//   requestContentType: 'application/graphql',
//   responseContentType: 'application/json',
//   request: {
//     body: z.object({
//       age: z.number(),
//     }),
//     params: z.object({
//       name: z.string(),
//       id: z.string(),
//     }),
//     query: z.object({}),
//     headers: z.object({}),
//     cookies: z.object({}),
//   },
//   response: {
//     success: z.object({}),
//     error: z.object({}),
//   },
// });
// const test1 = config.makeParamsOrderedList(['name', 'id']);
// const test2 = config.makeParamsStringShape(['name', 'id']);
// const test3 = config.makeParamsString({ id: '12', name: 'amir' }, ['id', 'name']);
// const test4 = config.makeFullPathShape(['id', 'name']);
// const test5 = config.makeFullPath({ id: '12', name: 'amir' }, ['id', 'name']);
// const test7 = config.makeBody({ age: 12 });
// const test8 = config.makeSuccessResponse({});
// const test9 = config.makeErrorResponse({});
// const test10 = config.makeQueries({});
// const test11 = config.makeParams({ id: '12', name: 'amir' });
// const test12 = config.makeHeaders({});
// const test13 = config.makeCookies({});
// const test14 = config.convertResponseType('alova-axios');

// console.log('test1', test1);

// console.log('test2', test2);

// console.log('test3', test3);

// console.log('test4', test4);

// console.log('test5', test5);

// console.log('test7', test7);

// console.log('test8', test8);

// console.log('test9', test9);

// console.log('test10', test10);

// console.log('test11', test11);

// console.log('test12', test12);

// console.log('test13', test13);

// console.log('test14', test14);
