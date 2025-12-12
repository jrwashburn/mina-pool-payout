import * as archiveProvider from '../core/dataProvider/dataprovider-archivedb/block-queries-sql.js';
import * as apiProvider from '../core/dataProvider/dataprovider-api/block-queries-api.js';
import * as minaExplorerProvider from '../core/dataProvider/dataprovider-minaexplorer/block-queries-gql.js';

const dataSource = process.env.BLOCK_DATA_SOURCE;

export function getProvider() {
  if (dataSource === 'ARCHIVEDB') return archiveProvider;
  if (dataSource === 'API') return apiProvider;
  return minaExplorerProvider;
}

export default getProvider();
