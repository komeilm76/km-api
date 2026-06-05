import {
  methodSchema,
  authStatusSchema,
  disableStatusSchema,
  httpStatusCodeSchema,
  successStatusCodes,
  redirectionStatusCodes,
  clientErrorStatusCodes,
  serverErrorStatusCodes,
  httpStatusCodes,
} from '../../src/schemas/http';

describe('methodSchema', () => {
  it('accepts lowercase methods', () => {
    expect(methodSchema.parse('get')).toBe('get');
    expect(methodSchema.parse('post')).toBe('post');
    expect(methodSchema.parse('put')).toBe('put');
    expect(methodSchema.parse('delete')).toBe('delete');
    expect(methodSchema.parse('patch')).toBe('patch');
    expect(methodSchema.parse('head')).toBe('head');
    expect(methodSchema.parse('options')).toBe('options');
  });

  it('accepts uppercase methods', () => {
    expect(methodSchema.parse('GET')).toBe('GET');
    expect(methodSchema.parse('POST')).toBe('POST');
    expect(methodSchema.parse('PUT')).toBe('PUT');
    expect(methodSchema.parse('DELETE')).toBe('DELETE');
    expect(methodSchema.parse('PATCH')).toBe('PATCH');
    expect(methodSchema.parse('HEAD')).toBe('HEAD');
    expect(methodSchema.parse('OPTIONS')).toBe('OPTIONS');
  });

  it('accepts capitalised methods', () => {
    expect(methodSchema.parse('Get')).toBe('Get');
    expect(methodSchema.parse('Post')).toBe('Post');
    expect(methodSchema.parse('Put')).toBe('Put');
    expect(methodSchema.parse('Delete')).toBe('Delete');
    expect(methodSchema.parse('Patch')).toBe('Patch');
  });

  it('rejects invalid methods', () => {
    expect(() => methodSchema.parse('FETCH')).toThrow();
    expect(() => methodSchema.parse('connect')).toThrow();
    expect(() => methodSchema.parse('')).toThrow();
    expect(() => methodSchema.parse('getPost')).toThrow();
  });
});

describe('authStatusSchema', () => {
  it('accepts YES', () => {
    expect(authStatusSchema.parse('YES')).toBe('YES');
  });

  it('accepts NO', () => {
    expect(authStatusSchema.parse('NO')).toBe('NO');
  });

  it('rejects anything else', () => {
    expect(() => authStatusSchema.parse('yes')).toThrow();
    expect(() => authStatusSchema.parse('no')).toThrow();
    expect(() => authStatusSchema.parse('true')).toThrow();
    expect(() => authStatusSchema.parse('')).toThrow();
  });
});

describe('disableStatusSchema', () => {
  it('accepts YES and NO', () => {
    expect(disableStatusSchema.parse('YES')).toBe('YES');
    expect(disableStatusSchema.parse('NO')).toBe('NO');
  });

  it('rejects invalid values', () => {
    expect(() => disableStatusSchema.parse('disabled')).toThrow();
  });
});

describe('httpStatusCodeSchema', () => {
  it('accepts all 2xx success codes', () => {
    for (const code of successStatusCodes) {
      expect(httpStatusCodeSchema.parse(code)).toBe(code);
    }
  });

  it('accepts all 3xx redirection codes', () => {
    for (const code of redirectionStatusCodes) {
      expect(httpStatusCodeSchema.parse(code)).toBe(code);
    }
  });

  it('accepts all 4xx client error codes', () => {
    for (const code of clientErrorStatusCodes) {
      expect(httpStatusCodeSchema.parse(code)).toBe(code);
    }
  });

  it('accepts all 5xx server error codes', () => {
    for (const code of serverErrorStatusCodes) {
      expect(httpStatusCodeSchema.parse(code)).toBe(code);
    }
  });

  it('accepts common codes individually', () => {
    expect(httpStatusCodeSchema.parse(200)).toBe(200);
    expect(httpStatusCodeSchema.parse(201)).toBe(201);
    expect(httpStatusCodeSchema.parse(204)).toBe(204);
    expect(httpStatusCodeSchema.parse(400)).toBe(400);
    expect(httpStatusCodeSchema.parse(401)).toBe(401);
    expect(httpStatusCodeSchema.parse(403)).toBe(403);
    expect(httpStatusCodeSchema.parse(404)).toBe(404);
    expect(httpStatusCodeSchema.parse(422)).toBe(422);
    expect(httpStatusCodeSchema.parse(500)).toBe(500);
  });

  it('rejects non-standard codes', () => {
    expect(() => httpStatusCodeSchema.parse(0)).toThrow();
    expect(() => httpStatusCodeSchema.parse(100)).toThrow();
    expect(() => httpStatusCodeSchema.parse(199)).toThrow();
    expect(() => httpStatusCodeSchema.parse(999)).toThrow();
    expect(() => httpStatusCodeSchema.parse(-1)).toThrow();
  });

  it('rejects string representations of status codes', () => {
    expect(() => httpStatusCodeSchema.parse('200')).toThrow();
    expect(() => httpStatusCodeSchema.parse('404')).toThrow();
  });
});

describe('status code constants', () => {
  it('successStatusCodes contains 200–206', () => {
    expect(successStatusCodes).toContain(200);
    expect(successStatusCodes).toContain(201);
    expect(successStatusCodes).toContain(204);
  });

  it('clientErrorStatusCodes contains common 4xx codes', () => {
    expect(clientErrorStatusCodes).toContain(400);
    expect(clientErrorStatusCodes).toContain(401);
    expect(clientErrorStatusCodes).toContain(403);
    expect(clientErrorStatusCodes).toContain(404);
    expect(clientErrorStatusCodes).toContain(422);
  });

  it('httpStatusCodes is the union of all categories', () => {
    const all = [
      ...successStatusCodes,
      ...redirectionStatusCodes,
      ...clientErrorStatusCodes,
      ...serverErrorStatusCodes,
    ];
    expect(httpStatusCodes).toEqual(all);
  });

  it('each category has no duplicates', () => {
    const seen = new Set<number>();
    for (const code of httpStatusCodes) {
      expect(seen.has(code)).toBe(false);
      seen.add(code);
    }
  });
});
