import z from 'zod';

/**
 * Response Content Type Schema
 *
 * Valid MIME types for API responses, covering all major categories:
 * application, text, image, audio, video, and vendor-specific types.
 *
 * @reference https://swagger.io/specification/#media-type-object
 */
const responseContentTypeSchema = z.enum([
  // ========== APPLICATION TYPES ==========
  'application/json',
  'application/xml',
  'application/octet-stream',
  'application/pdf',
  'application/zip',
  'application/gzip',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'application/json-patch+json',
  'application/merge-patch+json',
  'application/vnd.api+json',
  'application/ld+json',
  'application/x-ndjson',
  'application/x-protobuf',
  'application/msgpack',

  // ========== MICROSOFT OFFICE FORMATS ==========
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // ========== TEXT TYPES ==========
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',
  'text/csv',
  'text/xml',
  'text/markdown',
  'text/yaml',

  // ========== IMAGE TYPES ==========
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
  'image/x-icon',
  'image/avif',
  'image/vnd.djvu',

  // ========== AUDIO TYPES ==========
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'audio/aac',
  'audio/flac',

  // ========== VIDEO TYPES ==========
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',

  // ========== VENDOR-SPECIFIC TYPES ==========
  'application/vnd.github+json',
  'application/vnd.github.v3+json',
  'application/vnd.github.v3.diff',
  'application/vnd.github.v3.patch',
  'application/vnd.openstreetmap.data+xml',
] as const);

type IResponseContentType = z.infer<typeof responseContentTypeSchema>;

/**
 * Request Content Type Schema
 *
 * Valid MIME types for API request bodies.
 *
 * @reference https://swagger.io/specification/#request-body-object
 */
const requestContentTypeSchema = z.enum([
  // ========== APPLICATION TYPES ==========
  'application/json',
  'application/xml',
  'application/x-www-form-urlencoded',
  'multipart/form-data',
  'application/octet-stream',
  'application/pdf',
  'application/zip',
  'application/gzip',
  'application/json-patch+json',
  'application/merge-patch+json',
  'application/vnd.api+json',
  'application/ld+json',
  'application/x-protobuf',
  'application/msgpack',
  'application/graphql',

  // ========== TEXT TYPES ==========
  'text/plain',
  'text/html',
  'text/xml',
  'text/csv',
  'text/markdown',
  'text/yaml',

  // ========== IMAGE TYPES (FILE UPLOADS) ==========
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',

  // ========== AUDIO TYPES (FILE UPLOADS) ==========
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',

  // ========== VIDEO TYPES (FILE UPLOADS) ==========
  'video/mp4',
  'video/mpeg',
  'video/webm',

  // ========== VENDOR-SPECIFIC TYPES ==========
  'application/vnd.github+json',
] as const);

type IRequestContentType = z.infer<typeof requestContentTypeSchema>;

export type { IResponseContentType, IRequestContentType };
export { responseContentTypeSchema, requestContentTypeSchema };
