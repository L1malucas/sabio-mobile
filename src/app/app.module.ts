import { NgModule, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage'; 
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Toast } from '@ionic-native/toast/ngx';

import { HttpClientModule } from '@angular/common/http'; 
import { AppVersion } from '@ionic-native/app-version/ngx';
import {MomentModule} from "ngx-moment";
import { HTTP } from '@ionic-native/http/ngx';
import {Cub3Module } from "@cub3/cub3.module";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FTP } from '@ionic-native/ftp/ngx';

import { NgCalendarModule  } from 'ionic2-calendar';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

import { registerLocaleData } from '@angular/common';
import localept from '@angular/common/locales/pt';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { NODE_URL, SOCKET_URL } from "./cub3/cub3-config";
 
import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';  
const config: SocketIoConfig = { url: 'http://'+NODE_URL+':49994', options: {transports: ['websocket']} };
import { DatePickerModule } from 'ionic4-date-picker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx'; 

@Injectable()
export class SocketLocal extends Socket {
    constructor() {
        super({ url: SOCKET_URL });
    }
}
registerLocaleData(localept, 'pt');

@NgModule({
  declarations: [
  AppComponent 
  ],
  entryComponents: [],
  imports: [
  	BrowserModule,
    DatePickerModule,
   	IonicModule.forRoot({mode: 'md'}), 
    NgCalendarModule, 
    SocketIoModule.forRoot(config),
    HttpClientModule,
    MomentModule,
   	AppRoutingModule,
    Cub3Module,
    IonicStorageModule.forRoot({
      name: '__cub3'
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    StatusBar,
    AndroidPermissions,
    SplashScreen,
    AppVersion,
    WheelSelector,
    Geolocation, 
    FileChooser,
    FileTransfer,
    File,
    BackgroundMode,
    Toast,
    MobileAccessibility,
    WebView,
    HTTP,
    VideoPlayer,
    SocketLocal,
  	SQLite,
    FTP,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
