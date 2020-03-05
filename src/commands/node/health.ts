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
import chalk from 'chalk'
import * as Table from 'cli-table3'
import {HorizontalTable} from 'cli-table3'
import {command, metadata} from 'clime'
import {NodeHealth, NodeHttp} from 'symbol-sdk'
import {ProfileCommand, ProfileOptions} from '../../interfaces/profile.command'
import {HttpErrorHandler} from '../../services/httpErrorHandler.service'

export class NodeHealthTable {
    private readonly table: HorizontalTable
    constructor(public readonly health: NodeHealth) {
        this.table = new Table({
            style: {head: ['cyan']},
            head: ['Property', 'Value'],
        }) as HorizontalTable
        this.table.push(
            ['API node', health.apiNode],
            ['DB node', health.db],
        )
    }

    toString(): string {
        let text = ''
        text += '\n' + chalk.green('Health Information') + '\n'
        text += this.table.toString()
        return text
    }
}

@command({
    description: 'Get information about the connection and services status',
})
export default class extends ProfileCommand {

    constructor() {
        super()
    }

    @metadata
    execute(options: ProfileOptions) {
        this.spinner.start()

        const profile = this.getProfile(options)

        const nodeHttp = new NodeHttp(profile.url)
        nodeHttp.getNodeHealth()
            .subscribe((health) => {
                this.spinner.stop(true)
                console.log(new NodeHealthTable(health).toString())
            }, (err) => {
                this.spinner.stop(true)
                console.log(HttpErrorHandler.handleError(err))
            })
    }
}
