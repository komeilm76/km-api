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
  method: 'Get',
  path: '/example',
  tags: ['#example'],
  auth: 'NO',
  requestContentType: 'application/json',
  responseContentType: 'application/json',
  request: {
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    success: userSchema,
    error: errorSchema,
  },
});

// Exercise helpers so their types are validated
apiConfig.makeParamsOrderedList([]);
apiConfig.makeParamsStringShape([]);
apiConfig.makeFullPathShape([]);
apiConfig.makeOpenAPIPath([]);
apiConfig.makeBody({});
apiConfig.makeSuccessResponse({ id: '1', name: 'John' });
apiConfig.makeErrorResponse({ message: 'error' });
apiConfig.makeQueries({});
apiConfig.makeParams({});
apiConfig.makeHeaders({});
apiConfig.makeCookies({});
