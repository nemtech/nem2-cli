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
import {
    AccountRestrictionFlagsValidator,
    MosaicRestrictionTypeValidator,
} from '../../src/validators/restrictionType.validator'

describe('mosaic restriction type validator', () => {
    it('valid mosaic restriction type', () => {
        const restriction = 'EQ'
        expect(new MosaicRestrictionTypeValidator().validate(restriction))
            .to.be.equal(true)
    })

    it('invalid mosaic restriction type', () => {
        const restriction = '99'
        expect(
            new MosaicRestrictionTypeValidator().validate(restriction)
        ).to.include('MosaicRestrictionType must be one of')
    })
})

describe('account restriction flags validator', () => {
    it('valid account restriction flag', () => {
        const restriction = 'AllowIncomingAddress'
        expect(new AccountRestrictionFlagsValidator().validate(restriction))
            .to.be.equal(true)
    })

    it('invalid account restriction flag', () => {
        const restriction = '99'
        expect(
            new AccountRestrictionFlagsValidator().validate(restriction)
        ).to.include('AccountRestrictionFlags must be one of')
    })
})

