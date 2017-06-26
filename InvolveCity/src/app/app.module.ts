import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MainPage } from '../pages/main-page/main-page';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SignupPage } from '../pages/signup/signup';

import { AuthData } from '../providers/auth-data'
import { AuthService } from '../providers/auth-service';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from 'ionic-native';
import { SwingModule } from 'angular2-swing';
import { BrowserModule } from '@angular/platform-browser';

export const firebaseConfig = {
    apiKey: "AIzaSyD_4PYrvyo2jIFM19GBpdP86h9nOKcEwRM",
    authDomain: "cityengage-b0c93.firebaseapp.com",
    databaseURL: "https://cityengage-b0c93.firebaseio.com",
    storageBucket: "cityengage-b0c93.appspot.com",
    messagingSenderId: "872117997124"
};

export const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MainPage,
    ResetPasswordPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    SwingModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    MainPage,
    ResetPasswordPage,
    SignupPage
  ],
  providers: [
    {provide: {AuthHttp, ErrorHandler}, useClass: IonicErrorHandler },
    AuthData, AuthService
  ]
})

export class AppModule {}
