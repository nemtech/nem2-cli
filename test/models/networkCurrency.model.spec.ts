/*
 *
 * Copyright 2018-present NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import {expect} from 'chai'
import {NamespaceId} from 'symbol-sdk'
import {NetworkCurrency} from '../../src/models/networkCurrency.model'
import {block1Transactions} from '../mocks/transactions/block1Transactions.mock'

describe('Network currency', () => {
 it('createFromDTO instantiate the network currency', () => {
  const networkCurrency = NetworkCurrency.createFromDTO({
   namespaceId: 'symbol.xym', divisibility: 6,
  })
  expect(networkCurrency).instanceOf(NetworkCurrency)
  expect(networkCurrency.namespaceId).deep.equal(new NamespaceId('symbol.xym'))
  expect(networkCurrency.divisibility).equal(6)
 })

 it('createFromFirstBlockTransactions instantiates a network currency', () => {
  const networkCurrency = NetworkCurrency.createFromFirstBlockTransactions(block1Transactions)
  expect(networkCurrency).instanceOf(NetworkCurrency)
  expect(networkCurrency.namespaceId).deep.equal(new NamespaceId('symbol.xym'))
  expect(networkCurrency.divisibility).equal(6)
 })

 it('toDTO creates a network currency DTO', () => {
  const DTO = {namespaceId: 'symbol.xym', divisibility: 6}
  const networkCurrency = NetworkCurrency.createFromDTO(DTO)
  expect(networkCurrency.toDTO()).deep.equal(DTO)
 })
})
