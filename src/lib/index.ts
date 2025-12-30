import api from './api';

type ExportType = typeof api;

const exportedApi: ExportType = {
  ...api,
};

export default exportedApi;
