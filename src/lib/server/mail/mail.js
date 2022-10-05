
class Mail {

    #from;
    #to;
    #subject;
    #text;
    #html;

    constructor(from, to, subject, text, html) {
        this.#from = from;
        this.#to = to;
        this.#subject = subject;
        this.#text = text;
        this.#html = html;
    }

    get from() {
        return this.#from;
    }

    get to() {
        return this.#to;
    }

    get subject() {
        return this.#subject;
    }

    get text() {
        return this.#text;
    }

    get html() {
        return this.#html;
    }

}

export { Mail };