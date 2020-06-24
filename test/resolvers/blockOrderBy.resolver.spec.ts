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

import { expect } from 'chai';

import { BlockOrderByResolver } from '../../src/resolvers/blockOrderBy.resolver';

describe('BlockOrderBy resolver', () => {
    it('should return block order by', async () => {
        const orderBy = 'Id';
        const options = { orderBy } as any;
        expect(await new BlockOrderByResolver().resolve(options)).to.be.equal('id');
    });

    it('should change key', async () => {
        const key = 'Height';
        const options = { key } as any;
        expect(await new BlockOrderByResolver().resolve(options, 'altText', 'key')).to.be.equal('height');
    });
});
