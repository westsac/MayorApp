import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import firebase from 'firebase';


@Injectable()
export class AuthData {

	fireAuth: any;

	constructor(public af: AngularFire) {
		af.auth.subscribe(user => {
			if (user) {
				this.fireAuth = user.auth;
				console.log(user);
			}
		});
	}

	loginUser(newEmail: string, newPassword: string): any {
		return this.af.auth.login({ email: newEmail, password: newPassword });
	}

	resetPassword(email: string): any {
		return firebase.auth().sendPasswordResetEmail(email);
	}

	logoutUser(): any {
		return this.af.auth.logout();
	}

	signupUser (newEmail: string, newPassword: string): any {
		return this.af.auth.createUser({ email: newEmail, password: newPassword});
	}

	loginGuest ( ) {
		this.af.auth.login({
            email: 'cows.dev@gmail.com',
            password: 'cityofwestsacramento'
        });
	}
}
