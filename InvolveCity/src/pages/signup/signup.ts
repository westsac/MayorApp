import { Component } from '@angular/core';
import {
	NavController,
	NavParams,
	LoadingController,
	AlertController
} from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';

import { MainPage } from '../main-page/main-page';
/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class SignupPage {

	public signupForm;
	emailChanged: boolean = false;
	passwordChanged: boolean = false;
	submitAttempt: boolean = false;
	loading;

	constructor(public navCtrl: NavController,
		public navParams: NavParams,
		public formBuilder: FormBuilder,
		public authData: AuthData,
		public loadCtrl: LoadingController,
		public alertCtrl: AlertController) {

		this.signupForm = formBuilder.group({
			email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
			password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
		});
	}

	elementChanged(input) {
		let field = input.inputControl.name;
		this[field + "Changed"] = true;
	}

/*	signupUser() {
		this.submitAttempt = true;

		if (!this.signupForm.valid) {
			console.log(this.signupForm.value);
		} else {
			this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password).then(() => {
				this.navCtrl.push(MainPage);
			}, (error) => {
				this.loading.dismiss().then(() => {
					var errorMessage: string = error.message;
					let alert = this.alertCtrl.create({
						message: errorMessage, 
						buttons: [{ text: 'Ok', role: 'cancel'}]
					});
					alert.present();
				});
			});

			this.loading = this.loadCtrl.create({
				dismissOnPageChange: true,
			});

			this.loading.present();
		}
	}*/
}
