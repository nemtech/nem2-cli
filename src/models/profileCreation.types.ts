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
import {NetworkCurrency} from './networkCurrency.model'
import {NetworkType, Password} from 'symbol-sdk'

/**
 * Base arguments new profile creation
 * @interface ProfileCreationBase
 */
export interface ProfileCreationBase {
 generationHash: string;
 isDefault: boolean;
 name: string;
 networkCurrency: NetworkCurrency;
 networkType: NetworkType;
 password: Password;
 url: string;
}

/**
 * Arguments for private key profile creation
 * @export
 * @interface PrivateKeyProfileCreation
 * @extends {ProfileCreationBase}
 */
export interface PrivateKeyProfileCreation extends ProfileCreationBase {
 privateKey: string;
}

/**
 * Arguments for HD profile creation
 * @export
 * @interface HdProfileCreation
 * @extends {ProfileCreationBase}
 */
export interface HdProfileCreation extends ProfileCreationBase {
 mnemonic: string;
 pathNumber: number;
}

/**
 * Type for profile creation arguments
 */
export type ProfileCreation = PrivateKeyProfileCreation | HdProfileCreation
