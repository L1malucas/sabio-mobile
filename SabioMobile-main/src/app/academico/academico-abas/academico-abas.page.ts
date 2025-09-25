import { Component } from '@angular/core';
import {Usuario} from '@cub3/classes/usuario';
import {Router} from "@angular/router";

import {StorageUtils} from '@cub3/utils/storage.utils';
import { MenuController } from '@ionic/angular';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';

@Component({
  selector: 'app-academico-abas',
  templateUrl: 'academico-abas.page.html',
  styleUrls: ['academico-abas.page.scss']
})
export class AcademicoAbasPage {

	usuario:Usuario = StorageUtils.getAccount();
  constructor(
  	private router:Router,
    private cub3Svc:Cub3SvcProvider,
    private menuCtrl:MenuController
  	) {
      
    }

  async ionViewWillEnter() { 
    this.usuario = StorageUtils.getAccount();
   this.menuCtrl.enable(false);
    console.log("Usuário sem acesso", this.usuario);
  	// if(this.usuario.usuarioTipo.idSistema != 'PROFESSOR'){
  	// 	this.router.navigate(["/"]);
      
  	// }
  }
  ionViewWillLeave() {
    // this.menuCtrl.enable(true);
    
  }
}
