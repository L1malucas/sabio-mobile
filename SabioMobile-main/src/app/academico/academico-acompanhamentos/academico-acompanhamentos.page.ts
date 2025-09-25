import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
import { Location } from "@angular/common";
import { StorageUtils } from '@cub3/utils/storage.utils';

@Component({
  selector: 'app-academico-acompanhamentos',
  templateUrl: './academico-acompanhamentos.page.html',
  styleUrls: ['./academico-acompanhamentos.page.scss'],
})
export class AcademicoAcompanhamentosPage implements OnInit {


  aluno:any = {
    IDF_ALUNO: null,
    acompanhamentos: []
  }
  constructor(
    public cub3Svc:Cub3SvcProvider,
    private location:Location,
    private route:ActivatedRoute,
    private router:Router
  ) { }

  

  ngOnInit() {
    this.route.url.subscribe(() => {  
    	if(this.route.snapshot.params.alunoId && this.route.snapshot.params.alunoId != 'undefined' ) {
	    	this.aluno.IDF_ALUNO = this.route.snapshot.params.alunoId;
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
    const acompanhamentos = await this.cub3Svc.getNode(`educanet/aluno-acompanhamento/${this.aluno.IDF_ALUNO}`);
    if(acompanhamentos && acompanhamentos.dados)

      this.aluno.acompanhamentos = acompanhamentos.dados;
      console.log("Acompanhamentos", this.aluno.acompanhamentos);
  }
}
