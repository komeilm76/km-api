/**
 * HTTP Client Adapters for OpenAPI Content Types
 *
 * This module provides type-safe conversions from OpenAPI/Swagger standard
 * content types to format-specific types used by popular HTTP client libraries.
 *
 * Supported adapters:
 * - Axios (axios)
 * - Alova with Axios adapter (@alova/adapter-axios)
 * - Alova with UniApp adapter (@alova/adapter-uniapp)
 * - Alova with XHR adapter (@alova/adapter-xhr)
 * - Alova with Taro adapter (@alova/adapter-taro)
 * - Fetch API (native browser fetch)
 */

import type { IRequestContentType, IResponseContentType } from './schemas';

// ==========================================
// AXIOS ADAPTER TYPES
// ==========================================

/**
 * Axios response type configuration
 * Reference: https://axios-http.com/docs/req_config
 */
export type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

/**
 * Axios response encoding
 * Reference: https://axios-http.com/docs/req_config
 */
export type AxiosResponseEncoding =
  | 'ascii'
  | 'ASCII'
  | 'ansi'
  | 'ANSI'
  | 'binary'
  | 'BINARY'
  | 'base64'
  | 'BASE64'
  | 'base64url'
  | 'BASE64URL'
  | 'hex'
  | 'HEX'
  | 'latin1'
  | 'LATIN1'
  | 'ucs-2'
  | 'UCS-2'
  | 'ucs2'
  | 'UCS2'
  | 'utf-8'
  | 'UTF-8'
  | 'utf8'
  | 'UTF8'
  | 'utf16le'
  | 'UTF16LE';

export interface AxiosAdapterConfig {
  responseType: AxiosResponseType;
  responseEncoding?: AxiosResponseEncoding;
}

// ==========================================
// UNIAPP ADAPTER TYPES
// ==========================================

/**
 * UniApp response type configuration
 * Reference: https://uniapp.dcloud.net.cn/api/request/request.html
 */
export type UniAppResponseType = 'text' | 'arraybuffer';

export type UniAppDataType = 'json' | 'other';

export interface UniAppAdapterConfig {
  responseType: UniAppResponseType;
  dataType?: UniAppDataType;
}

// ==========================================
// XHR ADAPTER TYPES
// ==========================================

/**
 * XMLHttpRequest response type
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
 */
export type XHRResponseType = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';

export interface XHRAdapterConfig {
  responseType: XHRResponseType;
}

// ==========================================
// TARO ADAPTER TYPES
// ==========================================

/**
 * Taro response type configuration
 * Reference: https://taro-docs.jd.com/docs/apis/network/request/
 */
export type TaroResponseType = 'text' | 'arraybuffer';

export type TaroDataType = 'json' | 'text' | 'base64' | 'arraybuffer';

export interface TaroAdapterConfig {
  responseType: TaroResponseType;
  dataType?: TaroDataType;
}

// ==========================================
// FETCH API TYPES
// ==========================================

/**
 * Fetch API response methods
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export type FetchResponseMethod = 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';

export interface FetchAdapterConfig {
  responseMethod: FetchResponseMethod;
}

// ==========================================
// UNIFIED ADAPTER TYPE
// ==========================================

export type AdapterType =
  | 'axios'
  | 'alova-axios'
  | 'alova-uniapp'
  | 'alova-xhr'
  | 'alova-taro'
  | 'fetch';

export type AdapterConfig<T extends AdapterType> = T extends 'axios' | 'alova-axios'
  ? AxiosAdapterConfig
  : T extends 'alova-uniapp'
  ? UniAppAdapterConfig
  : T extends 'alova-xhr'
  ? XHRAdapterConfig
  : T extends 'alova-taro'
  ? TaroAdapterConfig
  : T extends 'fetch'
  ? FetchAdapterConfig
  : never;

// ==========================================
// CONTENT TYPE MAPPING
// ==========================================

/**
 * Maps OpenAPI content types to response type categories
 */
const contentTypeCategory = (
  contentType: string
): 'json' | 'binary' | 'text' | 'xml' | 'formdata' => {
  // JSON types
  if (
    contentType === 'application/json' ||
    contentType === 'application/ld+json' ||
    contentType === 'application/vnd.api+json' ||
    contentType === 'application/json-patch+json' ||
    contentType === 'application/merge-patch+json' ||
    contentType === 'application/x-ndjson' ||
    (contentType.includes('application/vnd.github') && contentType.includes('json'))
  ) {
    return 'json';
  }

  // Binary types
  if (
    contentType === 'application/octet-stream' ||
    contentType === 'application/pdf' ||
    contentType === 'application/zip' ||
    contentType === 'application/gzip' ||
    contentType === 'application/msgpack' ||
    contentType === 'application/x-protobuf' ||
    contentType.includes('application/vnd.ms-') ||
    contentType.includes('application/vnd.openxmlformats-officedocument') ||
    contentType.startsWith('image/') ||
    contentType.startsWith('audio/') ||
    contentType.startsWith('video/')
  ) {
    return 'binary';
  }

  // XML types
  if (
    contentType === 'application/xml' ||
    contentType === 'text/xml' ||
    contentType.includes('+xml')
  ) {
    return 'xml';
  }

  // Form data
  if (
    contentType === 'multipart/form-data' ||
    contentType === 'application/x-www-form-urlencoded'
  ) {
    return 'formdata';
  }

  // Text types (default)
  return 'text';
};

/**
 * Extracts charset from content type string
 */
const extractCharset = (contentType: string): AxiosResponseEncoding => {
  if (contentType.includes('charset=')) {
    const charsetMatch = contentType.match(/charset=([a-zA-Z0-9-]+)/i);
    if (charsetMatch && charsetMatch[1]) {
      const charset = charsetMatch[1].toLowerCase();
      const encodingMap: Record<string, AxiosResponseEncoding> = {
        'utf-8': 'utf-8',
        utf8: 'utf8',
        ascii: 'ascii',
        latin1: 'latin1',
        'iso-8859-1': 'latin1',
        binary: 'binary',
        base64: 'base64',
        hex: 'hex',
      };
      return encodingMap[charset] || 'utf-8';
    }
  }
  return 'utf-8';
};

// ==========================================
// AXIOS ADAPTER
// ==========================================

/**
 * Converts OpenAPI response content type to Axios configuration
 *
 * @param contentType - OpenAPI standard content type
 * @returns Axios-compatible response type and optional encoding
 *
 * @example
 * ```typescript
 * const config = toAxiosResponseType('application/json');
 * // { responseType: 'json' }
 *
 * const pdfConfig = toAxiosResponseType('application/pdf');
 * // { responseType: 'blob' }
 * ```
 */
export const toAxiosResponseType = (contentType: IResponseContentType): AxiosAdapterConfig => {
  const category = contentTypeCategory(contentType);

  switch (category) {
    case 'json':
      return { responseType: 'json' };

    case 'binary':
      return { responseType: 'blob' };

    case 'xml':
      return { responseType: 'document' };

    case 'formdata':
      return { responseType: 'blob' };

    case 'text':
    default:
      return {
        responseType: 'text',
        responseEncoding: extractCharset(contentType),
      };
  }
};

// ==========================================
// UNIAPP ADAPTER
// ==========================================

/**
 * Converts OpenAPI response content type to UniApp configuration
 *
 * @param contentType - OpenAPI standard content type
 * @returns UniApp-compatible response type and data type
 */
export const toUniAppResponseType = (contentType: IResponseContentType): UniAppAdapterConfig => {
  const category = contentTypeCategory(contentType);

  switch (category) {
    case 'json':
      return {
        responseType: 'text',
        dataType: 'json',
      };

    case 'binary':
      return {
        responseType: 'arraybuffer',
      };

    case 'xml':
    case 'text':
    default:
      return {
        responseType: 'text',
        dataType: 'other',
      };
  }
};

// ==========================================
// XHR ADAPTER
// ==========================================

/**
 * Converts OpenAPI response content type to XMLHttpRequest configuration
 *
 * @param contentType - OpenAPI standard content type
 * @returns XHR-compatible response type
 */
export const toXHRResponseType = (contentType: IResponseContentType): XHRAdapterConfig => {
  const category = contentTypeCategory(contentType);

  switch (category) {
    case 'json':
      return { responseType: 'json' };

    case 'binary':
      return { responseType: 'blob' };

    case 'xml':
      return { responseType: 'document' };

    case 'text':
    case 'formdata':
    default:
      return { responseType: 'text' };
  }
};

// ==========================================
// TARO ADAPTER
// ==========================================

/**
 * Converts OpenAPI response content type to Taro configuration
 *
 * @param contentType - OpenAPI standard content type
 * @returns Taro-compatible response type and data type
 */
export const toTaroResponseType = (contentType: IResponseContentType): TaroAdapterConfig => {
  const category = contentTypeCategory(contentType);

  switch (category) {
    case 'json':
      return {
        responseType: 'text',
        dataType: 'json',
      };

    case 'binary':
      return {
        responseType: 'arraybuffer',
        dataType: 'arraybuffer',
      };

    case 'text':
    case 'xml':
    default:
      return {
        responseType: 'text',
        dataType: 'text',
      };
  }
};

// ==========================================
// FETCH API ADAPTER
// ==========================================

/**
 * Converts OpenAPI response content type to Fetch API response method
 *
 * @param contentType - OpenAPI standard content type
 * @returns Fetch API response method to call
 */
export const toFetchResponseMethod = (contentType: IResponseContentType): FetchAdapterConfig => {
  const category = contentTypeCategory(contentType);

  switch (category) {
    case 'json':
      return { responseMethod: 'json' };

    case 'binary':
      return { responseMethod: 'blob' };

    case 'formdata':
      return { responseMethod: 'formData' };

    case 'text':
    case 'xml':
    default:
      return { responseMethod: 'text' };
  }
};

// ==========================================
// UNIFIED ADAPTER FUNCTION
// ==========================================

/**
 * Universal adapter function that converts OpenAPI content types
 * to the appropriate format for any supported HTTP client
 *
 * @param contentType - OpenAPI standard content type
 * @param adapter - Target adapter type
 * @returns Type-safe adapter configuration
 *
 * @example
 * ```typescript
 * // Axios
 * const axiosConfig = convertResponseType('application/json', 'axios');
 * // { responseType: 'json' }
 *
 * // UniApp
 * const uniappConfig = convertResponseType('application/pdf', 'alova-uniapp');
 * // { responseType: 'arraybuffer' }
 *
 * // Fetch API
 * const fetchConfig = convertResponseType('text/plain', 'fetch');
 * // { responseMethod: 'text' }
 * ```
 */
export function convertResponseType<T extends AdapterType>(
  contentType: IResponseContentType,
  adapter: T
): AdapterConfig<T> {
  switch (adapter) {
    case 'axios':
    case 'alova-axios':
      return toAxiosResponseType(contentType) as AdapterConfig<T>;

    case 'alova-uniapp':
      return toUniAppResponseType(contentType) as AdapterConfig<T>;

    case 'alova-xhr':
      return toXHRResponseType(contentType) as AdapterConfig<T>;

    case 'alova-taro':
      return toTaroResponseType(contentType) as AdapterConfig<T>;

    case 'fetch':
      return toFetchResponseMethod(contentType) as AdapterConfig<T>;

    default:
      // TypeScript will catch this at compile time
      throw new Error(`Unsupported adapter: ${adapter}`);
  }
}

/**
 * Batch convert multiple content types for a specific adapter
 *
 * @param contentTypes - Array of OpenAPI content types
 * @param adapter - Target adapter type
 * @returns Array of adapter configurations
 */
export function convertResponseTypes<T extends AdapterType>(
  contentTypes: IResponseContentType[],
  adapter: T
): AdapterConfig<T>[] {
  return contentTypes.map((ct) => convertResponseType(ct, adapter));
}

// ==========================================
// REQUEST BODY CONVERSION (For future use)
// ==========================================

/**
 * Alova/Axios supported request body types
 * Reference: https://alova.js.org/ and https://axios-http.com/
 */
export type AlovaRequestBody =
  | string
  | FormData
  | Blob
  | ArrayBuffer
  | URLSearchParams
  | ReadableStream
  | Record<string, any> // Plain objects (will be stringified for JSON)
  | any[]; // Arrays (will be stringified for JSON)

/**
 * Convert request body to appropriate format based on content type
 *
 * @param data - The data to be sent in the request
 * @param contentType - OpenAPI request content type
 * @returns Properly formatted request body ready for Alova/Axios
 *
 * @example
 * ```typescript
 * // JSON request
 * const body = convertRequestBody({ name: 'John' }, 'application/json');
 * // Returns: '{"name":"John"}' (stringified)
 *
 * // Form data request
 * const formBody = convertRequestBody({ name: 'John' }, 'multipart/form-data');
 * // Returns: FormData instance with fields
 *
 * // Already valid format
 * const blob = new Blob(['data']);
 * const blobBody = convertRequestBody(blob, 'application/octet-stream');
 * // Returns: blob (unchanged)
 * ```
 */
export function convertRequestBody(data: any, contentType: IRequestContentType): AlovaRequestBody {
  // If data is null or undefined, return as-is
  if (data === null || data === undefined) {
    return data;
  }

  // Check if data is already in a valid format
  const isValidFormat =
    typeof data === 'string' ||
    data instanceof FormData ||
    data instanceof Blob ||
    data instanceof ArrayBuffer ||
    data instanceof URLSearchParams ||
    (typeof ReadableStream !== 'undefined' && data instanceof ReadableStream);

  // Determine required format based on content type
  switch (contentType) {
    // ==========================================
    // JSON Content Types - Stringify objects
    // ==========================================
    case 'application/json':
    case 'application/ld+json':
    case 'application/vnd.api+json':
    case 'application/json-patch+json':
    case 'application/merge-patch+json':
    case 'application/vnd.github+json':
      // If already a string, return as-is
      if (typeof data === 'string') {
        return data;
      }
      // If object or array, stringify
      if (typeof data === 'object') {
        return JSON.stringify(data);
      }
      // Primitive types - stringify
      return JSON.stringify(data);

    // ==========================================
    // Form URL Encoded - Convert to URLSearchParams
    // ==========================================
    case 'application/x-www-form-urlencoded':
      // Already URLSearchParams
      if (data instanceof URLSearchParams) {
        return data;
      }
      // Convert object to URLSearchParams
      if (typeof data === 'object' && !Array.isArray(data)) {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, String(value));
          }
        });
        return params;
      }
      // String - create URLSearchParams from query string
      if (typeof data === 'string') {
        return new URLSearchParams(data);
      }
      return data;

    // ==========================================
    // Multipart Form Data - Convert to FormData
    // ==========================================
    case 'multipart/form-data':
      // Already FormData
      if (data instanceof FormData) {
        return data;
      }
      // Convert object to FormData
      if (typeof data === 'object' && !Array.isArray(data)) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            // Handle File/Blob
            if (value instanceof File || value instanceof Blob) {
              formData.append(key, value);
            }
            // Handle arrays
            else if (Array.isArray(value)) {
              value.forEach((item, index) => {
                if (item instanceof File || item instanceof Blob) {
                  formData.append(`${key}[${index}]`, item);
                } else {
                  formData.append(`${key}[${index}]`, String(item));
                }
              });
            }
            // Handle objects (stringify)
            else if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
            }
            // Handle primitives
            else {
              formData.append(key, String(value));
            }
          }
        });
        return formData;
      }
      return data;

    // ==========================================
    // Binary/Octet Stream - Keep as-is or convert
    // ==========================================
    case 'application/octet-stream':
    case 'application/pdf':
    case 'application/zip':
    case 'application/gzip':
      // Already valid binary format
      if (
        data instanceof Blob ||
        data instanceof ArrayBuffer ||
        (typeof ReadableStream !== 'undefined' && data instanceof ReadableStream)
      ) {
        return data;
      }
      // Convert string to Blob
      if (typeof data === 'string') {
        return new Blob([data], { type: contentType });
      }
      // Convert object to Blob with JSON
      if (typeof data === 'object') {
        return new Blob([JSON.stringify(data)], { type: contentType });
      }
      return data;

    // ==========================================
    // Text Content Types - Convert to string
    // ==========================================
    case 'text/plain':
    case 'text/html':
    case 'text/xml':
    case 'text/csv':
    case 'text/markdown':
    case 'text/yaml':
      // Already a string
      if (typeof data === 'string') {
        return data;
      }
      // Convert object to string
      if (typeof data === 'object') {
        return JSON.stringify(data);
      }
      // Convert primitive to string
      return String(data);

    // ==========================================
    // XML Content Types - Convert to string
    // ==========================================
    case 'application/xml':
      // Already a string
      if (typeof data === 'string') {
        return data;
      }
      // For objects, user should provide XML string
      // We can't auto-convert objects to XML
      if (typeof data === 'object') {
        throw new Error(
          'XML content type requires data to be an XML string. Cannot auto-convert objects to XML.'
        );
      }
      return String(data);

    // ==========================================
    // Special Binary Formats
    // ==========================================
    case 'application/msgpack':
    case 'application/x-protobuf':
      // These require special encoding libraries
      // If data is already in correct format, return as-is
      if (data instanceof ArrayBuffer || data instanceof Blob) {
        return data;
      }
      throw new Error(
        `${contentType} requires pre-encoded data as ArrayBuffer or Blob. Use appropriate encoding library.`
      );

    // ==========================================
    // Image/Audio/Video Uploads
    // ==========================================
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
      // Should already be Blob or File
      if (data instanceof Blob || data instanceof File) {
        return data;
      }
      // Convert ArrayBuffer to Blob
      if (data instanceof ArrayBuffer) {
        return new Blob([data], { type: contentType });
      }
      throw new Error(`${contentType} requires data to be a File, Blob, or ArrayBuffer`);

    // ==========================================
    // GraphQL
    // ==========================================
    case 'application/graphql':
      // GraphQL should be sent as a string
      if (typeof data === 'string') {
        return data;
      }
      // If object with query/variables, stringify
      if (typeof data === 'object' && 'query' in data) {
        return JSON.stringify(data);
      }
      return String(data);

    // ==========================================
    // Default - Return as-is
    // ==========================================
    default:
      return data;
  }
}

/**
 * Check if data needs conversion for the given content type
 *
 * @param data - The data to check
 * @param contentType - OpenAPI request content type
 * @returns True if conversion is needed, false if data is already valid
 *
 * @example
 * ```typescript
 * needsConversion({ name: 'John' }, 'application/json'); // true
 * needsConversion('{"name":"John"}', 'application/json'); // false
 *
 * const formData = new FormData();
 * needsConversion(formData, 'multipart/form-data'); // false
 * needsConversion({ file: blob }, 'multipart/form-data'); // true
 * ```
 */
export function needsConversion(data: any, contentType: IRequestContentType): boolean {
  if (data === null || data === undefined) {
    return false;
  }

  switch (contentType) {
    case 'application/json':
    case 'application/ld+json':
    case 'application/vnd.api+json':
    case 'application/json-patch+json':
    case 'application/merge-patch+json':
    case 'application/vnd.github+json':
    case 'application/graphql':
      // Needs conversion if not a string
      return typeof data !== 'string';

    case 'application/x-www-form-urlencoded':
      // Needs conversion if not URLSearchParams
      return !(data instanceof URLSearchParams);

    case 'multipart/form-data':
      // Needs conversion if not FormData
      return !(data instanceof FormData);

    case 'application/octet-stream':
    case 'application/pdf':
    case 'application/zip':
    case 'application/gzip':
      // Needs conversion if not Blob, ArrayBuffer, or ReadableStream
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
      // Needs conversion if not a string
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
      // Needs conversion if not File, Blob, or ArrayBuffer
      return !(data instanceof File || data instanceof Blob || data instanceof ArrayBuffer);

    default:
      return false;
  }
}

/**
 * Safe request body converter that checks if conversion is needed
 * and only converts when necessary
 *
 * @param data - The data to be sent
 * @param contentType - OpenAPI request content type
 * @returns Properly formatted request body
 *
 * @example
 * ```typescript
 * // Auto-detects and converts only when needed
 * const body1 = safeConvertRequestBody({ name: 'John' }, 'application/json');
 * // Converts to: '{"name":"John"}'
 *
 * const body2 = safeConvertRequestBody('{"name":"John"}', 'application/json');
 * // Returns unchanged: '{"name":"John"}'
 *
 * const formData = new FormData();
 * const body3 = safeConvertRequestBody(formData, 'multipart/form-data');
 * // Returns unchanged: formData
 * ```
 */
export function safeConvertRequestBody(
  data: any,
  contentType: IRequestContentType
): AlovaRequestBody {
  // Check if conversion is needed
  if (!needsConversion(data, contentType)) {
    return data;
  }

  // Convert if needed
  return convertRequestBody(data, contentType);
}

/**
 * Convert request body to appropriate format based on content type
 * This is kept for backward compatibility
 *
 * @deprecated Use safeConvertRequestBody instead
 */
export function convertRequestType<T extends AdapterType>(
  contentType: IRequestContentType,
  adapter: T
): { contentType: string } {
  // Most HTTP clients use the content type directly in headers
  // This function exists for future adapter-specific transformations
  return { contentType };
}

// ==========================================
// EXPORTS
// ==========================================

export default {
  // Response type conversion
  convertResponseType,
  convertResponseTypes,
  toAxiosResponseType,
  toUniAppResponseType,
  toXHRResponseType,
  toTaroResponseType,
  toFetchResponseMethod,

  // Request body conversion
  convertRequestBody,
  safeConvertRequestBody,
  needsConversion,
};
