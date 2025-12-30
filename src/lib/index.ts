import api from './api';
import withExample from './api/withExample';

type ExportType = typeof api & typeof withExample;

const exportedApi: ExportType = {
  ...api,
  ...withExample,
};

export default exportedApi;
