import { getLatestHeight, getBlocks } from '../Core/DataProvider/dataprovider-archivedb/block-queries-sql'

//This tests are not meant to run automatically
describe('block-queries-sql tests', () => {
    describe('Should return latest height', () => {
        it.skip('Succesfully', ()=> {
            getLatestHeight().then((result) => {
                expect(result).toBe(24170)
            })
        })
    })
    describe('Should return blocks', () => {
        it.skip('Succesfully', ()=> {
            getBlocks('B62qrxNgwAdhGYZv1BXQRt2HgopUceFyrtXZMikwsuaHu5FigRJjhwY',0,1000).then((result) => {
                
                expect(result).toBe(24170)
            })
        })
    })
})