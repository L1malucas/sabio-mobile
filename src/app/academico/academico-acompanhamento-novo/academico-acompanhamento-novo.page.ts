import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
import { Location } from "@angular/common";

@Component({
  selector: 'app-academico-acompanhamento-novo',
  templateUrl: './academico-acompanhamento-novo.page.html',
  styleUrls: ['./academico-acompanhamento-novo.page.scss'],
})
export class AcademicoAcompanhamentoNovoPage implements OnInit {

    dados:any = {};

  constructor(
    private cub3Svc:Cub3SvcProvider,
    private location:Location,
    private route:ActivatedRoute,
    private router:Router) { }

  ngOnInit() {
    this.route.url.subscribe(() => {  
    	if(this.route.snapshot.params.alunoId && this.route.snapshot.params.alunoId != 'undefined' ) {
	    	this.dados.alunoId = this.route.snapshot.params.alunoId;
	    }
	    else {
    		this.location.back();
	    }
    }); 
  }
  async submit() {
  	let camposObrigatorios:any[] = [
	  	{id:'data','label': 'Data de registro'}, 
	  	{id:'observacoes', 'label': 'Observações'}
  	];
  	let erros:any = [],
  		i:number = 0;

  	for(let item of camposObrigatorios) {
  		if(!this.dados[item.id] || this.dados[item.id] == ''){
  			erros.push(item.label);
  		}
  		i++;
  	}

  	if(erros.length > 0){
  		let aux:any = erros.join(", ");
  		this.cub3Svc.alerta("Ops!","Campo(s) obrigatório(s): <b>"+aux+"</b>");
  		return;
  	}
  	else {
      const dados:any = this.dados;

      const enviar = await this.cub3Svc.postNode(`educanet/aluno-acompanhamento/${dados.alunoId}`, {
        alunoId: dados.alunoId,
        escolaId: '-1',
          acompanhamento: {
            data:dados.data,
            observacoes: dados.observacoes
          }
      })

      if(enviar && enviar.dados) {
        this.cub3Svc.alerta("Registro de acompanhamento", "Registro enviado com sucesso!");
        this.location.back();
      }
      else {
        this.cub3Svc.alerta("Ocorreu um problema", "Por favor, verifique a data de registro e as observações.");

      }
    }
  }
}
