import { z, ZodArray, ZodObject, type ZodRawShape } from 'zod';
import type { IResponseSuccessData } from '../schemas';

/**
 * Creates a response wrapper factory for single items or paginated lists.
 *
 * @param response - Zod schema for the response data entity
 * @param key      - Key name used to wrap the data (default: `'data'`)
 * @returns        Object with `item()` and `list(meta)` builder methods
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { makeResponseSuccessShape, paginationSchema } from 'km-api';
 *
 * const userSchema = z.object({ id: z.string(), name: z.string() });
 * const userShape = makeResponseSuccessShape(userSchema, 'user');
 *
 * // Single item: { user: { id, name } }
 * const singleSchema = userShape.item();
 *
 * // Paginated list: { users: [...], currentPage, totalItems, itemsPerPage }
 * const listSchema = userShape.list(paginationSchema());
 * ```
 */
const makeResponseSuccessShape = <
  RESPONSE extends IResponseSuccessData,
  KEY extends string,
>(
  response: RESPONSE,
  key: KEY = 'data' as KEY
) => {
  return {
    /**
     * Wraps the schema in `{ [key]: schema }`.
     *
     * @example
     * ```typescript
     * makeResponseSuccessShape(userSchema, 'user').item();
     * // ZodObject<{ user: userSchema }>
     * ```
     */
    item: () =>
      z.object({ [key]: response }) as unknown as ZodObject<{ [K in KEY]: RESPONSE }>,

    /**
     * Wraps an array of the schema and merges additional fields (e.g. pagination).
     *
     * @param and - Additional Zod object to merge (e.g. `paginationSchema()`)
     *
     * @example
     * ```typescript
     * makeResponseSuccessShape(userSchema, 'users').list(paginationSchema());
     * // ZodObject<{ users: ZodArray<userSchema>, currentPage, totalItems, itemsPerPage }>
     * ```
     */
    list: <AND extends ZodObject<ZodRawShape>>(and: AND) => {
      const data = z.object({ [key]: z.array(response) }) as unknown as ZodObject<{
        [K in KEY]: ZodArray<RESPONSE>;
      }>;
      return data.merge(and);
    },
  };
};

/**
 * Standard pagination metadata schema for list responses.
 *
 * Fields:
 * - `currentPage`  — current page number (≥ 1)
 * - `totalItems`   — total number of items across all pages (≥ 0)
 * - `itemsPerPage` — items per page (≥ 1)
 * - `totalPages`   — optional total page count (≥ 0)
 *
 * @example
 * ```typescript
 * const listResponse = makeResponseSuccessShape(userSchema, 'users')
 *   .list(paginationSchema());
 *
 * // Validates:
 * // {
 * //   users: [{ id: '1', name: 'Alice' }],
 * //   currentPage: 1,
 * //   totalItems: 42,
 * //   itemsPerPage: 20,
 * //   totalPages: 3
 * // }
 * ```
 */
const paginationSchema = () =>
  z.object({
    currentPage: z.number().int().min(1),
    totalItems: z.number().int().min(0),
    itemsPerPage: z.number().int().min(1),
    totalPages: z.number().int().min(0).optional(),
  });

export { makeResponseSuccessShape, paginationSchema };
