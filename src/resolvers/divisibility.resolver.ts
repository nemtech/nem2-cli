import {ProfileOptions} from '../commands/profile.command';
import {Profile} from '../models/profile';
import {OptionsResolver} from '../options-resolver';
import {Resolver} from './resolver';

/**
 * Divisibility resolver
 */
export class DivisibilityResolver implements Resolver {

    /**
     * Resolves a divisibility provided by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @returns {number}
     */
    resolve(options: ProfileOptions, secondSource?: Profile, altText?: string): any {
        const resolution = +OptionsResolver(options,
        'divisibility',
        () =>  undefined,
        altText ? altText : 'Enter the mosaic divisibility: ');
        return resolution;
    }
}
