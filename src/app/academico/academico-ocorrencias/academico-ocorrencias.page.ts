import { Component, OnInit } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Usuario} from '@cub3/classes/usuario';

@Component({
  selector: 'app-academico-ocorrencias',
  templateUrl: './academico-ocorrencias.page.html',
  styleUrls: ['./academico-ocorrencias.page.scss'],
})
export class AcademicoOcorrenciasPage implements OnInit {

	usuario:Usuario = StorageUtils.getAccount();
  	logSinc:any = [];
	dados:any = [];
  data:any = {};
  carregando:boolean = false;
  constructor(
  	public cub3Svc:Cub3SvcProvider,
  	private cub3Db:Cub3DbProvider
  	) { }

  ngOnInit() {

  }
  ionViewWillEnter() {
  	this.init();
  }

  async init() {
    this.usuario = StorageUtils.getAccount();
  	this.getRegistros();
  }
  async getRegistros() {
    this.data = StorageUtils.getItem("data");
    this.carregando = true;
  
    let ocorrencias = await this.cub3Db.getStorage("MOB_OCORRENCIA");;
    let turmas = await this.cub3Svc.getTurmas();
    let alunos = await this.cub3Svc.listarAlunos(turmas); 

  
    console.log([ocorrencias, alunos]);
    // Check if the arrays are not undefined
    if (!ocorrencias || !alunos) return;
  
    console.log("Obtendo registros do profissional", this.usuario.id);
    let result = ocorrencias
      .filter(ocorrencia => ocorrencia.IDF_PROFISSIONAL == this.usuario.id)
      .map(ocorrencia => {
        let aluno = alunos.find(aluno => aluno.id == ocorrencia.IDF_ALUNO);
  
        // Check if IDF_ALUNO exists before adding the record to the array
        return (aluno && aluno.id) ? {...ocorrencia, aluno} : null;
      })
      .filter(ocorrencia => ocorrencia !== null); // Remove null values from the array
  
    this.dados = result;
    console.log(this.dados);
    this.carregando = false;
  }
}
