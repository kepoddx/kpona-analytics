import { Observable, forkJoin, of } from "rxjs";
import { merge } from "rxjs/operators";
import { Example } from "./example";


export class Kpona {

    settings: {
        autoTrack:  true,
        trackPage:  false,
        trackDevice: false,
        trackBrowser: false,
        trackUser: false, 
    };

    trackQueue: Observable<any>[];
    example: Example
    constructor(parameters) {
        this.example = new Example(); 
    }

    // doc ready
    ready() {}
    // pass in params
    init(options = {}) {
        if(Object.keys(options).length >  0) {
            
            for (const key in options) {
                if (this.settings.hasOwnProperty(key)) {
                       this.settings[key] = options[key]
                }
            }
        } else {
            return this.startAutoTracking();
        }
    }

    get autoTrack(): boolean { return this.settings.autoTrack }
    get trackPage(): boolean { return this.settings.trackPage }
    get trackDevice(): boolean { return this.settings.trackDevice }
    get trackBrowser(): boolean { return this.settings.trackBrowser }
    get trackUser(): boolean { return this.settings.trackUser }

    startAutoTracking() {
        return merge(
            this.browser(),
            this.device(),
            this.page(),
            this.user(),
            this.forms()
        )
    }
    browser(): Observable<any> {
        return of({type: 'browser'})
    }
    device(): Observable<any> {
        return of({type: 'device'})
    }
    page(): Observable<any> {
        return of({type: 'page'})
    }
    user(): Observable<any> {
        return of({type: 'user'})
    }
    forms(): Observable<any> {
        return of({type: 'forms'})
    }
    trackEvent():Observable<any> {
        return of({type: 'event'})
    }


    getMovies() {
        return this.example.getMovies();
    }
}