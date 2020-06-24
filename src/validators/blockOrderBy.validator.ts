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
import { Validator } from 'clime';
import { BlockOrderByEnum } from 'symbol-openapi-typescript-node-client';

/**
 * Validator of block order by
 */
export class BlockOrderByValidator implements Validator<string> {
    /**
     * Validates if a block order by value is valid.
     * @param {string} value - Transaction group.
     * @returns {true | string}
     */
    validate(value: string): boolean | string {
        const test = value in BlockOrderByEnum;
        return test ? true : 'BlockOrderBy must be one of (Id, Height)';
    }
}
