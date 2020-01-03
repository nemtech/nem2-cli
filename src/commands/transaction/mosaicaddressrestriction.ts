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
import chalk from 'chalk';
import { command, metadata, option } from 'clime';
import {
    Deadline,
    MosaicAddressRestrictionTransaction,
    UInt64,
} from 'nem2-sdk';
import { AnnounceTransactionsCommand, AnnounceTransactionsOptions } from '../../announce.transactions.command';
import { TargetAddressResolver } from '../../resolvers/address.resolver';
import { MosaicIdAliasResolver } from '../../resolvers/mosaic.resolver';
import { RestrictionKeyResolver } from '../../resolvers/restrictionKey.resolver';
import { RestrictionValueResolver } from '../../resolvers/restrictionValue.resolver';
import { NumericStringValidator } from '../../validators/numericString.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'i',
        description: 'Identifier of the mosaic being restricted.',
    })
    mosaicId: string;

    @option({
        flag: 'a',
        description: 'Address being restricted.',
    })
    targetAddress: string;

    @option({
        flag: 'k',
        description: 'Restriction key relative to the reference mosaic identifier.',
    })
    restrictionKey: string;

    @option({
        flag: 'V',
        description: 'New restriction value.',
        validator: new NumericStringValidator(),
    })
    newRestrictionValue: string;
}

@command({
    description: 'Set a mosaic restriction to an specific address',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }
    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);
        const mosaicId = new MosaicIdAliasResolver().resolve(options);
        const targetAddress = new TargetAddressResolver().resolve(options);
        const restrictionKey = new RestrictionKeyResolver().resolve(options);
        const newRestrictionValue = new RestrictionValueResolver().resolve(options);

        const mosaicAddressRestrictionTransaction = MosaicAddressRestrictionTransaction.create(
            Deadline.create(),
            mosaicId,
            restrictionKey,
            targetAddress,
            newRestrictionValue,
            profile.networkType,
            undefined,
            UInt64.fromNumericString(options.maxFee),
        );

        const networkGenerationHash = profile.networkGenerationHash;
        const signedTransaction = account.sign(mosaicAddressRestrictionTransaction, networkGenerationHash);
        console.log(chalk.green('signed transaction hash: \n'));
        console.log(signedTransaction.hash + '\n');
        this.announceTransaction(signedTransaction, profile.url);
    }
}
