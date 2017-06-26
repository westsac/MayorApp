import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Answers } from '../app/answers';
/*
  Generated class for the AnswerService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AnswerService {
    answersUrl: '/api/answers';

    constructor(public http: Http) {

    }

    load(): Observable<Answers[]> {
        return this.http.get(this.answersUrl)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error) {
        console.error(error); // log to console instead
        return Observable.throw(error.json().error || 'Server Error');
    }

}
