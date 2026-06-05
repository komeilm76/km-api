import {
  toAxiosResponseType,
  toUniAppResponseType,
  toXHRResponseType,
  toTaroResponseType,
  toFetchResponseMethod,
  convertResponseType,
} from '../../src/adapters/response';
import type { IResponseContentType } from '../../src/schemas/content-types';

// ---- toAxiosResponseType ---------------------------------------------------

describe('toAxiosResponseType', () => {
  it('maps JSON types to { responseType: "json" }', () => {
    expect(toAxiosResponseType('application/json')).toEqual({ responseType: 'json' });
    expect(toAxiosResponseType('application/ld+json')).toEqual({ responseType: 'json' });
    expect(toAxiosResponseType('application/vnd.api+json')).toEqual({ responseType: 'json' });
    expect(toAxiosResponseType('application/json-patch+json')).toEqual({ responseType: 'json' });
    expect(toAxiosResponseType('application/vnd.github+json')).toEqual({ responseType: 'json' });
  });

  it('maps binary types to { responseType: "blob" }', () => {
    expect(toAxiosResponseType('application/pdf')).toEqual({ responseType: 'blob' });
    expect(toAxiosResponseType('application/octet-stream')).toEqual({ responseType: 'blob' });
    expect(toAxiosResponseType('image/png')).toEqual({ responseType: 'blob' });
    expect(toAxiosResponseType('image/jpeg')).toEqual({ responseType: 'blob' });
    expect(toAxiosResponseType('audio/mpeg')).toEqual({ responseType: 'blob' });
    expect(toAxiosResponseType('video/mp4')).toEqual({ responseType: 'blob' });
  });

  it('maps XML types to { responseType: "document" }', () => {
    expect(toAxiosResponseType('application/xml')).toEqual({ responseType: 'document' });
    expect(toAxiosResponseType('text/xml')).toEqual({ responseType: 'document' });
  });

  it('maps text types to { responseType: "text" } with encoding', () => {
    const result = toAxiosResponseType('text/plain');
    expect(result.responseType).toBe('text');
    expect(result).toHaveProperty('responseEncoding');
  });

  it('maps form-data types to { responseType: "blob" }', () => {
    expect(toAxiosResponseType('multipart/form-data')).toEqual({ responseType: 'blob' });
  });
});

// ---- toFetchResponseMethod -------------------------------------------------

describe('toFetchResponseMethod', () => {
  it('maps JSON types to { responseMethod: "json" }', () => {
    expect(toFetchResponseMethod('application/json')).toEqual({ responseMethod: 'json' });
    expect(toFetchResponseMethod('application/ld+json')).toEqual({ responseMethod: 'json' });
  });

  it('maps binary types to { responseMethod: "blob" }', () => {
    expect(toFetchResponseMethod('application/pdf')).toEqual({ responseMethod: 'blob' });
    expect(toFetchResponseMethod('image/png')).toEqual({ responseMethod: 'blob' });
    expect(toFetchResponseMethod('audio/mpeg')).toEqual({ responseMethod: 'blob' });
    expect(toFetchResponseMethod('video/mp4')).toEqual({ responseMethod: 'blob' });
  });

  it('maps form-data to { responseMethod: "formData" }', () => {
    expect(toFetchResponseMethod('multipart/form-data')).toEqual({ responseMethod: 'formData' });
  });

  it('maps text/XML types to { responseMethod: "text" }', () => {
    expect(toFetchResponseMethod('text/plain')).toEqual({ responseMethod: 'text' });
    expect(toFetchResponseMethod('text/html')).toEqual({ responseMethod: 'text' });
    expect(toFetchResponseMethod('application/xml')).toEqual({ responseMethod: 'text' });
  });
});

// ---- toUniAppResponseType --------------------------------------------------

describe('toUniAppResponseType', () => {
  it('maps JSON to text + json', () => {
    expect(toUniAppResponseType('application/json')).toEqual({
      responseType: 'text',
      dataType: 'json',
    });
  });

  it('maps binary to arraybuffer', () => {
    expect(toUniAppResponseType('application/pdf')).toEqual({ responseType: 'arraybuffer' });
    expect(toUniAppResponseType('image/png')).toEqual({ responseType: 'arraybuffer' });
  });

  it('maps text types to text + other', () => {
    expect(toUniAppResponseType('text/plain')).toEqual({
      responseType: 'text',
      dataType: 'other',
    });
  });
});

// ---- toXHRResponseType -----------------------------------------------------

describe('toXHRResponseType', () => {
  it('maps JSON to json', () => {
    expect(toXHRResponseType('application/json')).toEqual({ responseType: 'json' });
  });

  it('maps binary to blob', () => {
    expect(toXHRResponseType('image/jpeg')).toEqual({ responseType: 'blob' });
  });

  it('maps XML to document', () => {
    expect(toXHRResponseType('application/xml')).toEqual({ responseType: 'document' });
    expect(toXHRResponseType('text/xml')).toEqual({ responseType: 'document' });
  });

  it('maps text to text', () => {
    expect(toXHRResponseType('text/plain')).toEqual({ responseType: 'text' });
  });
});

// ---- toTaroResponseType ----------------------------------------------------

describe('toTaroResponseType', () => {
  it('maps JSON to text + json', () => {
    expect(toTaroResponseType('application/json')).toEqual({
      responseType: 'text',
      dataType: 'json',
    });
  });

  it('maps binary to arraybuffer', () => {
    expect(toTaroResponseType('application/pdf')).toEqual({
      responseType: 'arraybuffer',
      dataType: 'arraybuffer',
    });
  });

  it('maps text/XML to text', () => {
    expect(toTaroResponseType('text/plain')).toEqual({ responseType: 'text', dataType: 'text' });
    expect(toTaroResponseType('application/xml')).toEqual({
      responseType: 'text',
      dataType: 'text',
    });
  });
});

// ---- convertResponseType (unified) -----------------------------------------

describe('convertResponseType', () => {
  const ct: IResponseContentType = 'application/json';

  it('delegates to axios adapter', () => {
    expect(convertResponseType(ct, 'axios')).toEqual({ responseType: 'json' });
    expect(convertResponseType(ct, 'alova-axios')).toEqual({ responseType: 'json' });
  });

  it('delegates to fetch adapter', () => {
    expect(convertResponseType(ct, 'fetch')).toEqual({ responseMethod: 'json' });
  });

  it('delegates to uniapp adapter', () => {
    expect(convertResponseType(ct, 'alova-uniapp')).toEqual({
      responseType: 'text',
      dataType: 'json',
    });
  });

  it('delegates to xhr adapter', () => {
    expect(convertResponseType(ct, 'alova-xhr')).toEqual({ responseType: 'json' });
  });

  it('delegates to taro adapter', () => {
    expect(convertResponseType(ct, 'alova-taro')).toEqual({
      responseType: 'text',
      dataType: 'json',
    });
  });

  it('throws on unsupported adapter', () => {
    expect(() =>
      convertResponseType(ct, 'unknown-adapter' as any)
    ).toThrow('Unsupported adapter');
  });

  it('returns pdf as blob for axios', () => {
    expect(convertResponseType('application/pdf', 'axios')).toEqual({ responseType: 'blob' });
  });

  it('returns pdf as blob for fetch', () => {
    expect(convertResponseType('application/pdf', 'fetch')).toEqual({ responseMethod: 'blob' });
  });
});
