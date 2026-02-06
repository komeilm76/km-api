import { z } from 'zod/v4';
import apiConfigFactory from './';
import adapters, {
  convertResponseType,
  convertResponseTypes,
  toAxiosResponseType,
  toUniAppResponseType,
  toXHRResponseType,
  toTaroResponseType,
  toFetchResponseMethod,
} from './adapters';

// ==========================================
// Example 1: Basic Axios Adapter Usage
// ==========================================

const getUsersApi = apiConfigFactory.makeApiConfig({
  method: 'GET',
  path: '/users',
  summary: 'Get users',
  responseContentType: 'application/json',
  requestContentType: 'application/json',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({ page: z.number() }),
    headers: z.object({ Authorization: z.string() }),
    cookies: z.object({}),
  },
  response: {
    success: z.object({ id: z.string(), name: z.string() }),
    error: z.object({ message: z.string() }),
  },
});

// Convert to Axios config
const axiosConfig = convertResponseType(getUsersApi.responseContentType!, 'axios');
console.log('Axios Config:', axiosConfig);
// Output: { responseType: 'json' }

// Use with Axios
/*
import axios from 'axios';

const response = await axios({
  method: getUsersApi.method.toLowerCase(),
  url: getUsersApi.path,
  ...axiosConfig,
});
*/

// ==========================================
// Example 2: PDF Download with Multiple Adapters
// ==========================================

const downloadPdfApi = apiConfigFactory.makeApiConfig({
  method: 'GET',
  path: '/reports/:reportId',
  summary: 'Download PDF report',
  responseContentType: 'application/pdf',
  requestContentType: 'application/json',
  request: {
    body: z.any(),
    params: z.object({ reportId: z.string() }),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    success: z.instanceof(Blob),
    error: z.object({ message: z.string() }),
  },
});

// Convert for different adapters
const pdfAxios = convertResponseType(downloadPdfApi.responseContentType!, 'axios');
const pdfUniApp = convertResponseType(downloadPdfApi.responseContentType!, 'alova-uniapp');
const pdfTaro = convertResponseType(downloadPdfApi.responseContentType!, 'alova-taro');
const pdfFetch = convertResponseType(downloadPdfApi.responseContentType!, 'fetch');

console.log('PDF Axios:', pdfAxios); // { responseType: 'blob' }
console.log('PDF UniApp:', pdfUniApp); // { responseType: 'arraybuffer' }
console.log('PDF Taro:', pdfTaro); // { responseType: 'arraybuffer', dataType: 'arraybuffer' }
console.log('PDF Fetch:', pdfFetch); // { responseMethod: 'blob' }

// ==========================================
// Example 3: Text Response with Encoding
// ==========================================

const getTextApi = apiConfigFactory.makeApiConfig({
  method: 'GET',
  path: '/text-data',
  summary: 'Get text data',
  responseContentType: 'text/plain',
  requestContentType: 'application/json',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    success: z.string(),
    error: z.object({ message: z.string() }),
  },
});

const textAxiosConfig = convertResponseType(getTextApi.responseContentType!, 'axios');
console.log('Text Axios:', textAxiosConfig);
// Output: { responseType: 'text', responseEncoding: 'utf-8' }

// ==========================================
// Example 4: XML Response with Different Adapters
// ==========================================

const xmlAxios = convertResponseType('application/xml', 'axios');
const xmlXHR = convertResponseType('application/xml', 'alova-xhr');
const xmlFetch = convertResponseType('application/xml', 'fetch');

console.log('XML Axios:', xmlAxios); // { responseType: 'document' }
console.log('XML XHR:', xmlXHR); // { responseType: 'document' }
console.log('XML Fetch:', xmlFetch); // { responseMethod: 'text' }

// ==========================================
// Example 5: Batch Conversion
// ==========================================

const contentTypes = ['application/json', 'application/pdf', 'text/plain', 'image/png'] as const;

const axiosConfigs = convertResponseTypes(
  ['application/json', 'application/pdf', 'text/plain', 'image/png'],
  'axios'
);
console.log('Batch Axios Configs:', axiosConfigs);
// Output: [
//   { responseType: 'json' },
//   { responseType: 'blob' },
//   { responseType: 'text', responseEncoding: 'utf-8' },
//   { responseType: 'blob' }
// ]

// ==========================================
// Example 6: Direct Adapter Functions
// ==========================================

// Axios
const axiosJson = toAxiosResponseType('application/json');
console.log('Axios JSON:', axiosJson);
// { responseType: 'json' }

// UniApp
const uniappImage = toUniAppResponseType('image/png');
console.log('UniApp Image:', uniappImage);
// { responseType: 'arraybuffer' }

// XHR
const xhrText = toXHRResponseType('text/html');
console.log('XHR Text:', xhrText);
// { responseType: 'text' }

// Taro
const taroJson = toTaroResponseType('application/json');
console.log('Taro JSON:', taroJson);
// { responseType: 'text', dataType: 'json' }

// Fetch
const fetchBlob = toFetchResponseMethod('application/pdf');
console.log('Fetch Blob:', fetchBlob);
// { responseMethod: 'blob' }

// ==========================================
// Example 7: Real-World Axios Usage
// ==========================================

const uploadImageApi = apiConfigFactory.makeApiConfig({
  method: 'POST',
  path: '/images/upload',
  summary: 'Upload image',
  responseContentType: 'application/json',
  requestContentType: 'multipart/form-data',
  request: {
    body: z.object({
      image: z.instanceof(File),
      title: z.string(),
    }),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({ Authorization: z.string() }),
    cookies: z.object({}),
  },
  response: {
    success: z.object({
      imageId: z.string(),
      url: z.string(),
    }),
    error: z.object({ message: z.string() }),
  },
});

const uploadAxiosConfig = convertResponseType(uploadImageApi.responseContentType!, 'axios');

console.log('Complete Axios Request Config:');
console.log({
  method: uploadImageApi.method.toLowerCase(),
  url: uploadImageApi.path,
  headers: {
    'Content-Type': uploadImageApi.requestContentType,
  },
  ...uploadAxiosConfig,
});

// Complete Axios implementation:
/*
import axios from 'axios';

const formData = new FormData();
formData.append('image', imageFile);
formData.append('title', 'My Image');

const response = await axios({
  method: uploadImageApi.method.toLowerCase(),
  url: uploadImageApi.path,
  headers: {
    'Authorization': 'Bearer token123',
    'Content-Type': 'multipart/form-data',
  },
  data: formData,
  ...uploadAxiosConfig, // { responseType: 'json' }
});
*/

// ==========================================
// Example 8: Real-World Alova Usage (UniApp)
// ==========================================

const mobileDownloadApi = apiConfigFactory.makeApiConfig({
  method: 'GET',
  path: '/downloads/report',
  summary: 'Download report on mobile',
  responseContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  requestContentType: 'application/json',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({ reportType: z.string() }),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    success: z.instanceof(ArrayBuffer),
    error: z.object({ message: z.string() }),
  },
});

const uniappConfig = convertResponseType(mobileDownloadApi.responseContentType!, 'alova-uniapp');
console.log('UniApp Excel Config:', uniappConfig);
// { responseType: 'arraybuffer' }

// Complete Alova + UniApp implementation:
/*
import { createAlova } from 'alova';
import uniappAdapter from '@alova/adapter-uniapp';

const alova = createAlova({
  requestAdapter: uniappAdapter(),
});

const response = await alova.Get(mobileDownloadApi.path, {
  params: { reportType: 'monthly' },
  ...uniappConfig, // { responseType: 'arraybuffer' }
});
*/

// ==========================================
// Example 9: Real-World Taro Usage
// ==========================================

const taroImageApi = apiConfigFactory.makeApiConfig({
  method: 'GET',
  path: '/images/:imageId',
  summary: 'Get image on Taro',
  responseContentType: 'image/jpeg',
  requestContentType: 'application/json',
  request: {
    body: z.any(),
    params: z.object({ imageId: z.string() }),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    success: z.instanceof(ArrayBuffer),
    error: z.object({ message: z.string() }),
  },
});

const taroConfig = convertResponseType(taroImageApi.responseContentType!, 'alova-taro');
console.log('Taro Image Config:', taroConfig);
// { responseType: 'arraybuffer', dataType: 'arraybuffer' }

// ==========================================
// Example 10: Real-World Fetch API Usage
// ==========================================

const fetchJsonApi = apiConfigFactory.makeApiConfig({
  method: 'GET',
  path: '/api/data',
  summary: 'Get data using Fetch',
  responseContentType: 'application/json',
  requestContentType: 'application/json',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    success: z.object({ data: z.array(z.any()) }),
    error: z.object({ message: z.string() }),
  },
});

const fetchConfig = convertResponseType(fetchJsonApi.responseContentType!, 'fetch');
console.log('Fetch Config:', fetchConfig);
// { responseMethod: 'json' }

// Complete Fetch implementation:
/*
const response = await fetch(fetchJsonApi.path);
const data = await response[fetchConfig.responseMethod]();
// Calls response.json()
*/

// ==========================================
// Example 11: Switching Adapters in Projects
// ==========================================

// Define your API once
const downloadApi = apiConfigFactory.makeApiConfig({
  method: 'GET',
  path: '/download/file',
  summary: 'Download file',
  responseContentType: 'application/pdf',
  requestContentType: 'application/json',
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    success: z.instanceof(Blob),
    error: z.object({ message: z.string() }),
  },
});

// // Easily switch between adapters
// type CurrentAdapter = 'axios' | 'fetch' | 'alova-uniapp';
// const currentAdapter: CurrentAdapter = 'axios'; // Change this based on your environment

// const adapterConfig = convertResponseType(downloadApi.responseContentType!, currentAdapter);

// console.log(`Using ${currentAdapter}:`, adapterConfig);

// // Your HTTP client logic adapts automatically
// switch (currentAdapter) {
//   case 'axios':
//     // Use adapterConfig.responseType
//     break;
//   case 'fetch':
//     // Use adapterConfig.responseMethod
//     break;
//   case 'alova-uniapp':
//     // Use adapterConfig.responseType and adapterConfig.dataType
//     break;
// }

console.log('✅ All adapter examples completed!');
console.log('🎯 Adapters are type-safe and support multiple HTTP clients');
console.log('🔄 Easy to switch between adapters in different environments');
