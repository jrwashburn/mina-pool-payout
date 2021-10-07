const dataSource = process.env.BLOCK_DATA_SOURCE;
const provider =
    dataSource === 'ARCHIVEDB'
        ? require('../core/dataProvider/dataprovider-archivedb/block-queries-sql')
        : require('../core/dataProvider/dataprovider-minaexplorer/block-queries-gql');

export default provider;
