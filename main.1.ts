import { Observable, Subject, ReplaySubject, from, of, range, Observer, fromEvent, pipe, throwError, defer, } from 'rxjs';
import { map, filter, switchMap, delay, mergeMap, retry, tap, retryWhen, scan, takeWhile
 } from 'rxjs/operators';
import { log } from './utils/utils';

let url = 'https://jsonplaceholder.typicode.com/posts';
let call = {
    method: 'GET',
    url: url
};
let circle = document.getElementById("circle");
let output = document.getElementById('output')
let button = document.getElementById('button');

function load(options) {
    return Observable.create(observer => {
        let r = new XMLHttpRequest();

        r.addEventListener('load', () => {
            if(r.status === 200) {
                let data = JSON.parse(r.responseText);
                 observer.next(data);
                 observer.complete();
            } else {
                observer.error(`ErrorCode: ${r.status}, ErrorMessage: ${r.statusText}`)
            }
        });

        r.open(options.method, options.url);
        r.send(); 
    }).pipe(
        retryWhen(retryStrategy({attempts: 3, delayTime: 1500}))
    )
}

function retryStrategy({attempts = 4, delayTime = 1000}) {
    return function(errors$) {
        return errors$.pipe(
            scan((acc, value) => {
                console.log(acc, value);
                console.log(delayTime)
                return acc + 1;
            }, 0 /** 0 is the  Start Value */),
            takeWhile(acc => acc < attempts),
            delay(delayTime)
        );
    }
}

function loadWithFetch(url: string) {
    return defer(() => {
        return from(fetch(url).then(response => response.json()))
    })
}

// load(call)
// .subscribe(renderData);
loadWithFetch(url)
    // .subscribe(renderData);

function renderData(data) {
    data.forEach(d => {
        let div = document.createElement('div');
        div.innerText = d.title
        output.appendChild(div);
    });
}
fromEvent(button, 'click')
    .pipe(
        mergeMap(e => loadWithFetch(url)), 
    )
    .subscribe(
        renderData,
        e => console.log(`error: ${e}`),
        () => console.log('complete')
    );
// function onNext(v) {
//     console.log("X: ", v.x, "Y: ",v.y)
//     circle.style.left = v.x + "px";
//     circle.style.top = v.y + "px";
//     circle.style.color = "blue";
// }
//Observer
// source.subscribe(
//     v => console.log(`value: ${v}`),
//     e => console.log(`error: ${e}`),
//     () => console.log('complete')
// )