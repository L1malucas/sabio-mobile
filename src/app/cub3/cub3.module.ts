import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cub3HeaderComponent } from './cub3-header/cub3-header.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { Cub3AuthGuard } from './cub3-svc/auth-guard.service';
import { Cub3AuthService } from './cub3-svc/auth.service';
import { Cub3SvcProvider } from './cub3-svc/cub3-svc';
import { Cub3DbProvider } from './cub3-db/cub3-db'; 
import { Cub3CameraComponent } from './cub3-camera/cub3-camera.component';
import { Cub3CameraPreviewComponent } from './cub3-camera-preview/cub3-camera-preview.component';
import { Cub3DeviceSelectComponent } from './cub3-device-select/cub3-device-select.component';
import { Cub3VideoPreferenciasComponent } from './cub3-video-preferencias/cub3-video-preferencias.component';
import { Cub3VideoParticipantesComponent } from './cub3-video-participantes/cub3-video-participantes.component'; 
import { WebcamModalComponent } from '@cub3/webcam-modal/webcam-modal.component';
import {WebcamModule} from 'ngx-webcam';   
// import '@capacitor-community/camera-preview'; 


@NgModule({
  declarations: [
  	Cub3HeaderComponent,
    Cub3CameraComponent,
    Cub3CameraPreviewComponent,
    Cub3DeviceSelectComponent,
    Cub3VideoPreferenciasComponent,
    Cub3VideoParticipantesComponent,
    WebcamModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    WebcamModule, 
    MomentModule, 
    RouterModule 
  ],
  providers: [
  	Cub3AuthGuard,
	Cub3AuthService,
	Cub3SvcProvider, 
	Cub3DbProvider,
	],
  exports: [
  	Cub3HeaderComponent,
    Cub3CameraComponent,
Cub3CameraPreviewComponent,
Cub3DeviceSelectComponent,
Cub3VideoPreferenciasComponent,
Cub3VideoParticipantesComponent,
WebcamModalComponent,
WebcamModule
  	]
})
export class Cub3Module { }
