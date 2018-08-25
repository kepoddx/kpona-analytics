import * as settings from '../data/settings.json';
import { Observable, from } from 'rxjs';
import { merge, switchMap, takeLast } from 'rxjs/operators';

/**
 *  Class to get screen attributes
 * @class
 * 
 * 
 */

export interface ScreenAttributes {
    name: string;
    attrs: Object[]
}
export class Screen {
    profile = {
        screen: {},
        window: {},
        browser: {},
        page: {}
    };
    attributes: {} = {
        height: '', width: '', colorDepth: '', pixelDepth: '', availHeight: '', availWidth: ''
    }

    /** @constructor */

    constructor() {
        
    }

    /** 
     * Get settings from API
     * Implement
     * @function
     * 
     * @description
     * 
     * Get Sreen Attributes
     */
    getScreen() { 
        return Observable.create(observer => {

              for(let key in this.attributes) {
                  this.attributes[key] = window.screen[key]
              }
              const orientation = {
                    orientation: window.screen.availHeight > window.screen.availWidth ? 'portrait' : 'landscape'
                }
            // const attrs = Object.assign({name: 'screen'}, this.attributes, orientation);
            this.profile.screen = Object.assign(this.attributes, orientation);
            observer.next();
            observer.complete();
        })
    }

    /**
     * @function
     * 
     * @description
     * 
     * Get window attributes
     */
    getWindow() {
        let body = document.body,
            html = document.documentElement;
        return Observable.create(observer => {
            const attrs = {
                height: ('innerHeight' in window) ? window.innerHeight : document.documentElement.offsetHeight,
                width: ('innerWidth' in window) ? window.innerHeight : document.documentElement.offsetWidth,
                scrollHeight: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) || null,
                ratio: {
                    height: (window.screen.availHeight) ? parseFloat((window.innerHeight / window.screen.availHeight).toFixed(2)) : null,
                    width: (window.screen.availWidth) ? parseFloat((window.innerWidth / window.screen.availWidth).toFixed(2)) : null,
                }
            };
            // const data = Object.assign({}, attrs)
            this.profile.window = Object.assign({}, attrs);
            observer.next();
            observer.complete();
        })
    }

    /** 
     * 
     * @function
     * 
     * @description
     * 
     * Get browser attributes
     */

     getBrowser(){
         return Observable.create(observer => {
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

            //  const data = Object.assign({}, attrs)
             this.profile.browser = Object.assign({}, attrs);
             observer.next();
             observer.complete();
         })
     }
 
     /**
      * 
      * @function
      * 
      * @description
      * 
      * Get page title etcc
      */
     getPageDescription(){
          return Observable.create(observer => {
              let node;
              (document && typeof document.querySelector === 'function') ? node = document.querySelector('meta[name="description"]') : false;
              let attrs = node ? node.content : '';
              
              this.profile.page = Object.assign({}, {title: attrs});
              observer.next();
              observer.complete();
          })
     }

     /**
      * 
      * @function
      * 
      * @description
      * 
      * Get browser attributes
      */

     getBrowserAttributes() {
         return from(this.getScreen())
              .pipe(
                merge(this.getWindow(), this.getPageDescription(), this.getBrowser()),
              )
     }

     getProfile() {
         return Observable.create(observer => {
             observer.next(this.profile);
             observer.complete();
         })
     }
     buildProfile() {
        return from(this.getBrowserAttributes())
            .pipe(
                switchMap(d => this.getProfile()),
                takeLast(1)
            )

     }

}