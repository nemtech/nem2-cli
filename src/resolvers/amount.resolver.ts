import chalk from 'chalk'
import {UInt64} from 'symbol-sdk'
import {ProfileOptions} from '../interfaces/profile.command'
import {Profile} from '../models/profile'
import {OptionsResolver} from '../options-resolver'
import {NumericStringValidator} from '../validators/numericString.validator'
import {Resolver} from './resolver'

/**
 * Amount resolver
 */
export class AmountResolver implements Resolver {

    /**
     * Resolves an absolute amount by the user.
     * @param {ProfileOptions} options - Command options.
     * @param {Profile} secondSource - Secondary data source.
     * @param {string} altText - Alternative text.
     * @param {string} altKey - Alternative key.
     * @returns {Promise<UInt64>}
     */
    async resolve(options: ProfileOptions, secondSource?: Profile, altText?: string, altKey?: string): Promise<UInt64> {
        const resolution = await OptionsResolver(options,
            altKey ? altKey : 'amount',
            () =>  undefined,
            altText ? altText : 'Enter an absolute amount: ')
        try {
            new NumericStringValidator().validate(resolution)
        } catch (err) {
            console.log(chalk.red('ERR'), err)
            return process.exit()
        }
        return UInt64.fromNumericString(resolution)
    }
}
