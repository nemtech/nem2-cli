import {Options} from 'clime'
import {ProfileOptions} from '../interfaces/profile.command'
import {ProfileModel} from '../models/profile.model'

/**
 * URL resolver
 */
export interface Resolver {

    /**
     * Resolves an url provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {ProfileModel} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {any}
     */
    resolve(options: Options, secondSource?: any, altText?: string, altKey?: string): any;
}
