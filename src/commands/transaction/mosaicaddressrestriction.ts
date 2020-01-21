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
import {Deadline, MosaicRestrictionTransactionService, NamespaceHttp, RestrictionMosaicHttp} from 'nem2-sdk';
import {AddressAliasResolver} from '../../resolvers/address.resolver';
import {AnnounceResolver} from '../../resolvers/announce.resolver';
import {KeyResolver} from '../../resolvers/key.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';
import {MosaicIdAliasResolver} from '../../resolvers/mosaic.resolver';
import {RestrictionValueResolver} from '../../resolvers/restrictionValue.resolver';
import {
    AnnounceTransactionFieldsTable,
    AnnounceTransactionsCommand,
    AnnounceTransactionsOptions,
} from '../announce.transactions.command';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'm',
        description: 'Mosaic identifier or @alias being restricted.',
    })
    mosaicId: string;

    @option({
        flag: 'a',
        description: 'Address or @alias being restricted.',
    })
    targetAddress: string;

    @option({
        flag: 'k',
        description: 'Restriction key.',
    })
    restrictionKey: string;

    @option({
        flag: 'V',
        description: 'New restriction value.',
    })
    newRestrictionValue: string;
}

@command({
    description: 'Set a mosaic restriction to an specific address (requires internet)',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }
    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const mosaicId = new MosaicIdAliasResolver().resolve(options);
        const targetAddress = new AddressAliasResolver()
            .resolve(options, undefined, 'Enter the restricted target address or alias: ', 'targetAddress');
        const restrictionKey = new KeyResolver()
            .resolve(options, undefined, undefined, 'restrictionKey');
        const restrictionValue = new RestrictionValueResolver().resolve(options);
        const maxFee = new MaxFeeResolver().resolve(options);

        const restrictionMosaicHttp = new RestrictionMosaicHttp(profile.url);
        const namespaceHttp = new NamespaceHttp(profile.url);
        const mosaicRestrictionTransactionService =
            new MosaicRestrictionTransactionService(restrictionMosaicHttp, namespaceHttp);

        const mosaicAddressRestrictionTransaction = await mosaicRestrictionTransactionService
            .createMosaicAddressRestrictionTransaction(
                Deadline.create(),
                profile.networkType,
                mosaicId,
                restrictionKey,
                targetAddress,
                restrictionValue,
                maxFee).toPromise();

        const signedTransaction = account.sign(mosaicAddressRestrictionTransaction, profile.networkGenerationHash);

        console.log(new AnnounceTransactionFieldsTable(signedTransaction, profile.url).toString('Transaction Information'));
        const shouldAnnounce = new AnnounceResolver().resolve(options);
        if (shouldAnnounce && options.sync) {
            this.announceTransactionSync(signedTransaction, profile.address, profile.url);
        } else if (shouldAnnounce) {
            this.announceTransaction(signedTransaction, profile.url);
        }
    }
}
