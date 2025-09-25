import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {StorageUtils} from '@cub3/utils/storage.utils';
import groupBy from 'lodash/groupBy';
import * as _ from "lodash";


@Component({
  selector: 'app-academico-conteudo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './academico-conteudo.page.html',
  styleUrls: ['./academico-conteudo.page.scss'],
})
export class AcademicoConteudoPage implements OnInit {
 
  data:any = {MOB_CPROGRAMA: []};
  periodo:any[] = [];
  etapa:any[] = [];
  conteudos:any[] = [];
  disciplinas:any[] = [];
  dados:any = {};
  conteudoProgramatico:any[] = [];
  turmas:any[] = [];
  turmaAtiva:any = {};

  constructor(
    private cub3Db:Cub3DbProvider,
    private cub3Svc:Cub3SvcProvider,
    private cd:ChangeDetectorRef
    ) { 

  }
  listarTurmas(escolas) {
    let turmas = [];
    
    escolas.forEach(escola => {
      escola.turmas.forEach(turma => {
      turmas.push(turma);
      });
    });
    
    return turmas;
    }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.data = StorageUtils.getItem("data"); 
    const escolas = StorageUtils.getItem("escolas");
    this.conteudoProgramatico = (escolas?.conteudo);
 
  	this.turmas = await this.cub3Svc.getTurmas()

    this.cd.markForCheck();
  }
  addArr(item:any, tipo:string) {
    let flag:boolean = false;
    for(let aux of this[tipo]) {
      if(item == aux)
        flag = true;
    }
    if(!flag)
      this[tipo].push(item);
  } 
  async getConteudo(evt?:any ) { 
    // Filtra o conteudo por this.dados.periodo e this.dados.disciplina
    this.conteudos = [];
    console.log('Buscando conteudo da turma', evt);
    try {
      const conteudos = await this.cub3Svc.getNode(`educanet/profissional/conteudoMobile?idf_disciplina=${this.dados.DES_DISCIPLINA}&idf_etapa=${this.dados.turma?.etapa?.idfInep}`);
    
      for (let conteudo of conteudos.dados) {
        try { 
            this.conteudos.push(conteudo); 
        } catch (e) {
          console.log('Erro', e);
        }
      }
    }
    catch(e) {
      console.log("Erro Conteúdos",e)
    } 
    if(this.dados.DES_DISCIPLINA != null) {
      this.conteudos = this.conteudos.filter(item => {
        if (typeof item.DES_DISCIPLINA === 'string' && typeof this.dados.DES_DISCIPLINA === 'string') {
          return item.DES_DISCIPLINA.trim() === this.dados.DES_DISCIPLINA.trim();
        } else {
          return item.IDF_DISCIPLINA === this.dados.DES_DISCIPLINA;
        }
      });
      console.log("Conteudos", this.conteudos);
      
    }
    this.getDisciplinas();
    this.cd.markForCheck();
  }
  async getDisciplinas() {
	try {
			let turmas = await this.cub3Svc.getTurmas();
			let turma = turmas.find(turma => parseInt(turma.id) == parseInt(this.dados.turma.id))
			this.turmaAtiva = turma; 
			
			console.log("Turma", turma);
			try {
			this.disciplinas = this.turmaAtiva.disciplinas || [];
			}
			catch(e) {
				this.disciplinas = [];
			}
		}
		catch(e) {
			
		}
	
	this.cd.markForCheck();
  }

  getPeriodos() {
    return _.sortBy(this.periodo, o => o);
  }
}
