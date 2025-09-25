import { Component, OnInit } from '@angular/core';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import * as _ from "lodash";

@Component({
  selector: 'app-academico-planos-ensino',
  templateUrl: './academico-planos-ensino.page.html',
  styleUrls: ['./academico-planos-ensino.page.scss'],
})
export class AcademicoPlanosEnsinoPage implements OnInit {

	data:any = {MOB_PLAULA: []};
  periodo:any[] = [];
  dados:any = {};
	usuario:any;
  constructor(private cub3Svc:Cub3SvcProvider) { }

  ngOnInit() {
  	this.init();
  }

  async init() {
  	this.data = StorageUtils.getItem("data");
  	this.usuario = StorageUtils.getAccount();

    this.periodo.push('1º Trimestre');
    this.periodo.push('2º Trimestre');
    this.periodo.push('3º Trimestre');
  }
  getConteudo(evt?:any ) { 
    let arr:any = this.data.MOB_PLAULA.filter(({IDF_DISCIPLINA, IDF_ESCOLA, IDF_ETAPA}) => IDF_DISCIPLINA === this.dados.IDF_DISCIPLINA && IDF_ESCOLA === this.dados.IDF_ESCOLA && IDF_ETAPA === this.dados.IDF_ETAPA );

    return arr;
  }
  getPeriodos() {
    return _.sortBy(this.periodo, o => o);
  }

}
