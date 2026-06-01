/**
 * Request Body Adapters
 *
 * Converts arbitrary data into the format required by each content type
 * before sending it over the network.
 */

import type { IRequestContentType } from '../schemas/content-types';

type AlovaRequestBody =
  | string
  | FormData
  | Blob
  | ArrayBuffer
  | URLSearchParams
  | ReadableStream
  | Record<string, unknown>
  | unknown[];

// ==========================================
// CONVERSION
// ==========================================

/**
 * Converts request data to the format expected for a given content type.
 *
 * - `application/json` → JSON string
 * - `application/x-www-form-urlencoded` → `URLSearchParams`
 * - `multipart/form-data` → `FormData`
 * - Binary types → `Blob` / `ArrayBuffer`
 * - Text types → string
 *
 * Throws for types that require external encoding (XML, msgpack, protobuf).
 *
 * @example
 * ```typescript
 * convertRequestBody({ name: 'Alice' }, 'application/json');
 * // '{"name":"Alice"}'
 *
 * convertRequestBody({ q: 'hello' }, 'application/x-www-form-urlencoded');
 * // URLSearchParams { 'q' => 'hello' }
 *
 * convertRequestBody({ file: myBlob }, 'multipart/form-data');
 * // FormData instance
 * ```
 */
function convertRequestBody(data: unknown, contentType: IRequestContentType): AlovaRequestBody {
  if (data === null || data === undefined) {
    return data as unknown as AlovaRequestBody;
  }

  switch (contentType) {
    // ---- JSON ----------------------------------------------------------------
    case 'application/json':
    case 'application/ld+json':
    case 'application/vnd.api+json':
    case 'application/json-patch+json':
    case 'application/merge-patch+json':
    case 'application/vnd.github+json':
      return typeof data === 'string' ? data : JSON.stringify(data);

    // ---- Form URL-encoded ----------------------------------------------------
    case 'application/x-www-form-urlencoded': {
      if (data instanceof URLSearchParams) return data;
      if (typeof data === 'string') return new URLSearchParams(data);
      if (typeof data === 'object' && !Array.isArray(data)) {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
          if (value !== null && value !== undefined) {
            params.append(key, String(value));
          }
        }
        return params;
      }
      return data as AlovaRequestBody;
    }

    // ---- Multipart form data -------------------------------------------------
    case 'multipart/form-data': {
      if (data instanceof FormData) return data;
      if (typeof data === 'object' && !Array.isArray(data)) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
          if (value === null || value === undefined) continue;
          if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
              if (item instanceof File || item instanceof Blob) {
                formData.append(`${key}[${index}]`, item);
              } else {
                formData.append(`${key}[${index}]`, String(item));
              }
            });
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
        return formData;
      }
      return data as AlovaRequestBody;
    }

    // ---- Binary --------------------------------------------------------------
    case 'application/octet-stream':
    case 'application/pdf':
    case 'application/zip':
    case 'application/gzip':
      if (
        data instanceof Blob ||
        data instanceof ArrayBuffer ||
        (typeof ReadableStream !== 'undefined' && data instanceof ReadableStream)
      ) {
        return data as AlovaRequestBody;
      }
      if (typeof data === 'string') return new Blob([data], { type: contentType });
      if (typeof data === 'object') return new Blob([JSON.stringify(data)], { type: contentType });
      return data as AlovaRequestBody;

    // ---- Text ----------------------------------------------------------------
    case 'text/plain':
    case 'text/html':
    case 'text/xml':
    case 'text/csv':
    case 'text/markdown':
    case 'text/yaml':
      if (typeof data === 'string') return data;
      if (typeof data === 'object') return JSON.stringify(data);
      return String(data);

    // ---- XML (requires pre-serialised string) --------------------------------
    case 'application/xml':
      if (typeof data === 'string') return data;
      throw new Error(
        'application/xml requires data to be an XML string. Cannot auto-convert objects to XML.'
      );

    // ---- Special binary (require external encoding libraries) ----------------
    case 'application/msgpack':
    case 'application/x-protobuf':
      if (data instanceof ArrayBuffer || data instanceof Blob) return data as AlovaRequestBody;
      throw new Error(
        `${contentType} requires pre-encoded data as ArrayBuffer or Blob. Use the appropriate encoding library first.`
      );

    // ---- File uploads --------------------------------------------------------
    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/webp':
    case 'image/svg+xml':
    case 'audio/mpeg':
    case 'audio/wav':
    case 'audio/ogg':
    case 'video/mp4':
    case 'video/mpeg':
    case 'video/webm':
      if (data instanceof Blob || data instanceof File) return data as AlovaRequestBody;
      if (data instanceof ArrayBuffer) return new Blob([data], { type: contentType });
      throw new Error(`${contentType} requires data to be a File, Blob, or ArrayBuffer.`);

    // ---- GraphQL -------------------------------------------------------------
    case 'application/graphql':
      if (typeof data === 'string') return data;
      if (typeof data === 'object' && data !== null && 'query' in data) {
        return JSON.stringify(data);
      }
      return String(data);

    // ---- Fallback ------------------------------------------------------------
    default:
      return data as AlovaRequestBody;
  }
}

// ==========================================
// SMART / SAFE CONVERSION
// ==========================================

/**
 * Returns `true` if `data` needs to be converted for the given content type.
 *
 * @example
 * ```typescript
 * needsConversion({ name: 'Alice' }, 'application/json');    // true  (object, not a string)
 * needsConversion('{"name":"Alice"}', 'application/json');   // false (already a string)
 * needsConversion(new FormData(), 'multipart/form-data');    // false
 * ```
 */
function needsConversion(data: unknown, contentType: IRequestContentType): boolean {
  if (data === null || data === undefined) return false;

  switch (contentType) {
    case 'application/json':
    case 'application/ld+json':
    case 'application/vnd.api+json':
    case 'application/json-patch+json':
    case 'application/merge-patch+json':
    case 'application/vnd.github+json':
    case 'application/graphql':
      return typeof data !== 'string';

    case 'application/x-www-form-urlencoded':
      return !(data instanceof URLSearchParams);

    case 'multipart/form-data':
      return !(data instanceof FormData);

    case 'application/octet-stream':
    case 'application/pdf':
    case 'application/zip':
    case 'application/gzip':
      return !(
        data instanceof Blob ||
        data instanceof ArrayBuffer ||
        (typeof ReadableStream !== 'undefined' && data instanceof ReadableStream)
      );

    case 'text/plain':
    case 'text/html':
    case 'text/xml':
    case 'text/csv':
    case 'text/markdown':
    case 'text/yaml':
    case 'application/xml':
      return typeof data !== 'string';

    case 'image/png':
    case 'image/jpeg':
    case 'image/gif':
    case 'image/webp':
    case 'image/svg+xml':
    case 'audio/mpeg':
    case 'audio/wav':
    case 'audio/ogg':
    case 'video/mp4':
    case 'video/mpeg':
    case 'video/webm':
      return !(data instanceof File || data instanceof Blob || data instanceof ArrayBuffer);

    default:
      return false;
  }
}

/**
 * Converts `data` only when needed — safe wrapper around `convertRequestBody`.
 *
 * @example
 * ```typescript
 * safeConvertRequestBody({ name: 'Alice' }, 'application/json');
 * // '{"name":"Alice"}'
 *
 * safeConvertRequestBody('{"name":"Alice"}', 'application/json');
 * // '{"name":"Alice"}' — returned unchanged
 * ```
 */
function safeConvertRequestBody(data: unknown, contentType: IRequestContentType): AlovaRequestBody {
  return needsConversion(data, contentType) ? convertRequestBody(data, contentType) : (data as AlovaRequestBody);
}

export type { AlovaRequestBody };
export { convertRequestBody, needsConversion, safeConvertRequestBody };
