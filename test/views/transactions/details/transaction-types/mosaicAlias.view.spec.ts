import {expect} from 'chai'
import {AliasAction} from 'nem2-sdk'
import {MosaicAliasView} from '../../../../../src/views/transactions/details/transaction-types'
import {mosaicId1} from '../../../../mocks/mosaics.mock'
import {unsignedMosaicAlias1} from '../../../../mocks/transactions/mosaicAlias.mock'

describe('MosaicAliasView', () => {
 it('should return a view', () => {
  const view = MosaicAliasView.get(unsignedMosaicAlias1)
  expect(view['Alias action']).equal(AliasAction[AliasAction.Link])
  expect(view['Mosaic Id']).equal(mosaicId1.toHex())
  expect(view['Namespace Id']).equal('symbol.xym (E74B99BA41F4AFEE)')
 })
})
