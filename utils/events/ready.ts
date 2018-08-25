import { from, Observable, fromEvent } from "rxjs";
import { retry, delay } from "rxjs/operators";

export class Ready {


    init() {

        return Observable.create(observer => {
            const callback = event => observer.next(event);
            window.addEventListener("load", callback, false);
            return () => window.removeEventListener("load", callback, false);
        })

    }

    handler(o) {
        console.log(o)
        o.next();
        o.complete();
    }
}