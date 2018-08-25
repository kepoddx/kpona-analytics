import { Observable, Subject, ReplaySubject, from, of, range, Observer, fromEvent, pipe, throwError, defer, } from 'rxjs';
import { map, filter, switchMap, delay, mergeMap, retry, tap, retryWhen, scan, takeWhile, merge
 } from 'rxjs/operators';
import { log, extend } from './utils/utils';
import { Ready } from './utils/events/ready';
import { BrowserAttributes } from './utils/browser';
import { UA } from './utils/ua-parser';
import { Forms } from './utils/forms';

const browser = new BrowserAttributes();
//Utils

// User vists page
// -- collect data [ Refferrer, timestamp...]
// -- is user logged in? --> get user id. use sessionId? ---- TBD
// -- is user anonymous? assign userId --> uuid
// -- store uuid --> cookies || localStoraged 
let doc = new Ready();

let useragent = new  UA();

let ua = useragent.init();

let forms = new Forms();
forms.init()
    .subscribe(d => console.log(d) )



// Ready.init()
// //     .subscribe(d => console.log(d))
doc.init()
    // .pipe(
    //     filter(d => d.hasOwnProperty('name') ),
    //     merge(screen.buildProfile()),
    // )
    // .subscribe(d => console.log(d))

    .pipe(
        filter(d => d.hasOwnProperty('type')),
        merge(
            browser.getAttributes(),
        )
    )  
    .subscribe(d => {
        console.log(d)
        // console.log(ua.getDevice())
    })


