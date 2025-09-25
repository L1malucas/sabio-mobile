import { Component, OnInit } from '@angular/core';
import {StorageUtils} from '@cub3/utils/storage.utils';

import {Router, ActivatedRoute} from "@angular/router";
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import {Location} from "@angular/common";
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-academico-turma-nota-aluno',
  templateUrl: './academico-turma-nota-aluno.page.html',
  styleUrls: ['./academico-turma-nota-aluno.page.scss'],
})
export class AcademicoTurmaNotaAlunoPage implements OnInit {

	turmaAtiva:any = {
		NME_TURMA: ''
	};
	data:any = {
		MOB_DISCIPLINAS: [],
		MOB_AVALIACOES: []
	};
	dados:any = {}; 
	carregando:boolean = true; 
	aluno:any = {};
	nota:any = {};

	  jsonData:any = {
	    notas1: [],
	    notas2: [],
	    faltas: []
	  };

  constructor(
  	private route:ActivatedRoute,
  	private router:Router,
  	private location:Location,
    private navCtrl:NavController,
  	private selector:WheelSelector,
  	private cub3Svc:Cub3SvcProvider,
  	private cub3Db:Cub3DbProvider
  	) { 

  }


  ngOnInit() {
    this.route.url.subscribe(() => {   
    	if(this.route.snapshot.params.aluno && this.route.snapshot.params.aluno != 'undefined' ) {

	    	this.aluno = JSON.parse(atob(this.route.snapshot.params.aluno));
	    	this.init();
	    }
	    else {
    		this.location.back();
	    }
    });
  }
  init() {
    this.data = StorageUtils.getItem("data");
	  if(this.aluno != null)
		   this.nota = this.aluno.NOTA.NOTA;

    console.log("Aluno", this.aluno);
    this.getDisciplinas();
    this.popularFaltas();
    this.popularNotas();
  }
  popularNotas() {
    for (var i = 0; i <= 10; i++) {
        this.jsonData.notas1.push({'description':i+"" })
    }
      for (var j = 0; j <= 9; j++) {
        this.jsonData.notas2.push({'description':"."+j+"" })
      }
  }
  popularFaltas() {
    for (var i = 0; i <= 30; i++) {
      this.jsonData.faltas.push({'description': i+""});
    }
  }
 selecionarFaltas() {
  try {
   this.selector.show({
     title: "Qual o número de faltas?",
     items: [
       this.jsonData.faltas
     ],
     positiveButtonText: "Selecionar",
     negativeButtonText: "Cancelar",
   }).then(
     result => {
       console.log(result[0].description + ' at index: ' + result[0].index);
       this.aluno.NOTA.FALTAS = result[0].description;
     },
     err => console.log('Error: ', err)
     );
    }
    catch (e){ 
      console.log((<Error>e).message); 
    }
 }
 selecionarNotas() {
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
       this.aluno.NOTA.NOTA = result[0].description+""+result[1].description;
       },
       err => console.log('Error: ', err)
       );
    }
    catch (e){ 
      console.log((<Error>e).message); 
    }
 }

 async getDisciplinas() {
	let turmas = await this.cub3Svc.getTurmas();
  const turma = turmas.find(turma => turma.IDF_TURMA == this.aluno.IDF_TURMA);
	let disciplinas = turma.NME_DISCIPLINA; 
  
	let turmaAtiva = turmas.find(turma => turma.IDF_TURMA == this.aluno.IDF_TURMA);
  
	if (!turmaAtiva) return;  
  
	this.data.MOB_DISCIPLINAS = disciplinas || [];

  console.log("Disciplinas", turma);

  this.calcularRendimento();
  }
 calcularRendimento() {
  const params:any = new URLSearchParams({
    conceito: '0',
    idf_aluno: this.aluno.IDF_ALUNO,
    idf_turma: this.aluno.IDF_TURMA
  }).toString();

  this.cub3Svc.getNode(`educanet/aluno/avaliacoes/listarRendimento?${params}`).then((retorno:any) => {
    if(this.data['MOB_DISCIPLINAS'].length > 0 && retorno && retorno.dados) {
        const rendimento = retorno.dados;
        const disciplinas = this.data['MOB_DISCIPLINAS'];

        for(let dis of disciplinas)
          dis.rendimento = [];

        for(let rend of rendimento) {
          const idx = disciplinas.findIndex((x) => x.IDF_DISCIPLINA == rend.IDF_DISCIPLINA);

          if(idx > -1){ 
            if(disciplinas[idx].rendimento )
              disciplinas[idx].rendimento.push(rend); 
            else
              disciplinas[idx].rendimento = [rend]; 
          }
        }

        console.log("Disciplinas", [disciplinas, rendimento]);
      }
      // else
        // this.cub3Svc.alerta("Ops!", "Não foi possível obter a lista de avaliações do aluno. Por gentileza, tente novamente ou entre em contato com nosso suporte técnico.");
  }, (err) => {
    // this.cub3Svc.alerta("Ops!", "Não foi possível obter a lista de avaliações do aluno. Por gentileza, tente novamente ou entre em contato com nosso suporte técnico.");
  }); 
    }
 voltarRota() {
    this.navCtrl.back();
 }
 salvar() {
  let avaliacoes: any = this.data["MOB_AVALIACOES_ALUNOS"];
  console.log("Avaliações do aluno", avaliacoes);

  if (avaliacoes) {
    for (let item of avaliacoes) {
      if (item.IDF_AVALIACAO == this.aluno.NOTA.IDF_AVALIACAO && item.IDF_ALUNO == this.aluno.IDF_ALUNO) {
        item.FALTAS = this.aluno.NOTA.FALTAS;
        item.NOTA = this.aluno.NOTA.NOTA; 
        const idfAvaliacao = this.data['MOB_AVALIACOES'].find((x) => x.IDF_AVALIACAO == item.IDF_AVALIACAO);

        this.updateMediaRendimento(item.IDF_DISCIPLINA, item.NOTA, this.aluno.IDF_ALUNO, idfAvaliacao);
      }
    }
    StorageUtils.setItem('data', this.data);
  }

  this.cub3Svc.alertaToast("Atualização de nota", "Realizada com sucesso");
  // this.voltarRota();
} 
updateMediaRendimento(idfDisciplina: number, novaNota: any, idfAluno: number, idfAvaliacao:number) {
  let disciplinas = this.data['MOB_DISCIPLINAS'];
  const idx = disciplinas.findIndex((x) => x.IDF_DISCIPLINA == idfDisciplina);

  if (idx > -1) {
    let disciplina = disciplinas[idx];
    let rendimentos = disciplina.rendimento || [];
    let somaNotas = 0;
    let totalAvaliacoes = 0;

    console.log("Atualizando rendimento", disciplina.rendimento);

    // Update the specific rendimento with the new note
    rendimentos.forEach((rend) => {
      console.log("Aluno", [rend.IDF_ALUNO, idfAluno]);

      if (rend.IDF_ALUNO === idfAluno) {
        console.log("Avaliacao", [rend.IDF_AVALIACAO, idfAvaliacao])
        
        if (rend.IDF_AVALIACAO == idfAvaliacao) {
          rend.FALTAS = novaNota.FALTAS;
          rend.MEDIA_PERIODO = parseFloat(novaNota.NOTA);
        }
        somaNotas += rend.MEDIA_PERIODO;
        totalAvaliacoes++;
      }
    });

    // Calculate the new average
    let novaMediaRendimento = totalAvaliacoes > 0 ? somaNotas / totalAvaliacoes : 0;

    // Update the MEDIA_RENDIMENTO of the discipline
    disciplina.MEDIA_RENDIMENTO = novaMediaRendimento;
  }
  console.log("Disciplinas", disciplinas);
}
}
