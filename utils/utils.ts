import { Observable } from 'rxjs';
export const log = function log(x) {
    console.log(x)
}


export const req = function(options) {

}

export const mergeObj = function(target, object) {

    return Object.assign({}, target, object);
}

export const extend =  function(target, ...args) {
    for (let i = 1; i < args.length; i++) {
        for( let prop in args[i]) {
            target[prop] = args[i][prop];
        }
    }
    return target;
}

export const create = (val) => {
    return Observable.create(observer => {
        observer.next(val);
        observer.complete();
    })
}

export const parseDateIime = (input) => {

    let date = input || new Date();
        return {
            'hour_of_day': date.getHours(),
            'day_of_week': parseInt(1 + date.getDay()),
            'day_of_month': date.getDate(),
            'month': parseInt(1 + date.getMonth()),
            'year': date.getFullYear()
        };       
}

export function getNodePath(el) {
    if(!el.nodeName) return '';

    let tree = [];
    while (el.parentNode != null) {
      log(el.nodeName)  

      let sibCount = 0;
      let sibIndex = 0;

      for(let i = 0; i < el.parentNode.childnodes.length; i++) {
          let sib = el.parentNode.childnodes[i];
          if( sib.nodename == el.nodeName ) {
              if ( sib === el ) {
                  sibIndex = sibCount;
              }
              sibCount++;
          }
      }

      if ( el.hasAttribute('id') && el.id != '') {
          tree.unshift(el.nodeName.toLowerCase() + "#" + el.id);
      } else if ( sibCount > 1 ) {
        tree.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
      } else {
          tree.unshift(el.nodeName.toLowerCase());
      }
      el = el.parentNode;
    }
    return tree.slice(1).join('>');
}

export const getNodeProfile = (el) => {
    return {
        action: el.action,
        class: el.className,
        href: el.href || null,
        id: el.id,
        method: el.method,
        name: el.name,
        node_name: el.nodeName,
        selector: getNodePath(el),
        text: el.text,
        title: el.title,
        type: el.type,
        x_position: el.offsetLeft || el.clientLeft || null,
        y_position: el.offsetTop || el.clientTop || null
    };    
}

export const parseHostname = (url) => {
    let hostname;

    /** Remvoe protocol */
    if(url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }
    
    /** remove port number */
    hostname = hostname.split(":")[0];
    hostname = hostname.split('?')[0];

    return hostname;
}

export const parseDomainName = (url) => {
    let domain = parseHostname(url);
    let split = domain.split('.')
    let lgth = split.length;

     /** extract the root domain if there is a subdomain */
     if(lgth > 2) {
         domain = split[lgth -2] + '.' + split[lgth - 1];
            // check for Country code top level domain (ccTLD) (ex.  ".me.uk")
         if(split[lgth - 2 ].length == 2 && split[lgth - 1].length == 2) {
            // if using ccTLD
            domain = split[lgth -3] + '.' + domain;
         }
     }

     return domain;
}

export function getScrollState(obj) {
    let config = typeof obj === 'object' ? obj : {};
    let state = extend({
        pixel: 0,
        pixel_max: 0,
        ratio: null,
        ratio_max: null
    }, config);

    if (typeof window != undefined || typeof document != undefined) {
        state.pixel = getScrollOffset() + getWindowHeight();
        if (state.pixel > state.pixel_max) {
            state.pixel_max = state.pixel;
        } 
        state.ratio = (state.pixel / getScrollableArea()).toFixed(2);
        state.ratio_max = (state.pixel_max / getScrollableArea()).toFixed(2)
    }
    return state;
}

export function getScrollableArea() {
    let body = document.body,
        html = document.documentElement;
    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) || null;
}

export function getScrollOffset() {
    return (window.pageYOffset != undefined) ? window.pageYOffset : (document.documentElement as HTMLDivElement || document.body.parentNode as HTMLDivElement || document.body as HTMLDivElement).scrollTop
}

export function getWindowHeight() {
    return window.innerHeight || document.documentElement.clientHeight;
}