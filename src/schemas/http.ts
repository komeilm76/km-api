import z from 'zod';

/**
 * HTTP Method Schema
 *
 * All valid HTTP methods with case-insensitive support (lowercase, UPPERCASE, Capitalized).
 *
 * @reference https://swagger.io/specification/#operation-object
 */
const methodSchema = z.enum([
  'get',
  'GET',
  'Get',
  'post',
  'POST',
  'Post',
  'put',
  'PUT',
  'Put',
  'delete',
  'DELETE',
  'Delete',
  'head',
  'HEAD',
  'Head',
  'options',
  'OPTIONS',
  'Options',
  'patch',
  'PATCH',
  'Patch',
] as const);

type IMethod = z.infer<typeof methodSchema>;

/**
 * Authentication Status Schema
 *
 * Simple YES/NO flag indicating whether an endpoint requires authentication.
 *
 * @reference https://swagger.io/specification/#security-scheme-object
 */
const authStatusSchema = z.enum(['YES', 'NO'] as const);
type IAuthStatus = z.infer<typeof authStatusSchema>;

/**
 * Disable Status Schema
 *
 * Custom flag for marking endpoints as disabled or deprecated.
 * Not part of the official OpenAPI specification.
 */
const disableStatusSchema = z.enum(['YES', 'NO'] as const);
type IDisableStatus = z.infer<typeof disableStatusSchema>;

/**
 * HTTP Status Code constants grouped by category.
 *
 * @reference https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */
const successStatusCodes = [200, 201, 202, 203, 204, 205, 206] as const;
const redirectionStatusCodes = [300, 301, 302, 303, 304, 307, 308] as const;
const clientErrorStatusCodes = [
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418,
  422, 423, 424, 425, 426, 428, 429, 431, 451,
] as const;
const serverErrorStatusCodes = [500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511] as const;

const httpStatusCodes = [
  ...successStatusCodes,
  ...redirectionStatusCodes,
  ...clientErrorStatusCodes,
  ...serverErrorStatusCodes,
] as const;

/**
 * HTTP Status Code Schema
 *
 * All standard HTTP status codes from 2xx through 5xx.
 *
 * @reference https://swagger.io/specification/#responses-object
 */
const httpStatusCodeSchema = z.union([
  z.literal(200),
  z.literal(201),
  z.literal(202),
  z.literal(203),
  z.literal(204),
  z.literal(205),
  z.literal(206),
  z.literal(300),
  z.literal(301),
  z.literal(302),
  z.literal(303),
  z.literal(304),
  z.literal(307),
  z.literal(308),
  z.literal(400),
  z.literal(401),
  z.literal(402),
  z.literal(403),
  z.literal(404),
  z.literal(405),
  z.literal(406),
  z.literal(407),
  z.literal(408),
  z.literal(409),
  z.literal(410),
  z.literal(411),
  z.literal(412),
  z.literal(413),
  z.literal(414),
  z.literal(415),
  z.literal(416),
  z.literal(417),
  z.literal(418),
  z.literal(422),
  z.literal(423),
  z.literal(424),
  z.literal(425),
  z.literal(426),
  z.literal(428),
  z.literal(429),
  z.literal(431),
  z.literal(451),
  z.literal(500),
  z.literal(501),
  z.literal(502),
  z.literal(503),
  z.literal(504),
  z.literal(505),
  z.literal(506),
  z.literal(507),
  z.literal(508),
  z.literal(510),
  z.literal(511),
]);

type IHttpStatusCode = z.infer<typeof httpStatusCodeSchema>;

export type { IMethod, IAuthStatus, IDisableStatus, IHttpStatusCode };
export {
  methodSchema,
  authStatusSchema,
  disableStatusSchema,
  httpStatusCodeSchema,
  successStatusCodes,
  redirectionStatusCodes,
  clientErrorStatusCodes,
  serverErrorStatusCodes,
  httpStatusCodes,
};
