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

import {ExpectedError} from 'clime';
import {Address, NamespaceId} from 'nem2-sdk';

export class AccountService {

    public static ALIAS_TAG = '@';

    constructor() {

    }

    static getRecipient(rawRecipient: string): Address | NamespaceId {
        let recipient: Address | NamespaceId;
        if (rawRecipient.charAt(0) === AccountService.ALIAS_TAG) {
            recipient =  new NamespaceId(rawRecipient.substring(1));
        } else  {
            try {
                recipient = Address.createFromRawAddress(rawRecipient);
            } catch (err) {
                throw new ExpectedError('Introduce a valid address');
            }
        }
        return recipient;
    }
}
