export class User {
    constructor() {
            
    }

    getUniqueId() {
        let str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        return str.replace(/[xy]/g, function(c) {
            let r = Math.random()*16|0, 
                v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
        })
    }
}