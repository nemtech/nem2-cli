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
import {NetworkType, Password, Address, SimpleWallet} from 'symbol-sdk'
import {expect} from 'chai'
import {HdProfile} from '../../src/models/hdProfile.model'
import {NetworkCurrency} from '../../src/models/networkCurrency.model'

const networkCurrency = NetworkCurrency.createFromDTO({namespaceId: 'symbol.xym', divisibility: 6})

describe('HdProfile', () => {
   it('should create a profile from mnemonic', () => {
      const generationHash = 'defaultGenerationHash'
      const isDefault = true
      const name = 'default'
      const networkType = NetworkType.TEST_NET
      const password = new Password('password')
      const url = 'http://localhost:3000'
      // eslint-disable-next-line max-len
      const mnemonic = 'uniform promote eyebrow frequent mother order evolve spell elite lady clarify accuse annual tenant rotate walnut wisdom render before million scrub scan crush sense'
      const expectedPath = 'm/44\'/4343\'/0\'/0\'/0\''
      const pathNumber = 0
      const expectedAddress = Address.createFromRawAddress(
         'TA4E47-MGAO57-ZJFORK-CFSPAD-BMWHLX-7UKMZJ-KAOD',
      )

      const profile = HdProfile.create({
         generationHash,
         isDefault,
         name,
         networkCurrency,
         networkType,
         password,
         url,
         mnemonic,
         pathNumber,
      })

      expect(profile.simpleWallet.address).to.deep.equal(expectedAddress)
      expect(profile.networkGenerationHash).to.equal(generationHash)
      expect(profile.type).to.equal('HD')
      expect(profile.isDefault).to.equal('1')
      expect(profile.name).to.equal(name)
      expect(profile.networkType).to.equal(networkType)
      expect(profile.url).to.equal(url)
      expect(profile.encryptedPassphrase).to.exist
      expect(profile.pathNumber).to.equal(pathNumber)
      expect(profile.path).to.equal(expectedPath)
      expect(profile).instanceOf(HdProfile)
   })

   it('createFromDTO should instantiate an HD wallet properly', () => {
      const networkType = NetworkType.TEST_NET
      const name = 'profile name'
      const password = new Password('password')
      const simpleWallet = SimpleWallet.createFromPrivateKey(
         name,
         password,
         'A58BD9618B47F5E6B6BACB9B37CC242EDE1A0461AAE8FF2084BC825209D90E18',
         networkType,
      )
      const encryptedPassphrase = 'encryptedPassphrase'
      const path = 'm/44\'/4343\'/0\'/0\'/0\''
      const url = 'http://localhost:3000'
      const networkGenerationHash = 'generationHash'
      const version = 3
      const isDefault = '0'
      const type = 'HD'

      const profile = HdProfile.createFromDTO({
         simpleWallet: simpleWallet.toDTO(),
         url,
         networkGenerationHash,
         networkCurrency: networkCurrency.toDTO(),
         version,
         default: isDefault,
         type,
         encryptedPassphrase,
         path,
      })

      expect(profile.simpleWallet.encryptedPrivateKey).to.deep.equal(simpleWallet.encryptedPrivateKey)
      expect(profile.networkGenerationHash).to.equal(networkGenerationHash)
      expect(profile.type).to.equal(type)
      expect(profile.isDefault).to.equal(isDefault)
      expect(profile.name).to.equal(name)
      expect(profile.networkType).to.equal(networkType)
      expect(profile.url).to.equal(url)
      expect(profile.encryptedPassphrase).to.equal(encryptedPassphrase)
      expect(profile.path).to.equal(path)
      expect(profile.pathNumber).to.equal(0)
      expect(profile).instanceOf(HdProfile)
   })

   it('should create a DTO', () => {
      const DTO = {
         simpleWallet: {
            name: 'profile name',
            network: 152,
            address: {
               address: 'TA4E47MGAO57ZJFORKCFSPADBMWHLX7UKMZJKAOD',
               networkType: 152,
            },
            creationDate: '2020-04-09T17:54:30.421',
            schema: 'simple_v1',
            encryptedPrivateKey: 'd47e526995324428257af732684420dbe718047cc8ae2fdfa7ae49f820a300c691ac558b8669d45105acc438b04df83e',
         },
         url: 'http://localhost:3000',
         networkGenerationHash: 'generationHash',
         networkCurrency: {namespaceId: 'symbol.xym', divisibility: 6},
         version: 3,
         default: '1',
         type: 'HD',
         encryptedPassphrase: 'encryptedPassphrase',
         path: 'm/44\'/4343\'/0\'/0\'/0\'',
      }

      const profile = HdProfile.createFromDTO(DTO)
      expect(profile).instanceOf(HdProfile)
      expect(profile.toDTO().simpleWallet.encryptedPrivateKey)
         .to.deep.equal(DTO.simpleWallet.encryptedPrivateKey)
   })
})
