import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';

import { App, NavController , NavParams } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  homePage: any = HomePage;
  contactPage: any = ContactPage;

  constructor(private navCtrl: NavController, protected _app: App, private params: NavParams) {
    
  }

  buttonGoTo(resultPage) {
     this._app.getRootNav().push(resultPage);
  }


}
