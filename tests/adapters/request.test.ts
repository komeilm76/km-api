import { convertRequestBody, needsConversion, safeConvertRequestBody } from '../../src/adapters/request';

// ---- convertRequestBody ----------------------------------------------------

describe('convertRequestBody', () => {
  describe('application/json', () => {
    it('stringifies objects', () => {
      expect(convertRequestBody({ name: 'Alice' }, 'application/json')).toBe(
        '{"name":"Alice"}'
      );
    });

    it('stringifies arrays', () => {
      expect(convertRequestBody([1, 2, 3], 'application/json')).toBe('[1,2,3]');
    });

    it('returns string data unchanged', () => {
      const json = '{"name":"Bob"}';
      expect(convertRequestBody(json, 'application/json')).toBe(json);
    });

    it('handles null/undefined by returning them', () => {
      expect(convertRequestBody(null, 'application/json')).toBeNull();
      expect(convertRequestBody(undefined, 'application/json')).toBeUndefined();
    });

    it('stringifies numbers and booleans', () => {
      expect(convertRequestBody(42, 'application/json')).toBe('42');
      expect(convertRequestBody(true, 'application/json')).toBe('true');
    });
  });

  describe('application/x-www-form-urlencoded', () => {
    it('converts object to URLSearchParams', () => {
      const result = convertRequestBody({ name: 'Alice', age: '30' }, 'application/x-www-form-urlencoded');
      expect(result).toBeInstanceOf(URLSearchParams);
      const params = result as URLSearchParams;
      expect(params.get('name')).toBe('Alice');
      expect(params.get('age')).toBe('30');
    });

    it('returns URLSearchParams unchanged', () => {
      const sp = new URLSearchParams({ q: 'test' });
      expect(convertRequestBody(sp, 'application/x-www-form-urlencoded')).toBe(sp);
    });

    it('converts string query to URLSearchParams', () => {
      const result = convertRequestBody('name=Alice&age=30', 'application/x-www-form-urlencoded') as URLSearchParams;
      expect(result).toBeInstanceOf(URLSearchParams);
      expect(result.get('name')).toBe('Alice');
    });

    it('skips null values', () => {
      const result = convertRequestBody(
        { name: 'Alice', extra: null },
        'application/x-www-form-urlencoded'
      ) as URLSearchParams;
      expect(result.has('extra')).toBe(false);
      expect(result.get('name')).toBe('Alice');
    });
  });

  describe('multipart/form-data', () => {
    it('converts object to FormData', () => {
      const result = convertRequestBody({ name: 'Alice' }, 'multipart/form-data');
      expect(result).toBeInstanceOf(FormData);
    });

    it('returns FormData unchanged', () => {
      const fd = new FormData();
      expect(convertRequestBody(fd, 'multipart/form-data')).toBe(fd);
    });

    it('handles Blob values inside objects', () => {
      const blob = new Blob(['hello'], { type: 'text/plain' });
      const result = convertRequestBody({ file: blob }, 'multipart/form-data') as FormData;
      expect(result).toBeInstanceOf(FormData);
    });

    it('stringifies nested object values', () => {
      const result = convertRequestBody(
        { meta: { key: 'value' } },
        'multipart/form-data'
      ) as FormData;
      expect(result.get('meta')).toBe('{"key":"value"}');
    });
  });

  describe('text types', () => {
    it('returns strings unchanged', () => {
      expect(convertRequestBody('hello', 'text/plain')).toBe('hello');
      expect(convertRequestBody('<html>', 'text/html')).toBe('<html>');
    });

    it('converts objects to JSON strings for text types', () => {
      expect(convertRequestBody({ a: 1 }, 'text/plain')).toBe('{"a":1}');
    });

    it('converts primitives to strings', () => {
      expect(convertRequestBody(42, 'text/plain')).toBe('42');
    });
  });

  describe('application/xml', () => {
    it('returns XML strings unchanged', () => {
      const xml = '<root><item>test</item></root>';
      expect(convertRequestBody(xml, 'application/xml')).toBe(xml);
    });

    it('throws when passed an object', () => {
      expect(() => convertRequestBody({ root: 'test' }, 'application/xml')).toThrow(
        'application/xml requires data to be an XML string'
      );
    });
  });

  describe('binary types', () => {
    it('returns Blob unchanged', () => {
      const blob = new Blob(['data']);
      expect(convertRequestBody(blob, 'application/octet-stream')).toBe(blob);
    });

    it('converts string to Blob', () => {
      const result = convertRequestBody('raw data', 'application/octet-stream');
      expect(result).toBeInstanceOf(Blob);
    });
  });

  describe('application/graphql', () => {
    it('returns query string unchanged', () => {
      const query = '{ users { id name } }';
      expect(convertRequestBody(query, 'application/graphql')).toBe(query);
    });

    it('stringifies object with query key', () => {
      const obj = { query: '{ users { id } }', variables: {} };
      expect(convertRequestBody(obj, 'application/graphql')).toBe(JSON.stringify(obj));
    });
  });

  describe('special binary formats (msgpack/protobuf)', () => {
    it('returns ArrayBuffer unchanged', () => {
      const buf = new ArrayBuffer(8);
      expect(convertRequestBody(buf, 'application/msgpack')).toBe(buf);
    });

    it('throws for non-binary data', () => {
      expect(() => convertRequestBody({ foo: 'bar' }, 'application/msgpack')).toThrow(
        'application/msgpack requires pre-encoded data'
      );
      expect(() => convertRequestBody({ foo: 'bar' }, 'application/x-protobuf')).toThrow(
        'application/x-protobuf requires pre-encoded data'
      );
    });
  });

  describe('image/audio/video uploads', () => {
    it('returns Blob unchanged', () => {
      const blob = new Blob(['img'], { type: 'image/png' });
      expect(convertRequestBody(blob, 'image/png')).toBe(blob);
    });

    it('converts ArrayBuffer to Blob', () => {
      const buf = new ArrayBuffer(4);
      const result = convertRequestBody(buf, 'image/jpeg');
      expect(result).toBeInstanceOf(Blob);
    });

    it('throws for plain objects', () => {
      expect(() => convertRequestBody({ data: 'img' }, 'image/png')).toThrow(
        'image/png requires data to be a File, Blob, or ArrayBuffer'
      );
    });
  });
});

// ---- needsConversion -------------------------------------------------------

describe('needsConversion', () => {
  it('returns false for null/undefined', () => {
    expect(needsConversion(null, 'application/json')).toBe(false);
    expect(needsConversion(undefined, 'application/json')).toBe(false);
  });

  it('returns true when JSON object is not yet stringified', () => {
    expect(needsConversion({ name: 'Alice' }, 'application/json')).toBe(true);
  });

  it('returns false when data is already a string for JSON', () => {
    expect(needsConversion('{"name":"Alice"}', 'application/json')).toBe(false);
  });

  it('returns true when form-urlencoded data is not URLSearchParams', () => {
    expect(needsConversion({ q: 'test' }, 'application/x-www-form-urlencoded')).toBe(true);
  });

  it('returns false when data is already URLSearchParams', () => {
    expect(needsConversion(new URLSearchParams(), 'application/x-www-form-urlencoded')).toBe(false);
  });

  it('returns true when multipart data is not FormData', () => {
    expect(needsConversion({ file: 'data' }, 'multipart/form-data')).toBe(true);
  });

  it('returns false when data is already FormData', () => {
    expect(needsConversion(new FormData(), 'multipart/form-data')).toBe(false);
  });

  it('returns true when binary data needs conversion', () => {
    expect(needsConversion('raw string', 'application/octet-stream')).toBe(true);
  });

  it('returns false when binary data is already Blob', () => {
    expect(needsConversion(new Blob(['data']), 'application/octet-stream')).toBe(false);
  });

  it('returns true when text data is not a string', () => {
    expect(needsConversion(42, 'text/plain')).toBe(true);
  });

  it('returns false when text data is already a string', () => {
    expect(needsConversion('hello', 'text/plain')).toBe(false);
  });

  it('returns false for unknown content types', () => {
    expect(needsConversion({ foo: 'bar' }, 'text/yaml')).toBe(true);
  });
});

// ---- safeConvertRequestBody ------------------------------------------------

describe('safeConvertRequestBody', () => {
  it('converts when needed', () => {
    const result = safeConvertRequestBody({ name: 'Alice' }, 'application/json');
    expect(result).toBe('{"name":"Alice"}');
  });

  it('returns data unchanged when no conversion needed', () => {
    const json = '{"name":"Alice"}';
    expect(safeConvertRequestBody(json, 'application/json')).toBe(json);

    const fd = new FormData();
    expect(safeConvertRequestBody(fd, 'multipart/form-data')).toBe(fd);

    const sp = new URLSearchParams();
    expect(safeConvertRequestBody(sp, 'application/x-www-form-urlencoded')).toBe(sp);
  });

  it('handles null gracefully', () => {
    expect(safeConvertRequestBody(null, 'application/json')).toBeNull();
  });
});
