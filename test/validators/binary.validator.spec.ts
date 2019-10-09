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
import {BinaryValidator} from '../../src/validators/binary.validator';

describe('binary validator', () => {

    it('1', () => {
        const value = 1;
        expect(new BinaryValidator().validate(value, {name: 'value', source: value.toString()}))
            .to.be.equal(undefined);
    });

    it('0', () => {
        const value = 0;
        expect(new BinaryValidator().validate(value, {name: 'value', source: value.toString()}))
            .to.be.equal(undefined);
    });

    it('negative', () => {
        const value = -1;
        expect(() => {
            new BinaryValidator().validate(value, {name: 'value', source: value.toString()});
        }).to.throws('The value must be 0 or 1.');
    });

    it('decimal', () => {
        const value = 1.1;
        expect(() => {
            new BinaryValidator().validate(value, {name: 'value', source: value.toString()});
        }).to.throws('The value must be 0 or 1.');
    });
});
