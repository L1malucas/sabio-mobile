import { Component, OnInit } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Router, ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-academico-alunos-por-turma',
  templateUrl: './academico-alunos-por-turma.page.html',
  styleUrls: ['./academico-alunos-por-turma.page.scss'],
})
export class AcademicoAlunosPorTurmaPage implements OnInit {

  turma:number;
  turmas:any = [];
  alunos:any = [];
  filtro:any;
  dados:any;
  carregando:boolean = true;
  constructor(
  	public cub3Svc:Cub3SvcProvider,
  	private cub3Db:Cub3DbProvider
  		) { }

  ngOnInit() {
  	this.init();
  } 
  async init() {
    this.turmas = await this.cub3Svc.getTurmas();
    this.alunos = await this.cub3Svc.listarAlunos(this.turmas);
    this.dados = {NME_TURMA: 'Turma'};
    this.filtro = {};
    this.carregando = false;
    
    // let carregar:any = await this.cub3Svc.carregar(1);

    // this.cub3Db.query("SELECT * FROM MOB_TURMAS GROUP BY IDF_TURMA").then((dados:any) => {
    //         for (var i = 0; i < dados.rows.length; i++) {
    //         this.turmas.push(dados.rows.item(i)); 
    //       }
    //     this.carregando = false;
    //   carregar.dismiss();
    //   });

  }
 async getAlunos() {
  try {
    this.alunos = this.turmas.find((x) => x.id == this.filtro.turma).alunos;
  }
  catch(e) {
    this.alunos = [];
  }
    // let carregar:any = await this.cub3Svc.carregar(1);
    // this.alunos = []; 
    // console.log(this.filtro.turma);
    // this.cub3Db.query("SELECT * FROM MOB_TURMAS_ALUNOS INNER JOIN MOB_ALUNOS ON MOB_ALUNOS.IDF_ALUNO = MOB_TURMAS_ALUNOS.IDF_ALUNO WHERE MOB_TURMAS_ALUNOS.IDF_TURMA = "+this.filtro.turma + " GROUP BY MOB_TURMAS_ALUNOS.IDF_ALUNO ORDER BY MOB_ALUNOS.NME_ALUNO ASC ").then((dados:any) => {
    // if(dados != undefined && dados.rows.length > 0){
    //         for (var i = 0; i < dados.rows.length; i++) {
    //         this.alunos.push(dados.rows.item(i)); 
    //       }
    //     }
    //     this.carregando = false;
    //   carregar.dismiss();
    //   });
  }


}
