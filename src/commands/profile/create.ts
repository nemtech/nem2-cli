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
import {Command, command, ExpectedError, metadata, option, Options} from 'clime';
import {Account, BlockHttp, NetworkHttp, NetworkType} from 'nem2-sdk';
import * as readlineSync from 'readline-sync';
import {forkJoin} from 'rxjs';
import {OptionsResolver} from '../../options-resolver';
import {ProfileRepository} from '../../respository/profile.repository';
import {ProfileService} from '../../service/profile.service';
import {NetworkValidator} from '../../validators/network.validator';
import {PrivateKeyValidator} from '../../validators/privateKey.validator';

export class CommandOptions extends Options {
    @option({
        flag: 'p',
        description: 'Account private key.',
        validator: new PrivateKeyValidator(),
    })
    privateKey: string;

    @option({
        flag: 'n',
        description: 'Network Type. Example: MAIN_NET, TEST_NET, MIJIN, MIJIN_TEST.',
        validator: new NetworkValidator(),
    })
    network: string;

    @option({
        flag: 'u',
        description: 'NEM2 Node URL. Example: http://localhost:3000.',
    })
    url: string;

    @option({
        description: '(Optional) Profile name, if not private key will override the default profile.',
    })
    profile: string;

    getNetwork(network: string): NetworkType {
        if (network === 'MAIN_NET') {
            return NetworkType.MAIN_NET;
        } else if (network === 'TEST_NET') {
            return NetworkType.TEST_NET;
        } else if (network === 'MIJIN') {
            return NetworkType.MIJIN;
        } else if (network === 'MIJIN_TEST') {
            return NetworkType.MIJIN_TEST;
        }
        throw new ExpectedError('Introduce a valid network type');
    }
}

@command({
    description: 'Create a new profile',
})

export default class extends Command {
    private readonly profileService: ProfileService;

    constructor() {
        super();
        const profileRepository = new ProfileRepository('.nem2rc.json');
        this.profileService = new ProfileService(profileRepository);
    }

    @metadata
    execute(options: CommandOptions) {
        const networkType = options.getNetwork(OptionsResolver(options,
            'network',
            () => undefined,
            'Introduce network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): '));

        const account: Account = Account.createFromPrivateKey(
            OptionsResolver(options,
                'privateKey',
                () => undefined,
                'Introduce your private key: '),
            networkType);

        const url = OptionsResolver(options,
            'url',
            () => undefined,
            'Introduce NEM 2 Node URL. (Example: http://localhost:3000): ');

        let profileName: string;
        if (options.profile) {
            profileName = options.profile;
        } else {
            const tmp = readlineSync.question('Insert profile name (blank means default and it could overwrite the previous profile): ');
            if (tmp === '') {
                profileName = 'default';
            } else {
                profileName = tmp;
            }
        }
        profileName.trim();

        const networkHttp = new NetworkHttp(url);
        const blockHttp = new BlockHttp(url);

        forkJoin(networkHttp.getNetworkType(), blockHttp.getBlockByHeight(1))
            .subscribe((res) => {
                if (res[0] !== networkType) {
                    console.log('The network provided and the node network don\'t match.');
                } else {
                    const profile = this.profileService.createNewProfile(account,
                        url as string,
                        profileName,
                        res[1].generationHash);
                    console.log(chalk.green('\nProfile stored correctly\n') + profile.toString() + '\n');
                }
            }, (ignored) => {
                let error = '';
                error += chalk.red('Error');
                error += ' Provide a valid NEM2 Node URL. Example: http://localhost:3000.';
                console.log(error);
            });
    }
}
