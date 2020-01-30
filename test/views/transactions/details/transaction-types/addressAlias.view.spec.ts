import {expect} from 'chai'
import {AliasAction} from 'nem2-sdk'
import {AddressAliasView} from '../../../../../src/views/transactions/details/transaction-types'
import {account1} from '../../../../mocks/accounts.mock'
import {unsignedAddressAlias1} from '../../../../mocks/transactions/addressAlias.mock'

describe('AddressAliasView', () => {
 it('should return a view', () => {
  const view = AddressAliasView.get(unsignedAddressAlias1)
  expect(view['action']).equal(AliasAction[unsignedAddressAlias1.aliasAction])
  expect(view['address']).equal(account1.address.pretty())
  expect(view['namespace']).equal('symbol.xym (E74B99BA41F4AFEE)')
 })
})
