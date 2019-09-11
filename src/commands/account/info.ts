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
    AccountHttp,
    AccountInfo,
    Address,
    MosaicAmountView,
    MosaicHttp,
    MosaicService,
    MultisigAccountInfo,
    PublicAccount,
} from 'nem2-sdk';
import {map, mergeMap, toArray} from 'rxjs/operators';
import {OptionsResolver} from '../../options-resolver';
import {ProfileCommand, ProfileOptions} from '../../profile.command';
import {AddressValidator} from '../../validators/address.validator';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Account address',
        validator: new AddressValidator(),
    })
    address: string;
}

@command({
    description: 'Fetch account info',
})
export default class extends ProfileCommand {

    constructor() {
        super();
    }

    @metadata
    execute(options: CommandOptions) {
        this.spinner.start();

        const profile = this.getProfile(options);

        const address: Address = Address.createFromRawAddress(
            OptionsResolver(options,
                'address',
                () => this.getProfile(options).account.address.plain(),
                'Introduce the address: '));

        const accountHttp = new AccountHttp(profile.url);
        const mosaicHttp = new MosaicHttp(profile.url);
        const mosaicService = new MosaicService(
            accountHttp,
            mosaicHttp,
        );
        accountHttp.getAccountInfo(address)
            .pipe(
                mergeMap((accountInfo: AccountInfo) => mosaicService.mosaicsAmountViewFromAddress(address)
                    .pipe(
                        mergeMap((_) => _),
                        toArray(),
                        map((mosaics: MosaicAmountView[]) => {
                            return { mosaics, info: accountInfo };
                        }))),
            )
            .subscribe((accountData: any) => {
                const accountInfo = accountData.info;
                let text = '';
                text += chalk.green('Account:\t') + chalk.bold(address.pretty()) + '\n';
                text += '-'.repeat('Account:\t'.length + address.pretty().length) + '\n\n';
                text += 'Address:\t' + accountInfo.address.pretty() + '\n';
                text += 'at height:\t' + accountInfo.addressHeight.compact() + '\n\n';
                text += 'PublicKey:\t' + accountInfo.publicKey + '\n';
                text += 'at height:\t' + accountInfo.publicKeyHeight.compact() + '\n\n';
                text += 'Importance:\t' + accountInfo.importance.compact() + '\n';
                text += 'at height:\t' + accountInfo.importanceHeight.compact() + '\n\n';
                text += 'Mosaics' + '\n';
                accountData.mosaics.map((mosaic: MosaicAmountView) => {
                    const duration = mosaic.mosaicInfo['properties'].duration.compact();
                    let expiration: string;
                    if (duration === 0) {
                        expiration = 'Never';
                    } else {
                        const createHeight = mosaic.mosaicInfo.height.compact();
                        expiration = (createHeight + duration).toString();
                    }
                    text += mosaic.fullName() + ':\t' + mosaic.relativeAmount() + '(relative)' + '\t'
                    + mosaic.amount.compact() + '(absolute)' + '\n';
                    text += 'expiration height:\t' + expiration + '\n\n';
                });
                this.spinner.stop(true);
                console.log(text);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });

        accountHttp.getMultisigAccountInfo(address)
            .subscribe((multisigAccountInfo: MultisigAccountInfo) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.green('cosignatories:\t') + '\n';
                text += '-'.repeat('cosignatories:\t'.length) + '\n\n';
                multisigAccountInfo.cosignatories.map((publicAccount: PublicAccount) => {
                    text += 'PublicKey:\t' + publicAccount.publicKey + '\n';
                    text += 'Address:\t' + publicAccount.address.plain() + '\n\n';
                });
                text += chalk.green('multisigAccounts:\t') + '\n';
                text += '-'.repeat('multisigAccounts:\t'.length) + '\n\n';
                multisigAccountInfo.multisigAccounts.map((publicAccount: PublicAccount) => {
                    text += 'PublicKey:\t' + publicAccount.publicKey + '\n';
                    text += 'Address:\t' + publicAccount.address.plain() + '\n\n';
                });
                text += 'MinApproval:\t' + multisigAccountInfo.minApproval + '\n';
                text += 'MinRemoval:\t' + multisigAccountInfo.minRemoval + '\n\n';
                console.log(text);
            }, (err) => {
                this.spinner.stop(true);
                let text = '';
                text += chalk.red('Error');
                console.log(text, err.response !== undefined ? err.response.text : err);
            });
    }
}
