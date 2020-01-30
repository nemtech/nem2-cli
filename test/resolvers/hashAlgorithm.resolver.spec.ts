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
import {HashType} from 'nem2-sdk'
import {HashAlgorithmResolver} from '../../src/resolvers/hashAlgorithm.resolver'

describe('Hash algorithm resolver', () => {

    it('should return hash algorithm', () => {
        const profileOptions = {hashAlgorithm: 'Op_Sha3_256'} as any
        expect(new HashAlgorithmResolver().resolve(profileOptions))
            .to.be.equal(HashType.Op_Sha3_256)
    })

    it('should return hash algorithm (number)', () => {
        const profileOptions = {hashAlgorithm: '0'} as any
        expect(new HashAlgorithmResolver().resolve(profileOptions))
            .to.be.equal(HashType.Op_Sha3_256)
    })

    it('should throw error if unknown', () => {
        const profileOptions = {hashAlgorithm: 6} as any
        expect(() => new HashAlgorithmResolver().resolve(profileOptions))
            .to.throws(Error)
    })

})
