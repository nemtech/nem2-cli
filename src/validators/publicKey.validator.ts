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

import { NetworkType, PublicAccount } from 'symbol-sdk';

import { Validator } from './validator';

/**
 * Public key validator
 */
export class PublicKeyValidator implements Validator<string> {
    /**
     * Validates a public key format.
     * @param {string} value - Public key.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        try {
            PublicAccount.createFromPublicKey(value, NetworkType.MIJIN_TEST);
        } catch {
            return 'Public key must be a 64 characters hexadecimal string';
        }
        return true;
    }
}
