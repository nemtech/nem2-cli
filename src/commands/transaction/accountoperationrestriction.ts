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
import {command, metadata, option} from 'clime';
import {AccountRestrictionTransaction, Deadline} from 'nem2-sdk';
import {ActionResolver} from '../../resolvers/action.resolver';
import {AnnounceResolver} from '../../resolvers/announce.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {RestrictionAccountOperationFlagsResolver} from '../../resolvers/restrictionAccount.resolver';
import {TransactionTypeResolver} from '../../resolvers/transactionType.resolver';
import {
    AnnounceTransactionFieldsTable,
    AnnounceTransactionsCommand,
    AnnounceTransactionsOptions,
} from '../announce.transactions.command';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'f',
        description: 'Restriction flag. (0: AllowOutgoingTransactionType, 1: BlockOutgoingTransactionType)',
    })
    flags: number;

    @option({
        flag: 'a',
        description: 'Modification action. (1: Add, 0: Remove).',
    })
    action: number;

    @option({
        flag: 'v',
        description: 'Transaction type formatted as hex.',
    })
    transactionType: string;
}

@command({
    description: 'Allow or block outgoing transactions by transaction type',
})
export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const action = new ActionResolver().resolve(options);
        const flags = new RestrictionAccountOperationFlagsResolver().resolve(options);
        const transactionType = new TransactionTypeResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const transaction = AccountRestrictionTransaction.createOperationRestrictionModificationTransaction(
            Deadline.create(),
            flags,
            (action === 1) ? [transactionType] : [],
            (action === 0) ? [transactionType] : [],
            profile.networkType,
            maxFee);
        const signedTransaction = account.sign(transaction, profile.networkGenerationHash);

        console.log(new AnnounceTransactionFieldsTable(signedTransaction, profile.url).toString('Transaction Information'));
        const shouldAnnounce = new AnnounceResolver().resolve(options);
        if (shouldAnnounce && options.sync) {
            this.announceTransactionSync(signedTransaction, profile.address, profile.url);
        } else if (shouldAnnounce) {
            this.announceTransaction(signedTransaction, profile.url);
        }
    }
}
