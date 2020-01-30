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
import {AnnounceResolver} from '../../src/resolvers/announce.resolver'

describe('Announce resolver', () => {

    it('should return boolean', () => {
        const profileOptions = {
            announce: true,
            url: '',
            network: '',
            profile: '',
            password: '',
            generationHash: '1',
            maxFee: '1',
            sync: false}
        expect(new AnnounceResolver().resolve(profileOptions)).to.be.equal(true)
    })

})
