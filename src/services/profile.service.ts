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
import {SimpleWallet} from 'symbol-sdk'
import {ProfileModel} from '../models/profile.model'
import {ProfileRepository} from '../respositories/profile.repository'

/**
 * Profile service
 */
export class ProfileService {
    private readonly profileRepository: ProfileRepository

    /**
     * Constructor
     * @param {ProfileRepository} profileRepository
     */
    constructor(profileRepository: ProfileRepository) {
        this.profileRepository = profileRepository
    }

    /**
     * Creates a new profile from a SimpleWallet.
     * @param {SimpleWallet} simpleWallet - Wallet object with sensitive information.
     * @param {string} url - Node URL by default.
     * @param {string} networkGenerationHash - Network's generation hash.
     * @returns {ProfileModel}
     */
    createNewProfile(simpleWallet: SimpleWallet, url: string, networkGenerationHash: string): ProfileModel {
        return this.profileRepository.save(simpleWallet, url, networkGenerationHash)
    }

    /**
     * Find profile by name.
     * @param {string} name - Profile name.
     * @returns {ProfileModel}
     */
    findProfileNamed(name: string): ProfileModel {
        return this.profileRepository.find(name)
    }

    /**
     * Gets all profiles.
     * @returns {ProfileModel[]}
     */
    findAllProfiles(): ProfileModel[] {
        return this.profileRepository.all()
    }

    /**
     * Sets a profile as the default one.
     * @param {string} name - Profile name.
     */
    setDefaultProfile(name: string) {
        this.profileRepository.setDefault(name)
    }

    /**
     * Gets the profile set as default.
     * @returns {ProfileModel}
     */
    getDefaultProfile(): ProfileModel {
        return this.profileRepository.getDefaultProfile()
    }
}
