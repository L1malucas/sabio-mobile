import { Component, OnInit } from '@angular/core';
import {StorageUtils} from '@cub3/utils/storage.utils';

import {Router, ActivatedRoute} from "@angular/router";

import {Location} from "@angular/common";
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
@Component({
  selector: 'app-academico-plano-ensino',
  templateUrl: './academico-plano-ensino.page.html',
  styleUrls: ['./academico-plano-ensino.page.scss'],
})
export class AcademicoPlanoEnsinoPage implements OnInit {

	data:any = {MOB_PLAULA: []};
	dados:any = {};
	usuario:any;
  constructor(
  	private route:ActivatedRoute,
  	private location:Location,
	private cub3Svc:Cub3SvcProvider,
  	private router:Router
  	) { }

  ngOnInit() {
    this.route.url.subscribe(() => {  
    	if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
	    	this.dados.IDF_PLAULA = this.route.snapshot.params.id;
	    	this.init();
	    }
	    else {
    		this.location.back();
	    }
    });
  }

  async init() {
  	this.data.MOB_PLAULA = StorageUtils.getItem("MOB_PLAULA");
  	this.usuario = StorageUtils.getAccount();
  }
  getConteudo(evt?:any ) { 
    let arr:any = this.data.MOB_PLAULA.filter(({IDF_PLAULA}) => IDF_PLAULA === this.dados.IDF_PLAULA+"" );
    
    if(arr[0])
    	return arr[0];
    else
    	return {};
  }

}
