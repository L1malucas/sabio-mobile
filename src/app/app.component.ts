import { Component } from '@angular/core';

import { Socket } from 'ngx-socket-io';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router, ActivatedRoute } from "@angular/router";
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {StorageUtils} from "@cub3/utils/storage.utils";
import {Usuario} from "@cub3/classes/usuario";
import {Cub3DbProvider} from "@cub3/cub3-db/cub3-db";
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { MenuController } from '@ionic/angular';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  classe:string = "";
  usuario:Usuario = StorageUtils.getAccount();

  constructor(
    private platform: Platform, 
    private router:Router,
    private menu: MenuController, 
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();

  }

  getUsuario():Usuario {
    this.usuario = StorageUtils.getAccount() || new Usuario();

    return this.usuario;
  }
  initializeApp() { 
    this.platform.ready().then(() => { 
      this.menu.enable(false);
      this.solicitarPermissao();
      // this.socket.connect();
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
      this.splashScreen.hide();
    });
  }


    public solicitarPermissao() {
      console.log("Solicitando permissão");
      //  if(!navigator || !navigator.permissions)
      //      return;

      //  try {
      //     navigator.getUserMedia (
      //        // constraints
      //        {
      //           video: true,
      //           audio: true
      //        },

      //        // successCallback
      //        (localMediaStream) => {
      //           console.log("permissão ok")
      //        },

      //        // errorCallback
      //        (err) => {
      //         if(err) {
      //           console.log("Erro permissão");
      //         }
      //        }
      //     );
      //   }
      //   catch(e) {

      //   }
    }
  getClasse() {
    let tipoSelecionado:any = StorageUtils.getItem("tipoSelecionado");

    if(tipoSelecionado && tipoSelecionado.classe)
      this.classe = "ion-page-"+tipoSelecionado.classe;

    return this.classe;
  }
  logout() {
    StorageUtils.removeAccount();

    this.router.navigate(['/login']);
  }

}
