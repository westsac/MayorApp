import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { MainPage } from '../pages/main-page/main-page';

import { AngularFire } from 'angularfire2';
import { AuthData } from '../providers/auth-data';
import { AuthService } from '../providers/auth-service';

@Component({
	template:  `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
	rootPage: any;

	constructor(platform: Platform, public af: AngularFire) {
		
		const authObserver = af.auth.subscribe(user => {
			this.rootPage = user ? HomePage : MainPage;
			user ? authObserver.unsubscribe() : af.auth.logout(); ;
		});

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			StatusBar.styleDefault();
			Splashscreen.hide();
		});
	}


}
