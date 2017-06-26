import { Component, Inject } from '@angular/core';
import {
    NavController,
    LoadingController,
    AlertController
} from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';

import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';

@Component({
    selector: 'page-main-page',
    templateUrl: 'main-page.html'
})
export class MainPage {

    loginForm: any;
    emailchanged: boolean = false;
    passwordChanged: boolean = false;
    submitAttempt: boolean = false;
    loading: any;

    constructor(
        public navCtrl: NavController,
        public authData: AuthData,
        public loadCtrl: LoadingController,
        public alertCtrl: AlertController,
        @Inject(FormBuilder) public formBuilder: FormBuilder
    ) {
        this.loginForm = formBuilder.group({
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });
    }

    elementChanged(input) {
        let field = input.inputControl.name;
        this[field + "Changed"] = true;
    }

    loginUser() {


       this.submitAttempt = true;

        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        } else {
            this.authData.loginUser(this.loginForm.value.email,
                this.loginForm.value.password).then(authData => {
                    this.navCtrl.setRoot(ContactPage);
                }, error => {
                    this.loading.dismiss().then(() => {
                        let alert = this.alertCtrl.create({
                            message: error.message,
                            buttons: [{
                                text: "OK",
                                role: 'cancel'
                            }]
                        });
                        alert.present();
                    });
                });

            this.loading = this.loadCtrl.create({
                dismissOnPageChange: true,
            });
            this.loading.present();
        }
    }

    goToResetPassword() {
        this.navCtrl.push(ResetPasswordPage);
    }

    createAccount() {
        this.navCtrl.push(SignupPage);
    }

/*    facebookLogin() {
        this.authData.loginGuest();
    }

    googleLogin() {
        this.authData.loginGuest();
    }*/

    guestLogin() {
        this.authData.loginGuest();
    }

}
