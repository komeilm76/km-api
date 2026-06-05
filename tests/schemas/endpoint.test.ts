import { z } from 'zod';
import {
  pathSchema,
  tagsSchema,
  summarySchema,
  descriptionSchema,
  bodySchema,
  paramsSchema,
  querySchema,
  headersSchema,
  cookiesSchema,
  responseSuccessSchema,
  responseErrorSchema,
} from '../../src/schemas/endpoint';

describe('pathSchema', () => {
  it('accepts paths that start with /', () => {
    expect(pathSchema.parse('/')).toBe('/');
    expect(pathSchema.parse('/users')).toBe('/users');
    expect(pathSchema.parse('/users/123')).toBe('/users/123');
    expect(pathSchema.parse('/users/{id}')).toBe('/users/{id}');
    expect(pathSchema.parse('/users/:id')).toBe('/users/:id');
    expect(pathSchema.parse('/api/v1/users/{id}/posts/:postId')).toBeTruthy();
  });

  it('rejects paths that do not start with /', () => {
    expect(() => pathSchema.parse('users')).toThrow();
    expect(() => pathSchema.parse('api/users')).toThrow();
    expect(() => pathSchema.parse('')).toThrow();
  });
});

describe('tagsSchema', () => {
  it('accepts arrays of # prefixed strings', () => {
    expect(tagsSchema.parse(['#users'])).toEqual(['#users']);
    expect(tagsSchema.parse(['#users', '#admin'])).toEqual(['#users', '#admin']);
    expect(tagsSchema.parse([])).toEqual([]);
  });

  it('rejects tags without # prefix', () => {
    expect(() => tagsSchema.parse(['users'])).toThrow();
    expect(() => tagsSchema.parse(['users', '#admin'])).toThrow();
  });

  it('rejects non-array input', () => {
    expect(() => tagsSchema.parse('#users')).toThrow();
  });
});

describe('summarySchema', () => {
  it('accepts any string', () => {
    expect(summarySchema.parse('Get user by ID')).toBe('Get user by ID');
    expect(summarySchema.parse('')).toBe('');
  });

  it('rejects non-string values', () => {
    expect(() => summarySchema.parse(42)).toThrow();
    expect(() => summarySchema.parse(null)).toThrow();
  });
});

describe('descriptionSchema', () => {
  it('accepts any string including multi-line', () => {
    const text = 'Retrieves a user.\n\nRequires authentication.\nRate limited.';
    expect(descriptionSchema.parse(text)).toBe(text);
  });
});

describe('bodySchema', () => {
  it('accepts ZodType instances', () => {
    expect(() => bodySchema.parse(z.string())).not.toThrow();
    expect(() => bodySchema.parse(z.object({ name: z.string() }))).not.toThrow();
    expect(() => bodySchema.parse(z.any())).not.toThrow();
    expect(() => bodySchema.parse(z.array(z.number()))).not.toThrow();
  });

  it('rejects non-ZodType values', () => {
    expect(() => bodySchema.parse({})).toThrow();
    expect(() => bodySchema.parse('string')).toThrow();
    expect(() => bodySchema.parse(null)).toThrow();
  });
});

describe('paramsSchema', () => {
  it('accepts ZodObject instances', () => {
    expect(() => paramsSchema.parse(z.object({ id: z.string() }))).not.toThrow();
    expect(() => paramsSchema.parse(z.object({}))).not.toThrow();
  });

  it('rejects ZodType instances that are not ZodObject', () => {
    expect(() => paramsSchema.parse(z.string())).toThrow();
    expect(() => paramsSchema.parse(z.array(z.string()))).toThrow();
    expect(() => paramsSchema.parse({})).toThrow();
  });
});

describe('querySchema', () => {
  it('accepts ZodObject instances', () => {
    expect(() =>
      querySchema.parse(z.object({ page: z.number().optional() }))
    ).not.toThrow();
  });
});

describe('headersSchema', () => {
  it('accepts ZodObject instances', () => {
    expect(() =>
      headersSchema.parse(z.object({ 'x-api-key': z.string() }))
    ).not.toThrow();
  });
});

describe('cookiesSchema', () => {
  it('accepts ZodObject instances', () => {
    expect(() =>
      cookiesSchema.parse(z.object({ sessionId: z.string() }))
    ).not.toThrow();
  });
});

describe('responseSuccessSchema', () => {
  it('accepts any ZodType', () => {
    expect(() => responseSuccessSchema.parse(z.object({ id: z.string() }))).not.toThrow();
    expect(() => responseSuccessSchema.parse(z.string())).not.toThrow();
    expect(() => responseSuccessSchema.parse(z.array(z.any()))).not.toThrow();
  });
});

describe('responseErrorSchema', () => {
  it('accepts any ZodType', () => {
    expect(() =>
      responseErrorSchema.parse(z.object({ message: z.string(), code: z.number() }))
    ).not.toThrow();
  });
});
