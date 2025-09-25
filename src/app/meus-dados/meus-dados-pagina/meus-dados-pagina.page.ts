import { Component, OnInit } from '@angular/core';
import {StorageUtils} from "@cub3/utils/storage.utils";
import {Usuario} from "@cub3/classes/usuario";
import { Router, ActivatedRoute } from "@angular/router";
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';


@Component({
  selector: 'app-meus-dados-pagina',
  templateUrl: './meus-dados-pagina.page.html',
  styleUrls: ['./meus-dados-pagina.page.scss'],
})
export class MeusDadosPaginaPage implements OnInit {

	usuario:Usuario = StorageUtils.getAccount();

  constructor(private router:Router, 
    public cub3Svc:Cub3SvcProvider) { }

  ngOnInit() { 
    console.log("Usuario", this.usuario);
  }

  async ionViewWillEnter() {
    this.usuario = StorageUtils.getAccount();
  }
  async logout() {
    let carregar:any =  await this.cub3Svc.carregar(1);
    StorageUtils.removeAccount();

    setTimeout(() => {
      this.router.navigate(['/login']);  
      carregar.dismiss();
    }, 1000);
  	

  	
  }
}
