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

const apiConfig = kmApi.v4.makeApiConfig({
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
    success: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
    error: z.object({
      code: z.number(),
      message: z.string(),
    }),
  },
});

// Exercise helpers so their types are validated
apiConfig.makeOpenAPIPath();
apiConfig.makeBody({ age: 12, name: 'john' });
apiConfig.makeSuccessResponse({ id: '123', name: 'john', email: 'john@example.com' });
apiConfig.makeErrorResponse({ code: 404, message: 'User not found' });
apiConfig.makeQueries({});
apiConfig.makeParams({ id: '123', username: 'john_doe' });
apiConfig.makeHeaders({ 'x-api-key': 'secret-key' });
apiConfig.makeCookies({ sessionId: 'session-123' });
