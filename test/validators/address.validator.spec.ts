/*
 *
 * Copyright 2018 NEM
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
import {expect} from 'chai';
import {AddressValidator} from '../../src/validators/address.validator';

describe('address validator', () => {

    it('Invalid valid address (uppercase)', () => {
        const address = 'SB3KUBHATFCPV7UZQLWAQ2EUR6SIHBSBEOEDDDF3';
        expect(new AddressValidator().validate(address, {name: 'address', source: address}))
            .to.be.equal(undefined);
    });

    it('Invalid valid address (lowercase)', () => {
        const address = 'sb3kubhatfcpv7uzqlwaq2eur6sihbsbeoedddf3';
        expect(new AddressValidator().validate(address, {name: 'address', source: address}))
            .to.be.equal(undefined);
    });

    it('Invalid valid address (line)', () => {
        const address = 'SB3KUB-HATFCP-V7UZQL-WAQ2EU-R6SIHB-SBEOED-DDF3';
        expect(new AddressValidator().validate(address, {name: 'address', source: address}))
            .to.be.equal(undefined);
    });

    it('Invalid address is not valid ()', () => {
        const address = 'SCKGDA-CNNOP2-DH3Z7D-HQB2VA-HYDLVX-DUAOIY-ELQF';
        expect(new AddressValidator().validate(address,
            {name: 'address', source: address})).to.be.equal(undefined);
    });

});
