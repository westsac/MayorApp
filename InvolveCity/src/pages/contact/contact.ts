import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Http } from '@angular/http';
import { NavController } from 'ionic-angular';
import 'rxjs/Rx';
import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  
  constructor(public navCtrl: NavController, auth: AuthService) {

  }


}
