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
import {
    AccountRestrictionDirectionValidator,
    AccountRestrictionTypeValidator,
} from '../../src/validators/restrictionType.validator';

describe('Account restriction direction validator', () => {
    it('valid direction incoming', () => {
        const value = 'incoming';
        expect(new AccountRestrictionDirectionValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('valid direction outgoing', () => {
        const value = 'outgoing';
        expect(new AccountRestrictionDirectionValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('invalid value', () => {
        const value = '123';
        expect(() => {
            new AccountRestrictionDirectionValidator().validate(value, {name: 'value', source: value});
        }).to.throws('restrictionDirection must be one of \'incoming\' or \'outgoing\'');
    });
});

describe('Account Restriction type validator', () => {
    it('valid value allow', () => {
        const value = 'allow';
        expect(new AccountRestrictionTypeValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('valid value block', () => {
        const value = 'block';
        expect(new AccountRestrictionTypeValidator().validate(value, {name: 'value', source: value}))
            .to.be.equal(undefined);
    });

    it('invalid value', () => {
        const value = '1';
        expect(() => {
            new AccountRestrictionTypeValidator().validate(value, {name: 'value', source: value});
        }).to.throws('restrictionType must be one of \'allow\' or \'block\'');
    });
});
