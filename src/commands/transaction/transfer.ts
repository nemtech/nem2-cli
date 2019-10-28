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
import {command, ExpectedError, metadata, option} from 'clime';
import {
    Address,
    Deadline,
    EncryptedMessage,
    Mosaic,
    NamespaceId,
    PlainMessage,
    PublicAccount,
    TransferTransaction,
    UInt64,
} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsCommand, AnnounceTransactionsOptions} from '../../announce.transactions.command';
import {OptionsResolver} from '../../options-resolver';
import {MosaicService} from '../../service/mosaic.service';
import {AddressValidator} from '../../validators/address.validator';
import {MosaicsValidator} from '../../validators/mosaic.validator';
import {PublicKeyValidator} from '../../validators/publicKey.validator';

export class CommandOptions extends AnnounceTransactionsOptions {
    @option({
        flag: 'r',
        description: 'Recipient address or @alias.',
    })
    recipient: string;

    @option({
        flag: 'm',
        description: 'Transaction message.',
    })
    message: string;

    @option({
        flag: 'c',
        description: 'Mosaic to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount. Add multiple mosaics with commas.',
        validator: new MosaicsValidator(),
    })
    mosaics: string;

    @option({
        flag: 'e',
        description: '(Optional) Send an encrypted message. ' +
            'If you set this value, you should set the value of \'recipientPublicKey\' as well).',
        toggle: true,
    })
    encrypted: any;

    @option({
        flag: 'p',
        description: '(Optional) The recipient public key in an encrypted message.',
        validator: new PublicKeyValidator(),
    })
    recipientPublicKey: string;

}

@command({
    description: 'Send transfer transaction',
})

export default class extends AnnounceTransactionsCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        const profile = this.getProfile(options);

        const recipient: Address | NamespaceId = MosaicService.getRecipient(OptionsResolver(options,
            'recipient',
            () => undefined,
            'Introduce the recipient address: '));
        if (recipient instanceof Address && recipient.networkType !== profile.networkType) {
            throw new ExpectedError('The recipient address network doesn\'t match network option.');
        }

        let mosaics: Mosaic[] = [];
        options.mosaics = OptionsResolver(options,
            'mosaics',
            () => undefined,
            'Mosaics to transfer in the format (mosaicId(hex)|@aliasName)::absoluteAmount,' +
            ' (Ex: sending 1 cat.currency, @cat.currency::1000000). Add multiple mosaics with commas: > ');
        if (options.mosaics) {
            mosaics = MosaicService.getMosaics(options.mosaics);
        }
        options.message = OptionsResolver(options,
            'message',
            () => '',
            'Introduce the message: ');

        let message: PlainMessage | EncryptedMessage;

        if (options.message) {
            options.encrypted = options.encrypted ? options.encrypted : readlineSync.keyInYN(
                'Do you want to send an encrypted message?');
        }

        if (options.message && options.encrypted) {
            options.recipientPublicKey = OptionsResolver(options,
                'recipientPublicKey',
                () => undefined,
                'Introduce the recipient public key: ');
            message = profile.account.encryptMessage(
                options.message,
                PublicAccount.createFromPublicKey(options.recipientPublicKey,
                    profile.networkType),
                profile.networkType);
        } else {
            message = PlainMessage.create(options.message);
        }

        options.maxFee = OptionsResolver(options,
            'maxFee',
            () => undefined,
            'Introduce the maximum fee you want to spend to announce the transaction: ');

        const transferTransaction = TransferTransaction.create(
            Deadline.create(),
            recipient,
            mosaics,
            message,
            profile.networkType,
            options.maxFee ? UInt64.fromNumericString(options.maxFee) : UInt64.fromUint(0));

        const signedTransaction = profile.account.sign(transferTransaction, profile.networkGenerationHash);
        this.announceTransaction(signedTransaction, profile.url);
    }
}
