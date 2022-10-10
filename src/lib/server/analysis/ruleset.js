
import { Validator } from '@chcaa/validator';

class Ruleset {

    #name;
    #description;
    #rules;
    #options;
    #optionByKey = new Map();

    constructor(name, description, rules, options= []) {
        this.#validate(name, description, options);
        this.#name = name;
        this.#description = description;
        this.#rules = rules;
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
        } else {
            for (let nameVal of option.names) {
                if (nameVal.value === value) {
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
        } else {
            return option.names[0].value;
        }
    }

    #validate(name, description, options) {
        let test = Validator.createOnErrorThrowValidator('Ruleset Error:');
        test(name).fulfillAllOf(name => [
            name.is.aString('"name" must be a string'),
            name.isNot.empty('"name" cannot be empty')
        ]);
        test(description).fulfillAllOf(description => [
            description.is.aString('"description" must be a string'),
            description.isNot.empty('"description" cannot be empty')
        ]);
        test(options).is.anArray('"options" must be an array');
        test(options).each(option => option.fulfillAllOf(option => [
            option.is.anObject('each "option" must be an object'),
            option.prop('type').fulfillAllOf(type => [
                type.is.aString('"type" must be a string'),
                type.is.in(['radio', 'checkbox'], '"type" must be one of "radio" or "checkbox"'),
            ]),
            option.conditionally(
                option => option.prop('type').is.equalTo('radio')
            ).prop('name').fulfillAllOf(name => [
                // TODO
            ]),
            option.conditionally(
                option => option.prop('type').is.equalTo('checkbox')
            ).prop('name').fulfillAllOf(name => [
                // TODO
            ]),
            option.prop('key').fulfillAllOf(key => [
                key.is.aString('"key" must be a string'),
                key.isNot.empty('"key" cannot be empty')
            ]),
            //TODO continue validating

        ]));
        // TODO validate and set defaults for options?

        // TODO option keys must be unique for the ruleset
    }

}

export { Ruleset };