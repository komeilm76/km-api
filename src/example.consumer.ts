import { z } from 'zod';

import {
  makeApiConfig,
  requestContentTypeSchema,
  responseContentTypeSchema,
  methodSchema,
  pathSchema,
} from './index';

// Simple consumer-style usage to ensure public types work with `zod`

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const errorSchema = z.object({
  message: z.string(),
});

// Use the literal schemas just to ensure they type-check in a consumer scenario
const method = methodSchema._def.values[0]!;
const path = pathSchema.parse('/example');
const requestContentType = requestContentTypeSchema._def.values[0];
const responseContentType = responseContentTypeSchema._def.values[0];

const apiConfig = makeApiConfig({
  method,
  path,
  tags: ['#example'],
  auth: 'NO',
  requestContentType,
  responseContentType,
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

