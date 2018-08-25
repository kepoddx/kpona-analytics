import { Observable } from 'rxjs';


export function arr2Obj() {
    return function (source) {
        return Observable.create(subscriber => {
            let subscription = source.subscribe(v => {
                try {
                    let data = {};
                    v.forEach((el) => {
                        Object.assign(data, el)
                    })
                    subscriber.next(data)
                } catch (error) {
                    subscriber.error(error)
                }
            },
                err => subscriber.error(err),
                () => subscriber.complete());

            return subscription;
        })
    }
}