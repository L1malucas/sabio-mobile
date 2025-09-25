import { Component, OnInit } from '@angular/core';
import {StorageUtils} from '@cub3/utils/storage.utils';

import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';

@Component({
  selector: 'app-meus-dados-frequencia',
  templateUrl: './meus-dados-frequencia.page.html',
  styleUrls: ['./meus-dados-frequencia.page.scss'],
})
export class MeusDadosFrequenciaPage implements OnInit {

	data:any = {
		MOB_PROF_FRQ: []
	};
  constructor(
  	private cub3Db:Cub3DbProvider,
  	private cub3Svc:Cub3SvcProvider
  	) { }

  ngOnInit() {
  }

  async init() {

  	let carregar:any = await this.cub3Svc.carregar(1);
	  this.cub3Db.query("SELECT * FROM MOB_PROF_FRQ ORDER BY IDF_FREQUENCIA DESC  ").then((data:any) => {
	    if(data != undefined) {
	      for (var i = 0; i < data.rows.length; i++) {
	        this.data.MOB_PROF_FRQ.push(data.rows.item(i)); 
	      }
	    }
	    carregar.dismiss();
  });
  }
}
