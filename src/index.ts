import z from 'zod';
import lib from './lib';
const kmApi = lib as typeof lib;
export default kmApi;

const ccc = kmApi.v43.makeApiConfig({
  method: 'get',
  path: '/test',
  request: {
    body: z.object({
      test_body: z.string(),
    }),
    params: z.object({
      test_params: z.string(),
    }),
    query: z.object({
      test_query: z.string(),
    }),
    headers: z.object({
      test_headers: z.string(),
    }),
    cookies: z.object({
      test_cookies: z.string(),
    }),
  },
  response: {
    success: z.object({}),
    error: z.object({}),
  },
  auth: 'YES',
  disable: 'NO',
  summary: '',
  description: '',
  tags: ['#s'],
  requestContentType: 'multipart/form-data',
  responseContentType: 'multipart/form-data',
});

const x = kmApi.v43.adapters.safeConvertRequestBody(
  { name: 'mohammad' },
  'application/octet-stream'
);
console.log('x', x);

const y = ccc.convertResponseType('alova-axios');
console.log('y', y);
