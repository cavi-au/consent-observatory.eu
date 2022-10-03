import { page } from "$app/stores";
import { browser } from "$app/environment";


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