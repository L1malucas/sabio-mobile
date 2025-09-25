import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
import {Location} from "@angular/common";
import { StorageUtils } from '@cub3/utils/storage.utils';

@Component({
  selector: 'app-academico-acompanhamento',
  templateUrl: './academico-acompanhamento.page.html',
  styleUrls: ['./academico-acompanhamento.page.scss'],
})
export class AcademicoAcompanhamentoPage implements OnInit {

  aluno:any = {
    IDF_ALUNO: null,
    acompanhamentos: []
  }
  dados:any;
  turmaAtiva:any = {};
  constructor(
    public cub3Svc:Cub3SvcProvider,
    private route:ActivatedRoute,
    private location:Location,
    private router:Router
  ) { }

  

  ngOnInit() {
    this.route.url.subscribe(() => {  
    	if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
	    	this.aluno.IDF_ALUNO = this.route.snapshot.params.alunoId;
        this.aluno.idRegistro = this.route.snapshot.params.id;
	    	this.init();
	    }
	    else {
    		this.location.back();
	    }
    }); 
  }
  async init():Promise<any> {
    const turmas = await this.cub3Svc.getTurmas();
    const alunos = await this.cub3Svc.listarAlunos(turmas);

    this.aluno = alunos.find((x) => x.id == this.aluno.IDF_ALUNO);
    console.log("Aluno", this.aluno);
    const acompanhamentos = await this.cub3Svc.getNode(`educanet/aluno-acompanhamento/acompanhamento/${this.aluno.idRegistro}`);
    if(acompanhamentos && acompanhamentos.dados)

      this.dados = acompanhamentos.dados;
      console.log("Acompanhamentos", this.aluno.acompanhamentos);


      
  }
  
}
