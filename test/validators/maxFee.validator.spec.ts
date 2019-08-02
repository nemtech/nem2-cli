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
import {expect} from 'chai';
import {MaxFeeValidator} from '../../src/validators/maxFee.validator';

describe('Maximum fee validator', () => {

    it('Valid maximum fee', () => {
        const maxfee = 123;
        expect(new MaxFeeValidator().validate(maxfee, {name: 'maxfee', source: maxfee.toString()}))
            .to.be.equal(undefined);
    });

    it('Invalid maximum fee (negative)', () => {
        const maxfee = -1;
        expect(() => {
            new MaxFeeValidator().validate(maxfee, {name: 'maxfee', source: maxfee.toString()});
        }).to.throws('maxfee should be positive integer or equal to 0');
    });

    it('Invalid maximum fee (decimal)', () => {
        const maxfee = 0.33;
        expect(() => {
            new MaxFeeValidator().validate(maxfee, {name: 'maxfee', source: maxfee.toString()});
        }).to.throws('maxfee should be positive integer or equal to 0');
    });
});
