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
import {Deadline, NamespaceRegistrationTransaction} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {
    AnnounceTransactionFieldsTable,
    AnnounceTransactionsCommand,
    AnnounceTransactionsOptions,
} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {AnnounceResolver} from '../../resolvers/announce.resolver';
import {DurationResolver} from '../../resolvers/duration.resolver';
import {MaxFeeResolver} from '../../resolvers/maxFee.resolver';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'n',
        description: 'Namespace name.',
    })
    name: string;

    @option({
        flag: 'r',
        description: 'Root namespace.',
        toggle: true,
    })
    rootnamespace: any;

    @option({
        flag: 's',
        description: 'Sub namespace.',
        toggle: true,
    })
    subnamespace: any;

    @option({
        flag: 'd',
        description: 'Duration (use it with --rootnamespace).',
    })
    duration: string;

    @option({
        flag: 'a',
        description: 'Parent namespace name (use it with --subnamespace).',
    })
    parentName: string;
}

@command({
    description: 'Register a namespace',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const account = profile.decrypt(options);

        options.name = OptionsResolver(options,
            'name',
            () => undefined,
            'Enter namespace name: ');

        if (!options.rootnamespace && readlineSync.keyInYN('Do you want to create a root namespace?')) {
            options.rootnamespace = true;
        }
        let duration;
        if (!options.rootnamespace) {
            options.subnamespace = true;
            options.parentName = OptionsResolver(options,
                'parentName',
                () => undefined,
                'Enter the parent namespace name: ');
        } else {
            duration = new DurationResolver().resolve(options);
        }
        const maxFee = new MaxFeeResolver().resolve(options);

        let transaction: NamespaceRegistrationTransaction;
        if (options.rootnamespace) {
            transaction = NamespaceRegistrationTransaction.createRootNamespace(
                Deadline.create(), options.name, duration, profile.networkType, maxFee);
        } else {
            transaction = NamespaceRegistrationTransaction.createSubNamespace(
                Deadline.create(), options.name, options.parentName, profile.networkType, maxFee);
        }
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
