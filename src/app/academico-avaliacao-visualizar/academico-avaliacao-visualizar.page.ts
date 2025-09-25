import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import { IonSlides } from '@ionic/angular';
import { StorageUtils } from '@cub3/utils/storage.utils';

@Component({
  selector: 'app-academico-avaliacao-visualizar',
  templateUrl: './academico-avaliacao-visualizar.page.html',
  styleUrls: ['./academico-avaliacao-visualizar.page.scss'],
})
export class AcademicoAvaliacaoVisualizarPage implements OnInit {

	turma:any = {aulas:[], IDF_TURMA: null};
	aula:any;
	dados:any = {};
	turmaAtiva:any = {};
	data:any = {
		MOB_REGISTRO_AVALIACAO:[]
	};
	carregando:boolean = true;
  jsonData:any = {
    notas1: [],
    notas2: [],
    faltas: []
  };

	modoExibicao:string = 'Slides'; 
  @ViewChild(IonSlides) slides: IonSlides;
  constructor(
  	private cub3Db:Cub3DbProvider,
  	public cub3Svc:Cub3SvcProvider,
  	private selector:WheelSelector,
  	private location:Location,
  	private route:ActivatedRoute,
  	private router:Router
  	) { 

  }

  ngOnInit() {
    this.route.url.subscribe(() => {  
    	if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
	    	this.turma.IDF_TURMA = this.route.snapshot.params.id;
	    	this.turma.idAvaliacao = this.route.snapshot.params.idAula;
	    	this.init();
	    }
	    else {
    		this.location.back();
	    }
    }); 
  }

 abrirNotaModal(item:any) {
  try {
     this.selector.show({
       title: "Qual a nota da avaliação?",
       items: [
         this.jsonData.notas1, this.jsonData.notas2
       ],
       positiveButtonText: "Selecionar",
       negativeButtonText: "Cancelar",
     }).then(
       result => {
         console.log(result[0].val + ' at index: ' + result[0].index);
       item.nota = result[0].description+""+result[1].description;
       },
       err => console.log('Error: ', err)
       );
    }
    catch (e){ 
      console.log((<Error>e).message); 
    }
 }


  atualizarAulas() { 
  }
  async init() {
	this.data = StorageUtils.getItem("data");
	this.carregando = true;
	// if(this.turma == null || (this.turma != undefined && this.turma.IDF_TURMA == null))
	//   this.location.back();
	// else
	//   this.turma.aulas = [];
  
	let turmas = await this.cub3Svc.getTurmas();
    const data = StorageUtils.getItem("data");
	let aulas = [];

    if(data && data['MOB_REGISTRO_AVALIACAO'])
    	aulas =  data['MOB_REGISTRO_AVALIACAO'] || [];
 
    this.turmaAtiva = turmas.find(turma => turma.id == this.turma.IDF_TURMA);
    
  
	this.aula = aulas.find(aula => aula.id == this.turma.idAvaliacao);
  console.log("Avaliação", this.aula);
  
	console.log(this.turma.aulas);
	this.carregando = false;
	this.getAlunos();
  }
  async getAlunos() {
    console.log("Obtendo alunos", this.turma);
    this.carregando = true;

    // Busca os dados de avaliação do armazenamento.
    const movLancamento = this.data["MOV_REGISTRO_AVALIACAO"] || [];
  
    // if (!movLancamento) {
    //     console.error('Dados de avaliação não estão disponíveis.');
    //     this.carregando = false;
    //     return;
    // }

    // Percorre cada aluno na turma ativa e busca sua avaliação correspondente.
    this.dados.alunos = this.turmaAtiva.alunos.map(aluno => {
        // Encontra a avaliação que corresponde ao id do aluno e à avaliação atual.
        const avaliacaoAluno = movLancamento.find(registro =>
            registro.idAluno === aluno.id && registro.idAvaliacao === this.turma.idAvaliacao
        );

        // Se encontrou uma avaliação correspondente, adiciona a nota ao objeto do aluno.
        if (avaliacaoAluno) {
            aluno.nota = avaliacaoAluno.nota;
        } else {
            // Caso não encontre uma avaliação, pode definir um valor padrão ou deixar sem nota.
            aluno.nota = undefined; // Ou qualquer valor padrão que você considerar adequado.
        }

        return aluno;
    });

    console.log(this.dados.alunos);
    this.carregando = false;
}

  revisarChamada() {
  	this.modoExibicao = this.modoExibicao == 'Slides' ? 'Lista' : 'Slides';
  }
  setFreq(item:any, val:any, index:number) {
  	this.dados.alunos[index].SIT_ALUNO = val;

  	if(index < this.dados.alunos.length-1)
  		this.slides.slideTo(index+1, 500);
  	else
  		this.revisarChamada();
  }
  avancar(index:number) {
  	if(index < this.dados.alunos.length-1)
  		this.slides.slideTo(index+1, 500);
  	else
  		this.revisarChamada();

  }

  async finalizarChamada() {
  	let carregar = await this.cub3Svc.carregar(1);

  	let nFrequentes:number = 0,
  		dados:any = [];
  	for (var i = 0; i < this.dados.alunos.length; i++) {
  		if(this.dados.alunos[i] && this.dados.alunos[i].nota != undefined && this.dados.alunos[i].nota != null){
  			nFrequentes++;
  			let aux:any = {
  				id: Math.floor(Math.random() * 1000) + 1,
  				idAvaliacao: this.turma.idAvaliacao,
  				idAluno: this.dados.alunos[i].id,
  				nota: this.dados.alunos[i].nota 
  			};
  			dados.push(aux);
  		}
  	}

  	// if(nFrequentes == this.dados.alunos.length){
  		let nAdd:number = 0;

  		for (var i = 0; i < dados.length; i++) {
  			this.cub3Db.add("MOV_REGISTRO_AVALIACAO", dados[i]);
  			nAdd++;
  		}
  		if(nAdd == dados.length){
	  		carregar.dismiss();
	  		this.cub3Svc.alerta("Registro de lançamento", "Registro inserido com sucesso!");
	  		this.location.back();
  		}
  	// }
  	// else {
  	// 	carregar.dismiss();
  	// 	this.cub3Svc.alerta("lançamento incompleto", "Por favor, verifique se ocorreu o lançamento de nota/conceito para todos os alunos da turma.");
  	// }

  }
}
