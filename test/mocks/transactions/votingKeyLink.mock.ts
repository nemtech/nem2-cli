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

import { Deadline, LinkAction, NetworkType, VotingKeyLinkTransaction } from 'symbol-sdk';

export const unsignedVotingKeyLink1 = VotingKeyLinkTransaction.create(
    Deadline.create(),
    '0'.repeat(96),
    1,
    2,
    LinkAction.Link,
    NetworkType.MIJIN_TEST,
);
