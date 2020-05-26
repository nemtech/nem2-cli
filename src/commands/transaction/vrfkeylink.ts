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
import { command, metadata, option } from 'clime';
import { Deadline, VrfKeyLinkTransaction } from 'symbol-sdk';

import { AnnounceTransactionsCommand } from '../../interfaces/announce.transactions.command';
import { AnnounceTransactionsOptions } from '../../interfaces/announceTransactions.options';
import { LinkActionResolver } from '../../resolvers/action.resolver';
import { MaxFeeResolver } from '../../resolvers/maxFee.resolver';
import { PasswordResolver } from '../../resolvers/password.resolver';
import { PublicKeyResolver } from '../../resolvers/publicKey.resolver';
import { TransactionSignatureOptions } from '../../services/transaction.signature.service';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'u',
        description: 'Linked Public Key.',
    })
    linkedPublicKey: string;

    @option({
        flag: 'a',
        description: 'Alias action (Link, Unlink).',
    })
    action: string;
}

@command({
    description: 'Link an account with a VRF public key. Required for all harvesting eligible accounts.',
})
export default class extends AnnounceTransactionsCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const password = await new PasswordResolver().resolve(options);
        const account = profile.decrypt(password);
        const linkedPublicKey = (
            await new PublicKeyResolver().resolve(options, profile.networkType, 'Enter the public key to link: ', 'linkedPublicKey')
        ).publicKey;
        const action = await new LinkActionResolver().resolve(options);
        const maxFee = await new MaxFeeResolver().resolve(options);
        const signerMultisigInfo = await this.getSignerMultisigInfo(options);

        const transaction = VrfKeyLinkTransaction.create(Deadline.create(), linkedPublicKey, action, profile.networkType, maxFee);

        const signatureOptions: TransactionSignatureOptions = {
            account,
            transactions: [transaction],
            maxFee,
            signerMultisigInfo,
        };

        const signedTransactions = await this.signTransactions(signatureOptions, options);
        this.announceTransactions(options, signedTransactions);
    }
}
