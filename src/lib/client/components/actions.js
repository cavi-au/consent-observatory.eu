import { page } from "$app/stores";
import { browser } from "$app/environment";

const FOCUSABLE_ELEMENTS_SELECTOR = [
    'a',
    'button',
    'input',
    'textarea',
    'select',
    'details',
    '[tabindex]',
    '[contenteditable="true"]'
].map(selector => `${selector}:not([tabindex^="-"])`).join(',');

export function formAutoFocus(formElement) {

    function focusField() {
        if (formElement && browser) {
            let inputElements = formElement.querySelectorAll('.form-control');
            let focusElement = inputElements[0];
            for (let elem of inputElements) {
                if (elem.classList.contains('is-invalid')) {
                    focusElement = elem;
                    break;
                }
            }
            focusElement?.focus();
        }
    }

    let unsubscribe = page.subscribe(value => {
        focusField();
    });

    return {
        destroy: () => {
            unsubscribe();
        }
    }
}

export function focusTrap(element) {
    // inspired by https://github.com/twbs/bootstrap/blob/main/js/src/util/focustrap.js

    let lastTabNavDirection = null;

    let focusListener = (e) => {
        if (e.target === document || e.target === element || element.contains(e.target)) {
            return;
        }

        const elements = getFocusableChildren(element);

        if (elements.length === 0) {
            element.focus();
        } else if (lastTabNavDirection === 'backward') {
            elements[elements.length - 1].focus();
        } else {
            elements[0].focus();
        }
    }

    let keyDownListener = (e) => {
        if (e.key !== 'Tab') {
            return;
        }
        lastTabNavDirection = e.shiftKey ? 'backward' : 'forward';
    }

    document.addEventListener('focusin', focusListener);
    document.addEventListener('keydown', keyDownListener);
    return {
        destroy: () => {
            document.removeEventListener('focusin', focusListener);
            document.removeEventListener('keydown', keyDownListener);
        }
    }
}

function getFocusableChildren(element) {
    let children = element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
    return [...children].filter(el => !isElementDisabled(el) && isElementVisible(el));
}

const isElementVisible = element => {
    return true;
    // if focus shifts to elements not visible due to maybe bootstrap hiding it etc.
    // use the isVisble code from here: https://github.com/twbs/bootstrap/blob/main/js/src/util/index.js
}

const isElementDisabled = element => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
        return true;
    }
    if (element.classList.contains('disabled')) {
        return true;
    }
    if (typeof element.disabled !== 'undefined') {
        return element.disabled;
    }

    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
}