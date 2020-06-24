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
import { Validator } from 'clime';
import { TransactionGroup } from 'symbol-sdk';

/**
 * Validator of transaction group
 */
export class TransactionGroupValidator implements Validator<string> {
    /**
     * Validates if a transaction group  is valid.
     * @param {string} value - Transaction group.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        const test = value in TransactionGroup;
        return test ? true : 'TransactionGroup must be one of (Unconfirmed, Confirmed, Partial)';
    }
}
