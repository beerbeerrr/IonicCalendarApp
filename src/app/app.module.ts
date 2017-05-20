import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NgCalendarModule } from 'ionic2-calendar';

import { CalendarService } from '../services/calendar.service';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { DetailsPage } from '../pages/details/details';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DetailsPage
  ],
  imports: [
    BrowserModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CalendarService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
