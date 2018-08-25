import { from, fromEvent, forkJoin, Subject } from 'rxjs';
import { create } from './utils';
import { debug } from 'util';
import { mergeAll, switchMap } from 'rxjs/operators';
import { createSecureContext } from 'tls';

export class Forms {
    
    events$: Subject<any>;
    constructor() {
        this.events$ = new Subject();

    }
    init() {
      this.getForms();
      return this.events$
    }

    getForms () {
        let forms: NodeListOf<HTMLFormElement> = document.getElementsByTagName('form');

        Array.from(forms).forEach(el => {
            el.addEventListener ? el.addEventListener('submit', (e) => this.attachSubmitListener(e, el), false) : el.addEventListener('submit', (e) => this.attachSubmitListener(e, el));
        })
    }
    
    attachSubmitListener(e, el) {

        e.preventDefault();
        let form = {};
        for (let i = 0; i < el.length ; i++) {

            if (el.elements[i] && el.elements[i].type != "submit") {
                form[el.elements[i].name] = el.elements[i].value
             }
        }
        
        form[el.id]
        this.events$.next(form);
        setTimeout(() => {
            el.submit()
        }, 2000);
    }
}