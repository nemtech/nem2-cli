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

import {AccountRestrictionType} from 'nem2-sdk';

export class RestrictionService {

    constructor() {}

    public getAccountAddressRestrictionType(restrictionType: string, restrictionDirection: string): AccountRestrictionType {
        const lowerRestrictionType = restrictionType.toLowerCase();
        const lowerRestrictionDirection = restrictionDirection.toLowerCase();
        let accountRestrictionType;
        if ('allow' === lowerRestrictionType && 'outgoing' === lowerRestrictionDirection) {
            accountRestrictionType = AccountRestrictionType.AllowOutgoingAddress;
        } else if ('allow' === lowerRestrictionType && 'incoming' === lowerRestrictionDirection) {
            accountRestrictionType = AccountRestrictionType.AllowIncomingAddress;
        } else if ('block' === lowerRestrictionType && 'outgoing' === lowerRestrictionDirection) {
            accountRestrictionType = AccountRestrictionType.BlockOutgoingAddress;
        } else {
            accountRestrictionType = AccountRestrictionType.BlockIncomingAddress;
        }
        return accountRestrictionType;
    }

    public getAccountMosaicRestrictionType(restrictionType: string): AccountRestrictionType {
        let accountRestrictionType;
        if ('allow' === restrictionType.toLowerCase()) {
            accountRestrictionType = AccountRestrictionType.AllowMosaic;
        } else {
            accountRestrictionType = AccountRestrictionType.BlockMosaic;
        }
        return accountRestrictionType;
    }

    public getAccountOperationRestrictionType(restrictionType: string, restrictionDirection: string) {
        const lowerRestrictionType = restrictionType.toLowerCase();
        const lowerRestrictionDirection = restrictionDirection.toLowerCase();
        let accountRestrictionType;
        if ('allow' === lowerRestrictionType && 'outgoing' === lowerRestrictionDirection) {
            accountRestrictionType = AccountRestrictionType.AllowOutgoingTransactionType;
        } else if ('allow' === lowerRestrictionType && 'incoming' === lowerRestrictionDirection) {
            accountRestrictionType = AccountRestrictionType.AllowIncomingTransactionType;
        } else if ('block' === lowerRestrictionType && 'outgoing' === lowerRestrictionDirection) {
            accountRestrictionType = AccountRestrictionType.BlockOutgoingTransactionType;
        } else {
            accountRestrictionType = AccountRestrictionType.BlockIncomingTransactionType;
        }
        return accountRestrictionType;
    }
}
