import { Component, OnInit } from '@angular/core';
import {StorageUtils} from '@cub3/utils/storage.utils';

import {Router, ActivatedRoute} from "@angular/router";
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc'
import { AlertController } from '@ionic/angular';
;
import {Location} from "@angular/common";
import {Atividade} from "@cub3/classes";

@Component({
  selector: 'app-academico-atividades',
  templateUrl: './academico-atividades.page.html',
  styleUrls: ['./academico-atividades.page.scss'],
})
export class AcademicoAtividadesPage implements OnInit {

	turmaAtiva:any = {
		NME_TURMA: ''
	};
	data:any = {
		MOB_DISCIPLINAS: [],
		MOB_AVALIACOES: []
	};
	dados:Atividade[] = []; 
	carregando:boolean = true; 
	atividades:any[] =  [];
  constructor(
  	private route:ActivatedRoute,
  	private router:Router,
  	private location:Location,
    private alertController:AlertController,
  	private cub3Svc:Cub3SvcProvider,
  	private cub3Db:Cub3DbProvider
  	) { 
  }


  async init() {
  	this.getDados();  
  }
  ionViewWillEnter() {

  	this.init();
  }
  async remover(atividade:Atividade) {
    const carregar = await this.cub3Svc.carregar(1);
    this.cub3Svc.postNode("atividades/deletar", {id: atividade.id}).then((r:any) => {
      carregar.dismiss();
      this.cub3Svc.alertaToast("Remoção de Atividade", "Atividade removida com sucesso!");
      this.getDados();
    }, () => {
      carregar.dismiss();
      this.cub3Svc.alerta("Ops!", "Não foi possível remover a atividade.");
    });
  }
  async getDados() {
  	const carregar = await this.cub3Svc.carregar(1);
	try {
		this.cub3Svc.getNode("atividades/listar").then((res:any) => {
			carregar.dismiss();
			if(res && res.dados) {
				this.atividades = res.dados;
			}
		}, () => {
			carregar.dismiss();
		})
	}
	catch(e) {
		carregar.dismiss();
	}
  }
  ngOnInit() { 
  }

}
