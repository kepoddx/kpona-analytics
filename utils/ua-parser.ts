import * as ua from 'ua-parser-js';

export class UA {
    constructor() {
        console.log(ua)
    }

    init() {
        return new ua();
    }
}