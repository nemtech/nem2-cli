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
import {Deadline, MosaicAliasTransaction, MosaicId, NamespaceId, UInt64} from 'nem2-sdk';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {BinaryValidator} from '../../validators/binary.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'a',
        description: 'Alias action (1: Link, 0: Unlink).',
        validator: new BinaryValidator(),
    })
    action: number;

    @option({
        flag: 'm',
        description: 'Mosaic id in in hexadecimal format. Example: 941299B2B7E1291C.',
    })
    mosaic: string;

    @option({
        flag: 'n',
        description: 'Namespace name.',
    })
    namespace: string;
}

@command({
    description: 'Set an alias to a mosaic',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {

        const profile = this.getProfile(options);

        options.namespace = OptionsResolver(options,
            'namespace',
            () => undefined,
            'Introduce namespace name: ');
        options.mosaic = OptionsResolver(options,
                'mosaic',
                () => undefined,
                'Introduce mosaic in hexadecimal format: ');

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        const mosaicId = new MosaicId(options.mosaic);
        const namespaceId = new NamespaceId(options.namespace);
        const mosaicAliasTransaction = MosaicAliasTransaction.create(
            Deadline.create(),
            OptionsResolver(options,
                'action',
                () => undefined,
                'Introduce alias action (1: Link, 0: Unlink): '),
            namespaceId,
            mosaicId,
            profile.networkType,
            UInt64.fromUint(options.maxFee),
        );

        const signedTransaction = profile.account.sign(mosaicAliasTransaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
