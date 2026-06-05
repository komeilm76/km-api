/**
 * Basic usage example for km-api.
 *
 * Run with: npx ts-node examples/basic.ts
 */
import { z } from 'zod';
import {
  makeApiConfig,
  makeResponseSuccessShape,
  paginationSchema,
  convertRequestBody,
} from '../src';

// ---- Define schemas -------------------------------------------------------

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
});

const errorSchema = z.object({
  message: z.string(),
  code: z.number().int(),
});

// ---- GET /users/:id -------------------------------------------------------

const getUser = makeApiConfig({
  method: 'GET',
  pathShape: '/users/:id',
  tags: ['#users'],
  auth: 'YES',
  responseContentType: 'application/json',
  summary: 'Get user by ID',
  description: 'Retrieves a single user by their unique identifier.',
  request: {
    body: z.any(),
    params: z.object({ id: z.string().uuid() }),
    query: z.object({ include: z.enum(['profile', 'settings']).optional() }),
    headers: z.object({ 'x-api-key': z.string().optional() }),
    cookies: z.object({ sessionId: z.string().optional() }),
  },
  response: {
    200: userSchema,
    404: errorSchema,
  },
  examples: {
    response: {
      200: {
        found: { value: { id: 'abc-123', name: 'Alice', email: 'alice@example.com' } },
      },
      404: {
        notFound: { value: { message: 'User not found', code: 404 } },
      },
    },
  },
});

// Use helpers
const params = getUser.makeParams({ id: '550e8400-e29b-41d4-a716-446655440000' });
const path = getUser.makeFullPath(params);
const openApiPath = getUser.makeOpenAPIPath();
const axiosCfg = getUser.convertResponseType('axios');

console.log('Path         :', path);        // /users/550e8400-e29b-41d4-a716-446655440000
console.log('OpenAPI path :', openApiPath); // /users/{id}
console.log('Axios config :', axiosCfg);   // { responseType: 'json' }

// ---- GET /users (paginated list) ------------------------------------------

const listUsers = makeApiConfig({
  method: 'GET',
  pathShape: '/users',
  auth: 'YES',
  responseContentType: 'application/json',
  summary: 'List users',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({ page: z.number().int().min(1).optional() }),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    200: makeResponseSuccessShape(userSchema, 'users').list(paginationSchema()),
  },
});

const queries = listUsers.makeQueries({ page: 2 });
console.log('Queries      :', queries); // { page: 2 }

// ---- POST /users ----------------------------------------------------------

const createUser = makeApiConfig({
  method: 'POST',
  pathShape: '/users',
  auth: 'YES',
  requestContentType: 'application/json',
  responseContentType: 'application/json',
  summary: 'Create user',
  request: {
    body: z.object({ name: z.string(), email: z.string().email() }),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    201: userSchema,
    422: errorSchema,
  },
  examples: {
    request: {
      alice: { value: { name: 'Alice', email: 'alice@example.com' }, summary: 'Create Alice' },
    },
  },
});

const body = createUser.makeBody({ name: 'Bob', email: 'bob@example.com' });
const serialised = convertRequestBody(body, 'application/json');
console.log('Serialised body:', serialised); // '{"name":"Bob","email":"bob@example.com"}'
