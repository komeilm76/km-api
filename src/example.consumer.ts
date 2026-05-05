import { z } from 'zod';

import { kmApi } from './';

// Simple consumer-style usage to ensure public types work with `zod`

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const errorSchema = z.object({
  message: z.string(),
});

const apiConfig = kmApi.apiConfig.makeApiConfig({
  method: 'get',
  pathShape: '/users/:id/gholi/:username',
  tags: ['#users'],
  auth: 'YES',
  responseContentType: 'application/json',
  summary: 'Get user by ID',
  description: 'Retrieves a user by their unique identifier',
  request: {
    body: z.object({
      name: z.string(),
      age: z.number(),
    }),
    params: z.object({ id: z.string(), username: z.string() }),
    query: z.object({
      search: z.string().optional(),
    }),
    headers: z.object({
      'x-api-key': z.string().optional(),
    }),
    cookies: z.object({
      sessionId: z.string().optional(),
    }),
  },
  response: {
    '200': z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
    '400': z.object({
      code1: z.number(),
      message2: z.string(),
    }),
    '401': z.object({
      code2: z.number(),
      message2: z.string(),
    }),
    '402': z.object({
      code3: z.number(),
      message3: z.string(),
    }),
    '403': z.object({
      code4: z.number(),
      message4: z.string(),
    }),
  },
});

// Exercise helpers so their types are validated
apiConfig.makeOpenAPIPath();
apiConfig.makeBody({ age: 12, name: 'john' });
apiConfig.makeQueries({});
apiConfig.makeParams({ id: '123', username: 'john_doe' });
apiConfig.makeHeaders({ 'x-api-key': 'secret-key' });
apiConfig.makeCookies({ sessionId: 'session-123' });
