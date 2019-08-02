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

// tslint:disable-next-line:no-var-requires
const pkg = require('../../../package.json');
export const description = `
                      ____            _ _
 _ __   ___ _ __ ___ |___ \\       ___| (_)
| \'_ \\ / _ \\ \'_ \` _ \\  __) |____ / __| | |
| | | |  __/ | | | | |/ __/_____| (__| | |
|_| |_|\\___|_| |_| |_|_____|     \\___|_|_|

                                   v${pkg.version}
`;

export const subcommands = [
    {
        name: 'account',
        brief: 'Get account related information',
    },
    {
        name: 'block',
        brief: 'Get block related information',
    },
    {
        name: 'chain',
        brief: 'Get chain related information',
    },
    {
        name: 'diagnostic',
        brief: 'Get node diagnostics reports',
    },
    {
        name: 'mosaic',
        brief: 'Get mosaic related information',
    },
    {
        name: 'namespace',
        brief: 'Get namespace related information',
    },
    {
        name: 'transaction',
        brief: 'Announce transactions',
    },
    {
        name: 'monitor',
        brief: 'Monitor blocks, transactions and errors',
    },
    {
        name: 'profile',
        brief: 'Manage profiles',
    },
];
