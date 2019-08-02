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
import {command, ExpectedError, metadata, option} from 'clime';
import {
    AccountHttp,
    Address,
    AggregateTransaction,
    Deadline,
    EmptyMessage,
    Listener,
    LockFundsTransaction,
    Mosaic,
    MosaicId,
    PlainMessage,
    TransactionHttp,
    TransferTransaction,
    UInt64,
} from 'nem2-sdk';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {MosaicService} from '../../service/mosaic.service';
import {AddressValidator} from '../../validators/address.validator';
import {MaxFeeValidator} from '../../validators/maxFee.validator';
import {MosaicValidator} from '../../validators/mosaic.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'r',
        description: 'Funds holder address',
        validator: new AddressValidator(),
    })
    recipient: string;

    @option({
        flag: 'm',
        description: 'Message to the funds holder',
    })
    message: string;

    @option({
        flag: 'x',
        description: 'Mosaic you want to get should be in the format (mosaicId(hex)|@aliasName)::absoluteAmount',
        validator: new MosaicValidator(),
    })
    mosaic: string;

    @option({
        flag: 'c',
        description: 'The network native currency mosaicId in hexadecimal',
        validator: new MosaicValidator(),
    })
    currency: string;

    @option({
        flag: 'f',
        description: 'Maximum fee',
        validator: new MaxFeeValidator(),
    })
    maxfee: number;

    getMosaic(): Mosaic {
        const mosaicParts = this.mosaic.split('::');
        return new Mosaic(MosaicService.getMosaicId(mosaicParts[0]),
            UInt64.fromUint(+mosaicParts[1]));
    }
}

@command({
    description: 'Create a pull transaction requesting xem to an account',
})

export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();

        const profile = this.getProfile(options);

        const recipient: Address = Address.createFromRawAddress(OptionsResolver(options,
            'recipient',
            () => undefined,
            'Introduce funds holder address: '));

        if (recipient.networkType !== profile.networkType) {
            throw new ExpectedError('recipient network doesn\'t match network option');
        }

        const accountHttp = new AccountHttp(profile.url);

        accountHttp.getAccountInfo(recipient)
            .subscribe((accountInfo) => {
                this.spinner.stop(true);

                const message = PlainMessage.create(OptionsResolver(options,
                    'message',
                    () => undefined,
                    'Introduce message to the funds holder: '));

                options.mosaic = OptionsResolver(options,
                    'mosaic',
                    () => undefined,
                    'Introduce pull mosaic in the format (mosaicId(hex)|@aliasName)::absoluteAmount:');

                const mosaics = [options.getMosaic()];

                options.maxfee = OptionsResolver(options,
                    'maxfee',
                    () => undefined,
                    'Introduce the maximum fee you want to spend to announce the transaction: ');
                const requestFundsTx = TransferTransaction.create(Deadline.create(), recipient, [], message, profile.networkType);
                const fundsTx = TransferTransaction.create(Deadline.create(),
                    profile.account.address, mosaics, EmptyMessage, profile.networkType);

                const aggregateTx = AggregateTransaction.createBonded(Deadline.create(),
                    [requestFundsTx.toAggregate(profile.account.publicAccount), fundsTx.toAggregate(accountInfo.publicAccount)],
                    profile.networkType, []);

                const signedTransaction = profile.account.sign(aggregateTx, profile.networkGenerationHash);

                const currencyMosaic = new Mosaic(new MosaicId(OptionsResolver(options,
                    'currency',
                    () => undefined,
                    'The network native currency mosaicId in hexadecimal:')), UInt64.fromUint(10000000));

                const lockFundsTransaction = LockFundsTransaction.create(
                    Deadline.create(),
                    currencyMosaic,
                    UInt64.fromUint(1000),
                    signedTransaction,
                    profile.networkType,
                    UInt64.fromUint(options.maxfee),
                );

                const lockFundsSignedTransaction = profile.account.sign(lockFundsTransaction, profile.networkGenerationHash);

                const transactionHttp = new TransactionHttp(profile.url);
                const listener = new Listener(profile.url);

                listener.open().then(() => {
                    transactionHttp.announce(lockFundsSignedTransaction).subscribe(() => {
                        console.log(chalk.green('Announce lock funds transaction'));
                        console.log('Hash:   ', lockFundsSignedTransaction.hash);
                        console.log('Signer: ', lockFundsSignedTransaction.signer, '\n');
                        console.log(chalk.green('Waiting for confirmation to announce pull funds transaction\n'));
                    });
                    listener.confirmed(profile.account.address).subscribe((transaction) => {
                        if (transaction.transactionInfo && transaction.transactionInfo.hash === lockFundsSignedTransaction.hash) {
                            transactionHttp.announceAggregateBonded(signedTransaction).subscribe(() => {
                                console.log(chalk.green('Pull funds transaction announced'));
                                console.log('Hash:   ', signedTransaction.hash);
                                console.log('Signer: ', signedTransaction.signer);
                                listener.close();
                            }, (err) => {
                                listener.close();
                                this.spinner.stop(true);
                                let text = '';
                                text += chalk.red('Error');
                                console.log(text, err.response !== undefined ? err.response.text : err);
                            });
                        }
                    });
                });
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
