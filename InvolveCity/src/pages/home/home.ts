import { Component, ViewChild, ViewChildren, QueryList, Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, ResponseOptions, RequestOptions } from '@angular/http';
import { App, NavController, AlertController } from 'ionic-angular';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AboutPage } from '../about/about';
//import { Map as iMap } from "immutable";
import { Answers } from '../../app/answers';

import {
  StackConfig,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent
} from 'angular2-swing';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('myswing1') swingStack: SwingStackComponent;
  @ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;

  cards: Array<any> = [];
  cardStack: Array<any>;
  count: any = 1;

  stackConfig: StackConfig;
  recentCard: string = '';
  aboutpage: any = AboutPage;
  latestSnapshot: any = {};
  timestamp = new Date().getTime();
  subject: any;
  websiteURL: any = 'https://ancient-forest-34366.herokuapp.com/api/interests';
  answersURL: any = 'https://ancient-forest-34366.herokuapp.com/api/answers';

  constructor(public navCtrl: NavController, protected _app: App, private alertCtrl: AlertController, private http: Http) {
    this.cardStack = [];
    this.stackConfig = {
      throwOutConfidence: (offset, element) => {
        return Math.min(Math.abs(offset) / (element.offsetWidth / 2), 1);
      },
      transform: (element, x, y, r) => {
        this.onItemMove(element, x, y, r);
      },
      throwOutDistance: (d) => {
        return 800;
      }
    };
  }
  ngAfterViewInit() {
    // Either subscribe in controller or set in HTML
    this.swingStack.throwin.subscribe((event: DragEvent) => {
      event.target.style.background = '#ffffff';
    });
    this.addNewCards(1);
  }
  // Called whenever we drag an element
  onItemMove(element, x, y, r) {
    var color = '';
    var abs = Math.abs(x);
    let min = Math.trunc(Math.min(16 * 16 - abs, 16 * 16));
    let hexCode = this.decimalToHex(min, 2);

    if (x < 0) {
      color = '#FF' + hexCode + hexCode;
    } else {
      color = '#' + hexCode + 'FF' + hexCode;
    }

    element.style.background = color;
    element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
  }

  // Connected through HTML
  voteUp(like: boolean) {
    //get reference to database snapshot of latest card
    //get categories from pictures. add the numbers at the end
    //place on database 
    let recentCard = this.cards.pop();
    this.count++;
    var recentJSON = JSON.stringify(recentCard);
    console.log("recent: " + recentJSON);
    let obj = JSON.parse(recentJSON);
    this.addNewCards(this.count);


    let answersCard: any;
    let votingText: any;
    //date_completed
    let datesComplete = new Date();
    console.log(datesComplete);
    //answer_id
    let ansID = Math.floor(Math.random() * (100000 - 1)) + 1;
    //console.log(ansID);
    //person_id
    let personID = JSON.stringify("007");
    //console.log(personID);
    //sample_id
    let sampleID = JSON.stringify("3001");
    //console.log(sampleID);
    //voting
    votingText = {  "attributes_id" : eval(obj.picture_attributes_id), 
                    "att_cat_value" : eval(obj.att_cat_value) };   //console.log("voting: " + JSON.stringify(votingText));

    if (like) {
      console.log("Liked!");
      answersCard = {
	                  "answer_id": ansID,
	                  "person_id": "007",
	                  "sample_id": "3001",
	                  "date_completed": datesComplete,
                    "voting": votingText,
      };

      console.log("answer: " + answersCard);
      this.sendCards(answersCard);
    } else {
      console.log("unliked");
      votingText = {  "attributes_id" : eval(obj.picture_attributes_id), 
                      "att_cat_value" : (eval(obj.att_cat_value)*-1) };
      //console.log("neg voting: " + JSON.stringify(votingText));
      answersCard = {
	                  "answer_id": ansID,
	                  "person_id": "007",
	                  "sample_id": "3001",
	                  "date_completed": datesComplete,
                    "voting": votingText
      };

      console.log("neg answer: " + answersCard);
      this.sendCards(answersCard);
    }
  }

  trackByCards(index: number, card: any) {
    return card.picture_id;
  }

  // http://coenraets.org/blog/2016/02/angular2-ionic2-rest-services/
  sendCards(postcards) {
/*    let body = JSON.stringify(postcards);
    let headers = new Headers({'Content-Type':'applications/json'});
    let options = new RequestOptions({headers: headers});
    return this.http.post(this.answersURL, body, options)
    .map((res:Response) => res.json())
    .catch(this.handleError);*/

		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });

/*  let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let options = new RequestOptions({headers: headers});*/
    console.log("POST: " + JSON.stringify(postcards));
    this.http.post(this.answersURL, JSON.stringify(postcards), options)
                .map( res => res.json())
                .subscribe( data => {
                  console.log(data);
                });

    return;
  }

  private handleError(error) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  } 

  // Add new cards to our array
  addNewCards(num: number) {

    this.http.get('https://ancient-forest-34366.herokuapp.com/api/interests/' + (num + 99))
      .map(responseData => responseData.json())
      .flatMap(result => result.data)
      .subscribe(data => {
        this.cards.push(data);
        this.cardStack.push(data);
      }, error => {
        console.error(error);
      });

  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Instructions',
      message: 'Swipe Right &#x21aa;. If answer is (Yes).\n Swipe Left &#x21a9;. If (No).',
      buttons: ['OK']
    });
    alert.present();
  }

  showMore() {
    let questAlert = this.alertCtrl.create({
      title: 'Finished!',
      message: 'Thank You from West Sacramento.',
      buttons: ['OK']
    });
    this.navCtrl.push(AboutPage);
    questAlert.present();
  }

  NoButton() {
    this.onItemMove(this.latestSnapshot, 800, 800, 45);
  }

  YesButton() {
    this.onItemMove(this.latestSnapshot, 800, 800, 45);
  }

  // http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript
  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 0 : padding;

    while (hex.length < padding) {
      hex = "0" + hex;
    }

    return hex;
  }

}
