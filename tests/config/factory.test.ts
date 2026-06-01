import { z } from 'zod';
import { makeApiConfig } from '../../src/config/factory';

// Minimal valid config used as a base across tests
const baseConfig = () =>
  makeApiConfig({
    method: 'GET',
    pathShape: '/users/{id}',
    auth: 'YES',
    responseContentType: 'application/json',
    summary: 'Get user',
    request: {
      body: z.any(),
      params: z.object({ id: z.string() }),
      query: z.object({ include: z.string().optional() }),
      headers: z.object({ 'x-api-key': z.string().optional() }),
      cookies: z.object({ sessionId: z.string().optional() }),
    },
    response: {
      200: z.object({ id: z.string(), name: z.string() }),
      404: z.object({ message: z.string() }),
    },
  });

describe('makeApiConfig', () => {
  it('returns the input config fields unchanged', () => {
    const config = baseConfig();
    expect(config.method).toBe('GET');
    expect(config.pathShape).toBe('/users/{id}');
    expect(config.auth).toBe('YES');
    expect(config.summary).toBe('Get user');
  });

  it('attaches all helper methods', () => {
    const config = baseConfig();
    expect(typeof config.makeBody).toBe('function');
    expect(typeof config.makeParams).toBe('function');
    expect(typeof config.makeQueries).toBe('function');
    expect(typeof config.makeHeaders).toBe('function');
    expect(typeof config.makeCookies).toBe('function');
    expect(typeof config.makeFullPath).toBe('function');
    expect(typeof config.makeOpenAPIPath).toBe('function');
    expect(typeof config.convertResponseType).toBe('function');
  });

  it('accepts optional fields: tags, description, disable, requestContentType, examples', () => {
    const config = makeApiConfig({
      method: 'POST',
      pathShape: '/users',
      tags: ['#users', '#admin'],
      auth: 'YES',
      disable: 'NO',
      requestContentType: 'application/json',
      responseContentType: 'application/json',
      summary: 'Create user',
      description: 'Creates a new user account.',
      request: {
        body: z.object({ name: z.string() }),
        params: z.object({}),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {
        201: z.object({ id: z.string() }),
      },
      examples: {
        request: {
          alice: { value: { name: 'Alice' }, summary: 'Create Alice' },
        },
        response: {
          201: { created: { value: { id: '1' }, summary: 'Created user' } },
        },
      },
    });

    expect(config.tags).toEqual(['#users', '#admin']);
    expect(config.disable).toBe('NO');
    expect(config.examples?.request?.alice?.summary).toBe('Create Alice');
    expect(config.examples?.response?.['201']?.created?.value).toEqual({ id: '1' });
  });
});

// ---- makeBody ---------------------------------------------------------------

describe('makeBody', () => {
  it('returns the body unchanged', () => {
    const config = makeApiConfig({
      method: 'POST',
      pathShape: '/users',
      request: {
        body: z.object({ name: z.string(), email: z.string() }),
        params: z.object({}),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    const body = config.makeBody({ name: 'Alice', email: 'alice@example.com' });
    expect(body).toEqual({ name: 'Alice', email: 'alice@example.com' });
  });
});

// ---- makeParams -------------------------------------------------------------

describe('makeParams', () => {
  it('returns path parameters unchanged', () => {
    const config = baseConfig();
    const params = config.makeParams({ id: 'abc-123' });
    expect(params).toEqual({ id: 'abc-123' });
  });
});

// ---- makeQueries ------------------------------------------------------------

describe('makeQueries', () => {
  it('returns query parameters unchanged', () => {
    const config = baseConfig();
    expect(config.makeQueries({ include: 'profile' })).toEqual({ include: 'profile' });
    expect(config.makeQueries({})).toEqual({});
  });
});

// ---- makeHeaders ------------------------------------------------------------

describe('makeHeaders', () => {
  it('returns headers unchanged', () => {
    const config = baseConfig();
    expect(config.makeHeaders({ 'x-api-key': 'secret' })).toEqual({ 'x-api-key': 'secret' });
  });
});

// ---- makeCookies ------------------------------------------------------------

describe('makeCookies', () => {
  it('returns cookies unchanged', () => {
    const config = baseConfig();
    expect(config.makeCookies({ sessionId: 'sess_1' })).toEqual({ sessionId: 'sess_1' });
  });
});

// ---- makeFullPath -----------------------------------------------------------

describe('makeFullPath', () => {
  it('replaces OpenAPI-style {param} placeholders', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/users/{id}/posts/{postId}',
      request: {
        body: z.any(),
        params: z.object({ id: z.string(), postId: z.string() }),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.makeFullPath({ id: '1', postId: '42' })).toBe('/users/1/posts/42');
  });

  it('replaces Express-style :param placeholders', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/users/:id/posts/:postId',
      request: {
        body: z.any(),
        params: z.object({ id: z.string(), postId: z.string() }),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.makeFullPath({ id: '1', postId: '42' })).toBe('/users/1/posts/42');
  });

  it('handles mixed syntax in the same path', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/users/:id/gholi/{username}',
      request: {
        body: z.any(),
        params: z.object({ id: z.string(), username: z.string() }),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.makeFullPath({ id: '7', username: 'alice' })).toBe('/users/7/gholi/alice');
  });

  it('returns path unchanged when there are no params', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/health',
      request: {
        body: z.any(),
        params: z.object({}),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.makeFullPath({})).toBe('/health');
  });

  it('does not replace partial param name matches', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/users/:userId/avatar',
      request: {
        body: z.any(),
        params: z.object({ userId: z.string() }),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.makeFullPath({ userId: '99' })).toBe('/users/99/avatar');
  });
});

// ---- makeOpenAPIPath --------------------------------------------------------

describe('makeOpenAPIPath', () => {
  it('converts :param to {param}', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/users/:userId/posts/:postId',
      request: {
        body: z.any(),
        params: z.object({ userId: z.string(), postId: z.string() }),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.makeOpenAPIPath()).toBe('/users/{userId}/posts/{postId}');
  });

  it('leaves {param} paths unchanged', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/users/{id}',
      request: {
        body: z.any(),
        params: z.object({ id: z.string() }),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.makeOpenAPIPath()).toBe('/users/{id}');
  });

  it('returns plain paths unchanged', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/health',
      request: {
        body: z.any(),
        params: z.object({}),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.makeOpenAPIPath()).toBe('/health');
  });
});

// ---- convertResponseType helper ---------------------------------------------

describe('convertResponseType (on config)', () => {
  it('returns axios config for json content type', () => {
    const config = baseConfig();
    expect(config.convertResponseType('axios')).toEqual({ responseType: 'json' });
  });

  it('returns fetch config for json content type', () => {
    const config = baseConfig();
    expect(config.convertResponseType('fetch')).toEqual({ responseMethod: 'json' });
  });

  it('returns blob for pdf content type with axios', () => {
    const config = makeApiConfig({
      method: 'GET',
      pathShape: '/files/{id}',
      responseContentType: 'application/pdf',
      request: {
        body: z.any(),
        params: z.object({ id: z.string() }),
        query: z.object({}),
        headers: z.object({}),
        cookies: z.object({}),
      },
      response: {},
    });

    expect(config.convertResponseType('axios')).toEqual({ responseType: 'blob' });
  });
});
