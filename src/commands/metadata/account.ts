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
import * as Table from 'cli-table3';
import { HorizontalTable } from 'cli-table3';
import { command, metadata, option } from 'clime';
import { Metadata, MetadataEntry, Page } from 'symbol-sdk';

import { ProfileCommand } from '../../interfaces/profile.command';
import { ProfileOptions } from '../../interfaces/profile.options';
import { AddressResolver } from '../../resolvers/address.resolver';
import { FormatterService } from '../../services/formatter.service';

export class CommandOptions extends ProfileOptions {
    @option({
        flag: 'a',
        description: 'Target Address.',
    })
    address: string;
}

export class MetadataEntryTable {
    private readonly table: HorizontalTable;

    constructor(public readonly entry: MetadataEntry) {
        this.table = new Table({
            style: { head: ['cyan'] },
            head: ['Type', 'Value'],
        }) as HorizontalTable;

        this.table.push(
            ['Source Address', entry.sourceAddress.pretty()],
            ['Target Address', entry.targetAddress.pretty()],
            ['Value', entry.value],
        );
        if (entry.targetId) {
            this.table.push(['Target Id', entry.targetId.toHex()]);
        }
    }

    toString(): string {
        let text = '';
        text += FormatterService.title('Key:' + this.entry.scopedMetadataKey.toHex());
        text += '\n' + this.table.toString();
        return text;
    }
}

@command({
    description: 'Fetch metadata entries from an account',
})
export default class extends ProfileCommand {
    constructor() {
        super();
    }

    @metadata
    async execute(options: CommandOptions) {
        const profile = this.getProfile(options);
        const address = await new AddressResolver().resolve(options, profile);

        this.spinner.start();
        const metadataHttp = profile.repositoryFactory.createMetadataRepository();
        metadataHttp.search({ targetAddress: address }).subscribe(
            (metadataEntries: Page<Metadata>) => {
                this.spinner.stop();
                if (metadataEntries.pageSize > 0) {
                    metadataEntries.data.map((entry: Metadata) => {
                        console.log(new MetadataEntryTable(entry.metadataEntry).toString());
                    });
                } else {
                    console.log(FormatterService.error('The address does not have metadata entries assigned'));
                }
            },
            (err: any) => {
                this.spinner.stop();
                console.log(FormatterService.error(err));
            },
        );
    }
}
