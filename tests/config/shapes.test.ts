import { z } from 'zod';
import { makeResponseSuccessShape, paginationSchema } from '../../src/config/shapes';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

// ---- makeResponseSuccessShape().item() -------------------------------------

describe('makeResponseSuccessShape — item()', () => {
  it('creates a schema wrapping data under the given key', () => {
    const schema = makeResponseSuccessShape(userSchema, 'user').item();
    const valid = { user: { id: '1', name: 'Alice', email: 'alice@example.com' } };
    expect(() => schema.parse(valid)).not.toThrow();
    expect(schema.parse(valid)).toEqual(valid);
  });

  it('uses "data" as the default key', () => {
    const schema = makeResponseSuccessShape(userSchema).item();
    const valid = { data: { id: '1', name: 'Bob', email: 'bob@example.com' } };
    expect(() => schema.parse(valid)).not.toThrow();
  });

  it('rejects input missing the key', () => {
    const schema = makeResponseSuccessShape(userSchema, 'user').item();
    expect(() => schema.parse({})).toThrow();
    expect(() => schema.parse({ data: {} })).toThrow(); // wrong key
  });

  it('rejects input that fails the inner schema', () => {
    const schema = makeResponseSuccessShape(userSchema, 'user').item();
    expect(() =>
      schema.parse({ user: { id: '1', name: 'Alice' } }) // missing email
    ).toThrow();
  });

  it('works with different key names', () => {
    const schemaA = makeResponseSuccessShape(userSchema, 'account').item();
    const schemaB = makeResponseSuccessShape(userSchema, 'profile').item();

    expect(() =>
      schemaA.parse({ account: { id: '1', name: 'Alice', email: 'a@b.com' } })
    ).not.toThrow();

    expect(() =>
      schemaB.parse({ profile: { id: '2', name: 'Bob', email: 'b@b.com' } })
    ).not.toThrow();
  });
});

// ---- makeResponseSuccessShape().list() -------------------------------------

describe('makeResponseSuccessShape — list()', () => {
  it('creates a schema with an array of items plus merged metadata', () => {
    const schema = makeResponseSuccessShape(userSchema, 'users').list(paginationSchema());

    const valid = {
      users: [
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' },
      ],
      currentPage: 1,
      totalItems: 2,
      itemsPerPage: 20,
    };

    expect(() => schema.parse(valid)).not.toThrow();
    expect(schema.parse(valid)).toMatchObject({ currentPage: 1, totalItems: 2 });
  });

  it('accepts an empty array', () => {
    const schema = makeResponseSuccessShape(userSchema, 'users').list(paginationSchema());
    expect(() =>
      schema.parse({ users: [], currentPage: 1, totalItems: 0, itemsPerPage: 20 })
    ).not.toThrow();
  });

  it('rejects if array items fail the inner schema', () => {
    const schema = makeResponseSuccessShape(userSchema, 'users').list(paginationSchema());
    expect(() =>
      schema.parse({
        users: [{ id: '1', name: 'Alice' }], // missing email
        currentPage: 1,
        totalItems: 1,
        itemsPerPage: 20,
      })
    ).toThrow();
  });

  it('works with custom metadata schemas', () => {
    const meta = z.object({ page: z.number(), total: z.number() });
    const schema = makeResponseSuccessShape(userSchema, 'items').list(meta);

    expect(() =>
      schema.parse({
        items: [{ id: '1', name: 'Alice', email: 'a@b.com' }],
        page: 1,
        total: 100,
      })
    ).not.toThrow();
  });
});

// ---- paginationSchema ------------------------------------------------------

describe('paginationSchema', () => {
  it('validates a complete pagination object', () => {
    const schema = paginationSchema();
    const valid = { currentPage: 1, totalItems: 100, itemsPerPage: 20, totalPages: 5 };
    expect(schema.parse(valid)).toEqual(valid);
  });

  it('makes totalPages optional', () => {
    const schema = paginationSchema();
    const withoutTotal = { currentPage: 1, totalItems: 100, itemsPerPage: 20 };
    expect(() => schema.parse(withoutTotal)).not.toThrow();
  });

  it('rejects currentPage less than 1', () => {
    const schema = paginationSchema();
    expect(() =>
      schema.parse({ currentPage: 0, totalItems: 0, itemsPerPage: 20 })
    ).toThrow();
  });

  it('rejects itemsPerPage less than 1', () => {
    const schema = paginationSchema();
    expect(() =>
      schema.parse({ currentPage: 1, totalItems: 0, itemsPerPage: 0 })
    ).toThrow();
  });

  it('rejects totalItems less than 0', () => {
    const schema = paginationSchema();
    expect(() =>
      schema.parse({ currentPage: 1, totalItems: -1, itemsPerPage: 20 })
    ).toThrow();
  });

  it('rejects totalPages less than 0 when provided', () => {
    const schema = paginationSchema();
    expect(() =>
      schema.parse({ currentPage: 1, totalItems: 0, itemsPerPage: 20, totalPages: -1 })
    ).toThrow();
  });

  it('requires integer values', () => {
    const schema = paginationSchema();
    expect(() =>
      schema.parse({ currentPage: 1.5, totalItems: 10, itemsPerPage: 20 })
    ).toThrow();
  });

  it('returns a fresh schema on each call', () => {
    const s1 = paginationSchema();
    const s2 = paginationSchema();
    // Each call returns an independent schema instance
    expect(s1).not.toBe(s2);
  });
});
