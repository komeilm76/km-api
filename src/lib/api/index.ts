/**
 * API Configuration Utilities - Main Entry Point
 * 
 * This package provides type-safe utilities for building OpenAPI/Swagger
 * compatible API configurations with Zod schema validation.
 * 
 * ## Features
 * 
 * - **Type-Safe API Definitions**: Create fully typed API endpoint configurations
 * - **OpenAPI Compatible**: Generate OpenAPI 3.0 and Swagger 2.0 documentation
 * - **HTTP Client Adapters**: Convert configurations for Axios, Fetch, Alova, etc.
 * - **Request/Response Validation**: Use Zod schemas for runtime validation
 * - **Path Parameter Handling**: Support both Express (:param) and OpenAPI ({param}) syntax
 * 
 * ## Modules
 * 
 * - **v4**: Main API configuration factory and response utilities
 * - **schemas**: Zod schemas and TypeScript types for OpenAPI components
 * - **adapters**: HTTP client adapter conversions and content type handling
 * 
 * @example
 * ```typescript
 * import { v4, schemas, adapters } from 'api-config-utils';
 * import { z } from 'zod';
 *
 * // Create an API endpoint configuration
 * const getUserConfig = v4.makeApiConfig({
 *   method: 'GET',
 *   pathShape: '/users/{id}',
 *   tags: ['#users'],
 *   auth: 'YES',
 *   responseContentType: 'application/json',
 *   summary: 'Get user by ID',
 *   description: 'Retrieves a user by their unique identifier',
 *   request: {
 *     body: z.any(),
 *     params: z.object({ id: z.string() }),
 *     query: z.object({}),
 *     headers: z.object({}),
 *     cookies: z.object({})
 *   },
 *   response: {
 *     success: z.object({
 *       id: z.string(),
 *       name: z.string(),
 *       email: z.string()
 *     }),
 *     error: z.object({
 *       code: z.number(),
 *       message: z.string()
 *     })
 *   }
 * });
 *
 * // Use helper methods
 * const params = getUserConfig.makeParams({ id: '123' });
 * const path = getUserConfig.makeFullPath({ id: '123' });
 * // '/users/123'
 *
 * const openApiPath = getUserConfig.makeOpenAPIPath();
 * // '/users/{id}'
 *
 * // Convert for HTTP client
 * const axiosConfig = getUserConfig.convertResponseType('axios');
 * // { responseType: 'json' }
 *
 * // Create paginated list response
 * const userSchema = z.object({ id: z.string(), name: z.string() });
 * const userListResponse = v4.makeResponseSuccessShape(userSchema, 'users')
 *   .list(v4.paginationSchema());
 *
 * // Convert request body for specific content type
 * const formData = adapters.convertRequestBody(
 *   { name: 'John', file: blob },
 *   'multipart/form-data'
 * );
 * ```
 * 
 * @packageDocumentation
 */

import * as adapters from './adapters';
import * as schemas from './schemas';
import * as v4 from './v4';

export { adapters, schemas, v4 };