import z from 'zod';
import lib from './lib';
const kmApi = lib as typeof lib;
export default kmApi;

const schema = kmApi.makeApiConfig({
  path: `/origin`,
  method: 'get',
  auth: 'YES',
  disable: 'NO',
  request: {
    body: z.object({
      name: z.string(),
      age: z.number(),
    }),
    params: z.object({
      page: z.number(),
    }),
    query: z.object({
      search: z.string(),
    }),
  },
  response: {
    success: z.array(
      z.object({
        date: z.string(),
        temperatureC: z.number().int(),
        temperatureF: z.number().int(),
        summary: z.string().nullable(),
      })
    ),
    error: z.object({}),
  },
});
