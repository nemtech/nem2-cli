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

import {OptionsChoiceResolver, OptionsConfirmResolver, OptionsResolver} from '../src/options-resolver'
import {ActionValidator} from '../src/validators/action.validator'
import {ActionType} from '../src/models/action.enum'
import {NumericStringValidator} from '../src/validators/numericString.validator'
import {expect} from 'chai'

describe('OptionsResolver', () => {
    it('should return the value if contains the commands option is passed', async () => {
        const value = await OptionsResolver({name: 'nem'}, 'name',
            () => undefined, 'Insert your name', 'text', undefined)
        expect(value).to.be.equal('nem')
    })

    it('should return the value 0 if contains the commands option is passed', async () => {
        const value = await OptionsResolver({name: '0'}, 'name',
            () => undefined, 'Insert your name', 'text', undefined)
        expect(value).to.be.equal('0')
    })

    it('should return the secondSource value if command options object have not it and secondValue is not undefined', async () => {
        const value = await OptionsResolver({}, 'name',
            () => 'nem', 'Insert your name', 'text', undefined)
        expect(value).to.be.equal('nem')
    })

    it('should pass validation', async () => {
        const value = await OptionsResolver({name: '1'}, 'name',
            () => undefined, 'Insert your name', 'text', new NumericStringValidator())
        expect(value).to.be.equal('1')
    })

})

describe('OptionsChoicesResolver', () => {
    it('should return the value if contains the commands option is passed', async () => {
        const choices = [
            {title: 'nem', value: 0},
            {title: 'mijin', value: 1},
        ]
        const value = await OptionsChoiceResolver({name: 'nem'},
            'name', 'Select name:', choices, 'select', undefined)
        expect(value).to.be.equal(0)
    })

    it('should pass validation', async () => {
        const choices = [
            {title: 'Remove', value: ActionType.Remove},
        ]
        const value = await OptionsChoiceResolver({name: 'Remove'},
            'name', 'Select name:', choices, 'select', new ActionValidator())
        expect(value).to.be.equal(ActionType.Remove)
    })

})

describe('OptionsConfirmationResolver', () => {
    it('should return the value if contains the commands option is passed', async () => {
        const value = await OptionsConfirmResolver({name: true}, 'name',
             'test', 'confirm',true, 'value')
        expect(value).to.be.equal(true)
    })
})

