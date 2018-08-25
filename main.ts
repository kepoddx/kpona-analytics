import { Kpona } from "./kpona";
import { mergeAll } from "rxjs/operators";


let kpona = new Kpona({});

kpona.getMovies()
    .subscribe(d => {
        console.log("d",d)
    })