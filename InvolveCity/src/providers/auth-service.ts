import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Auth0Vars } from '../validators/auth0-variables';

declare var Auth0: any;
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

	jwtHelper: JwtHelper = new JwtHelper;
	

	auth0 = new Auth0({clientID: Auth0Vars.AUTH0_CLIENT_ID, domain: Auth0Vars.AUTH0_DOMAIN});
	

	lock = new Auth0Lock(Auth0Vars.AUTH0_CLIENT_ID, Auth0Vars.AUTH0_DOMAIN, {
		auth: {
			redirect: false,
			params: {
				scope: 'openid profile offline_access',
				device: 'my-device'
			}, 
			sso: false
		}
	});

	refreshSubscription: any;
	user: Object;
	zoneImpl: NgZone;
	accessToken: string;
	idToken: string;


	constructor(private authHttp: AuthHttp, zone: NgZone, public storage: Storage){

    	storage.ready().then(() => {
      		// Storage is ready to use
      		// Note: ready() is only available in 1.1.7 or greater!
    	});
		
		this.zoneImpl = zone;

		//check if there is a profile save in local storage
		this.storage.get('profile').then(profile => {
			this.user = JSON.parse(profile);
		}).catch(error => {
			console.log(error);
		});

		
		this.storage.get('id_token').then(token => {
			this.idToken = token;
		});


		this.lock.on('authenticated', authResult => {
			if (authResult && authResult.accessToken && authResult.idToken) {
				this.storage.set('access_token', authResult.accessToken);
				this.storage.set('id_token', authResult.idToken);
				this.storage.set('refresh_token', authResult.refreshToken);
				this.accessToken = authResult.accessToken;
				this.idToken = authResult.idToken;


				//fetch profile information
				this.lock.getUserInfo(this.accessToken, (error, profile) => {
					
					if(error) {
						alert(error);
						return;
					}

					profile.user_metadata = profile.user_metadata || {};
					this.storage.set('profile', JSON.stringify(profile));
					this.user = profile;
				});


				this.lock.hide();


				this.zoneImpl.run(() => this.user = authResult.profile);


				// schedule a token refresh
				this.scheduleRefresh();

			} // end if

		}); // end this.lock.on

	} // constructor


	public authenticated() {
		return tokenNotExpired('id_token', this.idToken);
	}


	public login() {
		//
		this.lock.show();
	}


	public logout() {
		this.storage.remove('profile');
		this.storage.remove('access_token');
		this.storage.remove('id_token');
		this.idToken = null;
		this.storage.remove('refresh_token');
		this.zoneImpl.run(() => this.user = null);
		// unschedule the token refresh
		this.unscheduleRefresh();
	}


public scheduleRefresh() {
// if the user is authenticated, use the token stream
// provided by angular2-jwt and flatMap the token


	let source = Observable.of(this.idToken).flatMap(
		token => {

			console.log('token here: ', token);
			// the delay to generate in this case is the difference
			// between the expiry time and the issued at time
			let jwtIat = this.jwtHelper.decodeToken(token).iat;
			let jwtExp = this.jwtHelper.decodeToken(token).exp;
			let iat = new Date(0);
			let exp = new Date(0);

			let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

			return Observable.interval(delay);
	});

	this.refreshSubscription = source.subscribe( () => {
		this.getNewJwt();
	});
}

public unscheduleRefresh() {

}

public startupTokenRefresh() {


}

public getNewJwt() {

}

}
