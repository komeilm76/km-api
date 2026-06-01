/**
 * Response Type Adapters
 *
 * Converts OpenAPI/Swagger standard content types into the format required
 * by each supported HTTP client library.
 *
 * Supported adapters:
 * - `axios` / `alova-axios`
 * - `alova-uniapp`
 * - `alova-xhr`
 * - `alova-taro`
 * - `fetch`
 */

import type { IResponseContentType } from '../schemas/content-types';

// ==========================================
// ADAPTER TYPE DEFINITIONS
// ==========================================

type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

type AxiosResponseEncoding =
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

interface AxiosAdapterConfig {
  responseType: AxiosResponseType;
  responseEncoding?: AxiosResponseEncoding;
}

type UniAppResponseType = 'text' | 'arraybuffer';
type UniAppDataType = 'json' | 'other';

interface UniAppAdapterConfig {
  responseType: UniAppResponseType;
  dataType?: UniAppDataType;
}

type XHRResponseType = '' | 'arraybuffer' | 'blob' | 'document' | 'json' | 'text';

interface XHRAdapterConfig {
  responseType: XHRResponseType;
}

type TaroResponseType = 'text' | 'arraybuffer';
type TaroDataType = 'json' | 'text' | 'base64' | 'arraybuffer';

interface TaroAdapterConfig {
  responseType: TaroResponseType;
  dataType?: TaroDataType;
}

type FetchResponseMethod = 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';

interface FetchAdapterConfig {
  responseMethod: FetchResponseMethod;
}

type AdapterType = 'axios' | 'alova-axios' | 'alova-uniapp' | 'alova-xhr' | 'alova-taro' | 'fetch';

type AdapterConfig<T extends AdapterType> = T extends 'axios' | 'alova-axios'
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
// INTERNAL HELPERS
// ==========================================

function contentTypeCategory(
  contentType: string
): 'json' | 'binary' | 'text' | 'xml' | 'formdata' {
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

  if (
    contentType === 'application/xml' ||
    contentType === 'text/xml' ||
    contentType.includes('+xml')
  ) {
    return 'xml';
  }

  if (
    contentType === 'multipart/form-data' ||
    contentType === 'application/x-www-form-urlencoded'
  ) {
    return 'formdata';
  }

  return 'text';
}

function extractCharset(contentType: string): AxiosResponseEncoding {
  if (contentType.includes('charset=')) {
    const match = contentType.match(/charset=([a-zA-Z0-9-]+)/i);
    if (match?.[1]) {
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
      return encodingMap[match[1].toLowerCase()] ?? 'utf-8';
    }
  }
  return 'utf-8';
}

// ==========================================
// PER-ADAPTER CONVERTERS
// ==========================================

/**
 * Converts a response content type to Axios `responseType` and optional `responseEncoding`.
 *
 * @reference https://axios-http.com/docs/req_config
 *
 * @example
 * ```typescript
 * toAxiosResponseType('application/json');  // { responseType: 'json' }
 * toAxiosResponseType('application/pdf');   // { responseType: 'blob' }
 * toAxiosResponseType('text/plain');        // { responseType: 'text', responseEncoding: 'utf-8' }
 * ```
 */
function toAxiosResponseType(contentType: IResponseContentType): AxiosAdapterConfig {
  switch (contentTypeCategory(contentType)) {
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
      return { responseType: 'text', responseEncoding: extractCharset(contentType) };
  }
}

/**
 * Converts a response content type to UniApp `responseType` + `dataType`.
 *
 * @reference https://uniapp.dcloud.net.cn/api/request/request.html
 */
function toUniAppResponseType(contentType: IResponseContentType): UniAppAdapterConfig {
  switch (contentTypeCategory(contentType)) {
    case 'json':
      return { responseType: 'text', dataType: 'json' };
    case 'binary':
      return { responseType: 'arraybuffer' };
    case 'xml':
    case 'text':
    default:
      return { responseType: 'text', dataType: 'other' };
  }
}

/**
 * Converts a response content type to XMLHttpRequest `responseType`.
 *
 * @reference https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
 */
function toXHRResponseType(contentType: IResponseContentType): XHRAdapterConfig {
  switch (contentTypeCategory(contentType)) {
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
}

/**
 * Converts a response content type to Taro `responseType` + `dataType`.
 *
 * @reference https://taro-docs.jd.com/docs/apis/network/request/
 */
function toTaroResponseType(contentType: IResponseContentType): TaroAdapterConfig {
  switch (contentTypeCategory(contentType)) {
    case 'json':
      return { responseType: 'text', dataType: 'json' };
    case 'binary':
      return { responseType: 'arraybuffer', dataType: 'arraybuffer' };
    case 'text':
    case 'xml':
    default:
      return { responseType: 'text', dataType: 'text' };
  }
}

/**
 * Converts a response content type to the appropriate Fetch API `Response` method.
 *
 * @reference https://developer.mozilla.org/en-US/docs/Web/API/Response
 *
 * @example
 * ```typescript
 * toFetchResponseMethod('application/json');        // { responseMethod: 'json' }
 * toFetchResponseMethod('application/octet-stream'); // { responseMethod: 'blob' }
 * toFetchResponseMethod('multipart/form-data');      // { responseMethod: 'formData' }
 * ```
 */
function toFetchResponseMethod(contentType: IResponseContentType): FetchAdapterConfig {
  switch (contentTypeCategory(contentType)) {
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
}

// ==========================================
// UNIFIED ADAPTER FUNCTION
// ==========================================

/**
 * Converts an OpenAPI response content type to the configuration object
 * expected by the target HTTP client adapter.
 *
 * @param contentType - The OpenAPI MIME type of the expected response
 * @param adapter     - The target HTTP client
 * @returns           Type-safe adapter configuration object
 *
 * @example
 * ```typescript
 * convertResponseType('application/json', 'axios');
 * // { responseType: 'json' }
 *
 * convertResponseType('application/pdf', 'fetch');
 * // { responseMethod: 'blob' }
 *
 * convertResponseType('text/plain', 'alova-uniapp');
 * // { responseType: 'text', dataType: 'other' }
 * ```
 */
function convertResponseType<T extends AdapterType>(
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
      throw new Error(`Unsupported adapter: ${adapter}`);
  }
}

export type {
  AxiosResponseType,
  AxiosResponseEncoding,
  AxiosAdapterConfig,
  UniAppResponseType,
  UniAppDataType,
  UniAppAdapterConfig,
  XHRResponseType,
  XHRAdapterConfig,
  TaroResponseType,
  TaroDataType,
  TaroAdapterConfig,
  FetchResponseMethod,
  FetchAdapterConfig,
  AdapterType,
  AdapterConfig,
};

export {
  convertResponseType,
  toAxiosResponseType,
  toUniAppResponseType,
  toXHRResponseType,
  toTaroResponseType,
  toFetchResponseMethod,
};
