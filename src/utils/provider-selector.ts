const dataSource = process.env.BLOCK_DATA_SOURCE;
const provider =
    dataSource === 'ARCHIVEDB'
        ? require('../core/dataProvider/dataprovider-archivedb/block-queries-sql')
        : dataSource === 'API'
        ? require('../core/dataProvider/dataprovider-api/block-queries-api')
        : require('../core/dataProvider/dataprovider-minaexplorer/block-queries-gql');

export default provider;
