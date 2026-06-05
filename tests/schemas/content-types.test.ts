import { responseContentTypeSchema, requestContentTypeSchema } from '../../src/schemas/content-types';

describe('responseContentTypeSchema', () => {
  it('accepts all major application types', () => {
    expect(() => responseContentTypeSchema.parse('application/json')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('application/xml')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('application/pdf')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('application/octet-stream')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('application/zip')).not.toThrow();
  });

  it('accepts text types', () => {
    expect(() => responseContentTypeSchema.parse('text/plain')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('text/html')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('text/csv')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('text/markdown')).not.toThrow();
  });

  it('accepts image types', () => {
    expect(() => responseContentTypeSchema.parse('image/png')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('image/jpeg')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('image/gif')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('image/svg+xml')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('image/webp')).not.toThrow();
  });

  it('accepts audio types', () => {
    expect(() => responseContentTypeSchema.parse('audio/mpeg')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('audio/ogg')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('audio/wav')).not.toThrow();
  });

  it('accepts video types', () => {
    expect(() => responseContentTypeSchema.parse('video/mp4')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('video/webm')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('video/mpeg')).not.toThrow();
  });

  it('accepts Microsoft Office formats', () => {
    expect(() =>
      responseContentTypeSchema.parse(
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
    ).not.toThrow();
    expect(() =>
      responseContentTypeSchema.parse(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ).not.toThrow();
  });

  it('accepts vendor-specific types', () => {
    expect(() => responseContentTypeSchema.parse('application/vnd.github+json')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('application/vnd.github.v3+json')).not.toThrow();
  });

  it('accepts JSON API related types', () => {
    expect(() => responseContentTypeSchema.parse('application/vnd.api+json')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('application/ld+json')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('application/json-patch+json')).not.toThrow();
    expect(() => responseContentTypeSchema.parse('application/merge-patch+json')).not.toThrow();
  });

  it('rejects unknown content types', () => {
    expect(() => responseContentTypeSchema.parse('application/unknown')).toThrow();
    expect(() => responseContentTypeSchema.parse('text/unknown')).toThrow();
    expect(() => responseContentTypeSchema.parse('')).toThrow();
    expect(() => responseContentTypeSchema.parse('not-a-content-type')).toThrow();
  });

  it('returns the parsed value unchanged', () => {
    expect(responseContentTypeSchema.parse('application/json')).toBe('application/json');
    expect(responseContentTypeSchema.parse('text/plain')).toBe('text/plain');
  });
});

describe('requestContentTypeSchema', () => {
  it('accepts standard request types', () => {
    expect(() => requestContentTypeSchema.parse('application/json')).not.toThrow();
    expect(() => requestContentTypeSchema.parse('application/x-www-form-urlencoded')).not.toThrow();
    expect(() => requestContentTypeSchema.parse('multipart/form-data')).not.toThrow();
    expect(() => requestContentTypeSchema.parse('application/octet-stream')).not.toThrow();
  });

  it('accepts text types', () => {
    expect(() => requestContentTypeSchema.parse('text/plain')).not.toThrow();
    expect(() => requestContentTypeSchema.parse('text/html')).not.toThrow();
    expect(() => requestContentTypeSchema.parse('text/csv')).not.toThrow();
  });

  it('accepts file upload types', () => {
    expect(() => requestContentTypeSchema.parse('image/png')).not.toThrow();
    expect(() => requestContentTypeSchema.parse('image/jpeg')).not.toThrow();
    expect(() => requestContentTypeSchema.parse('audio/mpeg')).not.toThrow();
    expect(() => requestContentTypeSchema.parse('video/mp4')).not.toThrow();
  });

  it('accepts GraphQL type', () => {
    expect(() => requestContentTypeSchema.parse('application/graphql')).not.toThrow();
  });

  it('rejects content types not valid for requests', () => {
    expect(() => requestContentTypeSchema.parse('application/unknown')).toThrow();
    expect(() => requestContentTypeSchema.parse('')).toThrow();
  });
});
