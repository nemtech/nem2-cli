import * as readlineSync from 'readline-sync';
import {AnnounceTransactionsOptions} from '../announce.transactions.command';
import {CreateProfileOptions} from '../create.profile.command';
import {Profile} from '../model/profile';
import {Resolver} from './resolver';

/**
 * Announce resolver
 */
export class AnnounceResolver implements Resolver {

    /**
     * Resolves if the user wants to announce the transaction.
     * @param {CreateProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: AnnounceTransactionsOptions, secondSource?: Profile, altText?: string): any {
        if (!options.announce && readlineSync.keyInYN('Do you want to announce this transaction?')) {
            options.announce = true;
        }
        return options.announce;
    }
}
