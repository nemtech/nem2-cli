/*
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
import {Deadline, MosaicSupplyChangeTransaction} from 'nem2-sdk';
import {SupplyActionResolver} from '../../resolvers/action.resolver';
import {AmountResolver} from '../../resolvers/amount.resolver';
import {AnnounceResolver} from '../../resolvers/announce.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {MosaicIdResolver} from '../../resolvers/mosaic.resolver';
import {
    AnnounceTransactionFieldsTable,
    AnnounceTransactionsCommand,
    AnnounceTransactionsOptions,
} from '../announce.transactions.command';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Mosaic supply change action (1: Increase, 0: Decrease).',
    })
    action: number;

    @option({
        flag: 'm',
        description: 'Mosaic id in hexadecimal format.',
    })
    mosaicId: string;

    @option({
        flag: 'd',
        description: 'Atomic amount of supply change.',
    })
    amount: string;
}

@command({
    description: 'Change a mosaic supply',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const mosaicId = new MosaicIdResolver().resolve(options);
        const action = new SupplyActionResolver().resolve(options);
        const amount = new AmountResolver()
            .resolve(options, undefined, 'Enter absolute amount of supply change: ');
        const maxFee = new MaxFeeResolver().resolve(options);

        const transaction = MosaicSupplyChangeTransaction.create(
            Deadline.create(),
            mosaicId,
            action,
            amount,
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
