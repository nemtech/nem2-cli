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
import {Account, NetworkType, Password, SimpleWallet} from 'nem2-sdk'
import {Profile} from '../../src/models/profile'

describe('Profile', () => {
    it('should contain the fields', () => {
        const profile = new Profile(
            SimpleWallet.create('default', new Password('password'), NetworkType.MIJIN_TEST),
            'url',
            'generationHash',
        )
        expect(profile.name).to.be.equal('default')
        expect(profile.networkGenerationHash).to.be.equal('generationHash')
        expect(profile.url).to.be.equal('url')
        expect(profile.networkType).to.be.equal(NetworkType.MIJIN_TEST)
    })

    it('should be created from DTO', () => {
        const profile = Profile.createFromDTO(
            {
                simpleWallet: {
                    name: 'default',
                    network: NetworkType.MIJIN_TEST,
                    address: {
                        address: Account.generateNewAccount(NetworkType.MIJIN_TEST).address.plain(),
                        networkType: NetworkType.MIJIN_TEST,
                    },
                    creationDate: 'test',
                    schema: 'test',
                    encryptedPrivateKey: {
                        encryptedKey: 'test',
                        iv: 'test',
                    },
                },
                networkGenerationHash: 'generationHash',
                url: 'url',
            })
        expect(profile.name).to.be.equal('default')
        expect(profile.networkGenerationHash).to.be.equal('generationHash')
        expect(profile.url).to.be.equal('url')
        expect(profile.networkType).to.be.equal(NetworkType.MIJIN_TEST)
    })

    it('should validate if password opens wallet', () => {
        const privateKey =  '0'.repeat(64)
        const password = new Password('password')
        const simpleWallet = SimpleWallet.createFromPrivateKey(
            'default',
            password,
            privateKey,
            NetworkType.MIJIN_TEST)
        const profile = new Profile(
            simpleWallet,
            'url',
            'generationHash',
        )
        expect(profile.isPasswordValid(new Password('12345678'))).to.be.equal(false)
        expect(profile.isPasswordValid(password)).to.be.equal(true)
    })

    it('should decrypt profile', () => {
        const privateKey =  '0'.repeat(64)
        const password = new Password('password')
        const simpleWallet = SimpleWallet.createFromPrivateKey(
            'default',
            password,
            privateKey,
            NetworkType.MIJIN_TEST)
        const profile = new Profile(
            simpleWallet,
            'url',
            'generationHash',
        )
        const profileOptions = {password: 'password'} as any
        expect(profile.decrypt(profileOptions).privateKey).to.be.equal(privateKey)
        expect(profile.address).to.be.equal(simpleWallet.address)
    })

    it('should throw error if trying to decrypt profile with an invalid password', () => {
        const privateKey =  '0'.repeat(64)
        const password = new Password('password')
        const simpleWallet = SimpleWallet.createFromPrivateKey(
            'default',
            password,
            privateKey,
            NetworkType.MIJIN_TEST)
        const profile = new Profile(
            simpleWallet,
            'url',
            'generationHash',
        )
        const profileOptions = {password: 'test12345678'} as any
        expect(() => profile.decrypt(profileOptions))
            .to.throws('The password provided does not match your account password')
    })
})
