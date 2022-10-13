import _ from 'lodash';
import { Validator } from '@chcaa/validator';

class Ruleset {

    static rulesetComparator = (r1, r2) => {
        let res = r1.sortKey - r2.sortKey;
        if (res === 0) {
            return r1.name.localeCompare(r2.name);
        }
        return res;
    };

    #name;
    #description;
    #rules;
    #sortKey;
    #options;
    #optionByKey = new Map();

    constructor(name, description, rules, sortKey = Number.MAX_SAFE_INTEGER, options= []) {
        this.#validate(name, description, sortKey, options);
        this.#name = name;
        this.#description = description;
        this.#rules = rules;
        this.#sortKey = sortKey;
        this.#options = options;
        for (let option of this.#options) {
            this.#optionByKey.set(option.key, option);
        }
    }

    get name() {
        return this.#name;
    }

    get description() {
        return this.#description;
    }

    get rules() {
        return this.#rules;
    }

    get sortKey() {
        return this.#sortKey;
    }

    get options() {
        return this.#options;
    }

    isOptionSupported(optionKey) {
        return this.#optionByKey.has(optionKey);
    }

    isOptionValueSupported(optionKey, value) {
        let option = this.#optionByKey.get(optionKey);
        if (option.type === 'checkbox') {
            return _.isBoolean(value);
        } else if (option.type === 'radio') {
            for (let radioOption of option.options) {
                if (radioOption.value === value) {
                    return true;
                }
            }
        }
        return false;
    }

    getDefaultOptionValue(optionKey) {
        let option = this.#optionByKey.get(optionKey);
        if (option.type === 'checkbox') {
            return false;
        } else if (option.type === 'radio') {
            return option.options[0].value;
        }
    }

    #validate(name, description, sortKey, options) {
        let test = Validator.createOnErrorThrowValidator('Ruleset Error:');
        test(name).fulfillAllOf(name => [
            name.is.aString('"${PATH}" must be a string'),
            name.isNot.empty('"${PATH}" cannot be empty')
        ]);
        test(description).fulfillAllOf(description => [
            description.is.aString('"${PATH}" must be a string'),
            description.isNot.empty('"${PATH}" cannot be empty')
        ]);
        test(sortKey, 'sortKey').fulfillAllOf(sortKey => [
            sortKey.is.anInteger('"${PATH}" must be an integer')
        ]);
        test(options, 'options').is.anArray('"${PATH}" must be an array');
        test(options, 'options').each(option => option.fulfillAllOf(option => [
            option.is.anObject('each "option" must be an object'),
            option.prop('type').fulfillAllOf(type => [
                type.is.aString('"${PATH}" must be a string'),
                type.is.in(['radio', 'checkbox'], '"${PATH}" must be one of "radio" or "checkbox"'),
            ]),
            option.prop('title').optional.is.aString('"${PATH}" must be a string'),
            option.prop('description').optional.is.aString('"${PATH}" must be a string'),
            option.conditionally(
                option => option.prop('type').is.equalTo('radio')
            ).prop('options').fulfillAllOf(options => [
                options.is.anArray('"${PATH}" must be an array'),
                options.isNot.empty('"${PATH}" cannot be empty'),
                options.each(option => option.fulfillAllOf(option => [
                   option.is.anObject('"${PATH}" must be an object'),
                   option.prop('label').fulfillAllOf(name => [
                       name.is.aString('"${PATH}" must be a string'),
                       name.isNot.empty('"${PATH}" cannot be empty'),
                   ]),
                    option.prop('value').fulfillAllOf(value => [
                        value.is.aString('"${PATH}" must be a string'),
                        value.isNot.empty('"${PATH}" cannot be empty'),
                    ])
                ]))
            ]),
            option.conditionally(
                option => option.prop('type').is.equalTo('checkbox')
            ).prop('label').fulfillAllOf(name => [
                name.is.aString('"${PATH}" must be a string'),
                name.isNot.empty('"${PATH}" cannot be empty'),
            ]),
            option.prop('key').fulfillAllOf(key => [
                key.is.aString('"${PATH}" must be a string'),
                key.isNot.empty('"${PATH}" cannot be empty')
            ]),
        ]));

        test(options, 'options').fulfill(options => {
            let keysArrays = options.value.map(option => option.key);
            let keys = new Set(keysArrays);
            return keysArrays.length === keys.size;
        }, 'All option keys must be unique');

    }

}

export { Ruleset };