import { Component, OnInit } from '@angular/core';

import {StorageUtils} from "@cub3/utils/storage.utils";
import { Usuario} from "@cub3/classes/usuario";
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';

import {Router, ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-academico-quiz-pergunta',
  templateUrl: './academico-quiz-pergunta.page.html',
  styleUrls: ['./academico-quiz-pergunta.page.scss'],
})
export class AcademicoQuizPerguntaPage implements OnInit {

	dados:any = {};
	usuario:Usuario = StorageUtils.getAccount();

  constructor(
  	private location:Location,
  	private router:Router, private route:ActivatedRoute, private cub3Svc:Cub3SvcProvider) { 
  	this.dados.profissional_id = this.usuario.id;
  }

  ngOnInit() {
	this.init();
	    this.route.url.subscribe(() => {  
	    	if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
	    		this.dados.id = this.route.snapshot.params.id;
		    	this.getQuiz();
		    }
		    else {
	    		this.location.back();
		    }
	    });
  }
  async init() {
	this.usuario = StorageUtils.getAccount();
  }
  async getQuiz() {
  	const quizzes = StorageUtils.getItem("quizzes");

  	if(!quizzes || (quizzes && quizzes.length == 0))
  		this.location.back();
  	else {
  		for(let item of quizzes) {
  			if(item.id == this.dados.id)
  				this.dados = item;
  		}
  	}
  }
  async salvarQuiz() {
  	let camposObrigatorios:any[] = [
	  	{id:'titulo','label': 'Título'}, 
	  	{id:'descricao', 'label': 'Descrição'} 
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

  	let quizzes = StorageUtils.getItem("quizzes");

  	this.dados.id = Math.floor(Date.now() / 1000);
  	if(quizzes && quizzes.length > 0) {
  		quizzes.push(this.dados);
  	}
  	else {
  		quizzes = [this.dados];
  	}

  	StorageUtils.setItem("quizzes", quizzes);
  	this.router.navigateByUrl('/app/academico/academico-quiz-pergunta/'+this.dados.id, {replaceUrl: true});

  }

}
