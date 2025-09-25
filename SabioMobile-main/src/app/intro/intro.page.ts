import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MenuController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  images = [
    { src: 'assets/img/icones/icone1.png', top: '10%', left: '20%', size: '60px' },
    { src: 'assets/img/icones/icone2.png', top: '15%', left: '70%', size: '50px' },
    { src: 'assets/img/icones/icone3.png', top: '30%', left: '10%', size: '80px' },
    { src: 'assets/img/icones/icone4.png', top: '20%', left: '50%', size: '70px' },
    { src: 'assets/img/icones/icone5.png', top: '40%', left: '30%', size: '90px' }
  ];
  
  constructor(
    private menuCtrl:MenuController,
    private platform: Platform,
  	private router:Router,
  	private statusBar: StatusBar,
    private androidPermissions: AndroidPermissions
    ) { }

  ionViewDidEnter() {
    this.menuCtrl.enable(false);

    if (this.platform.is('android')) {
    this.platform.ready().then(() => {  
        const list:any = [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT,
        this.androidPermissions.PERMISSION.RECORD_AUDIO,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION,
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
        this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS,
        this.androidPermissions.PERMISSION.MODIFY_AUDIO_SETTINGS,
        this.androidPermissions.PERMISSION.FOREGROUND_SERVICE
      ];
       this.androidPermissions.requestPermissions(list);
     });
    }
  }
  ngOnInit() {
    this.init();
  }
  init() { 
	this.statusBar.overlaysWebView(false); 
	this.statusBar.styleDefault();
	this.statusBar.backgroundColorByHexString('#ffffff');
  }
  entrar() {
    this.router.navigate(["/login"]);
  }

}
