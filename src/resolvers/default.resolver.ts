import * as readlineSync from 'readline-sync';
import {CreateProfileOptions} from '../create.profile.command';
import {Profile} from '../model/profile';
import {ProfileOptions} from '../profile.command';
import {Resolver} from './resolver';

/**
 * Default resolver
 */
export class DefaultResolver implements Resolver {

    /**
     * Resolves an action provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: CreateProfileOptions, secondSource?: Profile, altText?: string): any {
        if (!options.default && readlineSync.keyInYN('Do you want to set the account as the default profile?')) {
            options.default = true;
        }
        return options.default;
    }
}
