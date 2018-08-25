import * as settings from '../data/settings.json';
import { Observable, from, forkJoin } from 'rxjs';
import { merge, switchMap, takeLast, tap, zip, combineAll, scan } from 'rxjs/operators';
import { create } from './utils';
import { arr2Obj } from './custom_operators/arr2obj';


export class BrowserAttributes {


    screenAttributes = {};

    constructor() {
        this.setScreenAttributes();
    }
    
    setScreenAttributes() {
      const { screen: { attributes} } = this.getSettings()
      this.screenAttributes = attributes;
    }
    

    getSettings() {
        // Refactor settings[0] 
        // Http call
        return settings[0]
    }

    screen() {
        return create({screen: this._getScreenData()})
    }
    window() {
        return create({window: this._getWindowData()})
    }
    browser() {
        return create({browser: this._getBrowserData()})
    }
    page() {
        return create({page: this._getPageData()})
    }
    getAttributes() {
        return forkJoin(
            this.screen(),
            this.window(),
            this.browser(),
            this.page()
        ).pipe(
            arr2Obj()
        )
    }

////////////////////////////////// UTILITY FUNCTIONS /////////////////////////////////////


    private _getScreenData() {
        for (let key in this.screenAttributes) {
            this.screenAttributes[key] = window.screen[key]
        }
        const orientation = {
            orientation: window.screen.availHeight > window.screen.availWidth ? 'portrait' : 'landscape'
        }
        return Object.assign({}, this.screenAttributes, orientation);       
    }

    private _getWindowData() {

        let body = document.body,
            html = document.documentElement;

        const attrs = {
            height: ('innerHeight' in window) ? window.innerHeight : document.documentElement.offsetHeight,
            width: ('innerWidth' in window) ? window.innerHeight : document.documentElement.offsetWidth,
            scrollHeight: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) || null,
            ratio: {
                height: (window.screen.availHeight) ? parseFloat((window.innerHeight / window.screen.availHeight).toFixed(2)) : null,
                width: (window.screen.availWidth) ? parseFloat((window.innerWidth / window.screen.availWidth).toFixed(2)) : null,
            }
        };
        return attrs;
    }

    private _getBrowserData() {
        const attrs = {
            'cookies': ('undefined' !== typeof navigator.cookieEnabled) ? navigator.cookieEnabled : false,
            'codeName': navigator.appCodeName,
            //  'description': this.getPageDescription(),
            'language': navigator.language,
            'browser_name': navigator.appName,
            'online': navigator.onLine,
            'platform': navigator.platform,
            'useragent': navigator.userAgent,
            'version': navigator.appVersion,
            //  'screen': getScreenProfile(),
            //  'window': getWindowProfile()
        };
        
        return attrs;
    }    

    private _getPageData() {
        let node;
        (document && typeof document.querySelector === 'function') ? node = document.querySelector('meta[name="description"]') : false;
        let attrs = node ? node.content : '';

        return { title: attrs };       
    }


}