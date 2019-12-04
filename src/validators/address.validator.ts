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
import {ExpectedError, ValidationContext, Validator} from 'clime';
import {Address, NamespaceId} from 'nem2-sdk';

export class AddressValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        try {
            Address.createFromRawAddress(value);
        } catch (err) {
            throw new ExpectedError('Introduce a valid address. Example: SBI774-YMFDZI-FPEPC5-4EKRC2-5DKDZJ-H2QVRW-4HBP');
        }
    }
}

export class AddressAliasValidator implements Validator<string> {
    validate(value: string, context: ValidationContext): void {
        const aliasTag = '@';
        if (value.charAt(0) !== aliasTag) {
            try {
                Address.createFromRawAddress(value);
            } catch (error) {
                throw new ExpectedError('Introduce a valid address. Example: SBI774-YMFDZI-FPEPC5-4EKRC2-5DKDZJ-H2QVRW-4HBP');
            }
        } else {
            const alias = value.substring(1);
            try {
                const ignored = new NamespaceId(alias);
            } catch (error) {
                throw new ExpectedError('Introduce a valid alias. Example: @xem');
            }
        }
    }
}
