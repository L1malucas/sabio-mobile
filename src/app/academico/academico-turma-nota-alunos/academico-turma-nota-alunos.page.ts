import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {StorageUtils} from '@cub3/utils/storage.utils';

import {Router, ActivatedRoute} from "@angular/router";
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {Location} from "@angular/common";
 
interface Nota {
	id: number;
	valor: string | number;
  }

  
@Component({
  selector: 'app-academico-turma-nota-alunos',
  templateUrl: './academico-turma-nota-alunos.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./academico-turma-nota-alunos.page.scss'],
})
export class AcademicoTurmaNotaAlunosPage implements OnInit {

	turmaAtiva:any = {
		NME_TURMA: ''
	};
	data:any = {
		MOB_DISCIPLINAS: [],
		MOB_AVALIACOES: []
	};
	dados:any = {}; 
	busca:string = "";
	carregando:boolean = true; 
	alunosDisponiveis:any[] = [];
	exibirFiltro:boolean = true;
	idAvaliacao:any = null;
	numNotas: number = 4; 

  constructor(
  	private route:ActivatedRoute,
  	private router:Router,
  	private location:Location,
  	private cd: ChangeDetectorRef,
  	public cub3Svc:Cub3SvcProvider,
  	private cub3Db:Cub3DbProvider
  	) { 

  }


  ngOnInit() {
    this.route.url.subscribe(() => {  
    	if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
	    	this.turmaAtiva.IDF_TURMA = this.route.snapshot.params.id;
	    	this.idAvaliacao = this.route.snapshot.params.idAvaliacao;
			console.log("Params", this.route.snapshot.params);
	    	this.init();
	    }
	    else {
    		this.location.back();
	    }
    });
  }
  ionViewWillEnter() {
	this.data = StorageUtils.getItem("data");
  	if(this.dados.disciplina && this.dados.avaliacao)
  		this.atualizarAlunos();
  }
  async init() { 
	let turmas = await this.cub3Svc.getTurmas();
	this.turmaAtiva = turmas.find((x) => x.id == this.turmaAtiva.IDF_TURMA);

	console.log("Iniciando turma", this.turmaAtiva);
	this.cd.markForCheck();
	this.iniciarTurma(); 
  }

  async iniciarTurma() {
  	this.getDisciplinas();
  }

  async getDisciplinas() { 
	this.data.MOB_DISCIPLINAS = [];
  
	try {  
		this.data.MOB_DISCIPLINAS = this.turmaAtiva.disciplinas; 
	}
	catch(e) {

	} 

	this.cd.markForCheck();
  }
  async syncAvaliacoes() {
  	// this.cub3Svc.sincronizar("GERAL").then(() => {
		this.getAlunos();
  		this.getAvaliacoes();
  	// }, () => {
  		// this.getAvaliacoes();
  	// });
  }
  async getAvaliacoes() {
  return this.turmaAtiva.avaliacoes;
  }
  atualizarAlunos() {
	  	let avaliacoesAlunos:any = this.data["MOB_AVALIACOES_ALUNOS"] || [];

	  	for(let item of avaliacoesAlunos) {
	  		for(let aluno of this.dados.alunos) {
	  			if((aluno.NOTA.IDF_AVALIACAO == item.IDF_AVALIACAO) && aluno.IDF_ALUNO == item.IDF_ALUNO){
	  				aluno.NOTA.FALTAS = item.FALTAS;
	  				aluno.NOTA.NOTA = item.NOTA;	  				
	  			}
	  		}
	  	}

  }

  calcularMediaNotas(notasArray: Nota[]): number {
	const notasValidas = notasArray
	  .map((nota: Nota) => {
		const valorNumerico = parseFloat(nota.valor as string);
		return !isNaN(valorNumerico) ? valorNumerico : null;
	  })
	  .filter((valor): valor is number => valor !== null);
	const total = notasValidas.reduce((acc, valor) => acc + valor, 0);
	return notasValidas.length > 0 ? total / notasValidas.length : 0;
  }
  

  async atualizarNotaAluno(aluno: any, notaIndex: number, evt: any) {
	console.log(`Atualizando nota ${notaIndex} do aluno ${aluno.id}`);
	try {
	  let registrosNotas = await this.cub3Db.getStorage('MOV_REGISTRO_NOTA') || [];
  
	  let registroNotaExistente = registrosNotas.find(registro =>
		registro.IDF_ALUNO === aluno.id && parseInt(registro.IDF_AVALIACAO) === parseInt(this.idAvaliacao)
	  );
  
	  const valor = evt.detail.value;
	  aluno.avaliacao.NOTAS[notaIndex].valor = valor ? parseFloat(valor) : '';
  
	  if (registroNotaExistente) {
		registroNotaExistente.NOTAS = this.adjustNotasArraySize(registroNotaExistente.NOTAS || []);
		registroNotaExistente.NOTAS[notaIndex].valor = aluno.avaliacao.NOTAS[notaIndex].valor;
		registroNotaExistente.media = this.calcularMediaNotas(registroNotaExistente.NOTAS);
	  } else {
		let novaNotaArray = this.adjustNotasArraySize([]);
		novaNotaArray[notaIndex].valor = aluno.avaliacao.NOTAS[notaIndex].valor;
  
		const novoRegistroNota = {
		  IDF_ALUNO: aluno.id,
		  IDF_TURMA: this.turmaAtiva.id,
		  IDF_AVALIACAO: this.idAvaliacao,
		  NOTAS: novaNotaArray,
		  media: this.calcularMediaNotas(novaNotaArray)
		};
		registrosNotas.push(novoRegistroNota);
	  }
  
	  aluno.avaliacao.media = this.calcularMediaNotas(aluno.avaliacao.NOTAS);
  
	  await this.cub3Db.setStorage('MOV_REGISTRO_NOTA', registrosNotas);
  
	  console.log(`Nota ${notaIndex} atualizada no banco para o aluno ${aluno.id}`);
	  this.cub3Svc.alertaToast('Nota atualizada', 'Nota atualizada com sucesso!');
	} catch (e) {
	  console.error('Erro ao atualizar a nota no banco', e);
	  this.cub3Svc.alertaToast('Ops!', 'Erro ao atualizar a nota. Por favor, tente novamente.');
	}
  }
  
  
async getAlunos() {
  this.carregando = true;
  this.exibirFiltro = false;

  let nroAvaliacaoAtivo: any = this.idAvaliacao;
  let turmasAlunos = this.turmaAtiva.alunos;

  // Recupera os registros de notas armazenados em MOV_REGISTRO_NOTA
  const registrosNotas = await this.cub3Db.getStorage('MOV_REGISTRO_NOTA') || [];

  // Percorre a lista de alunos
  
  this.dados.alunos = turmasAlunos.map(aluno => {
	if (!aluno.avaliacoes) {
	  aluno.avaliacoes = [];
	}

	let avaliacaoExistente = aluno.avaliacoes.find(avaliacao => parseInt(avaliacao.IDF_AVALIACAO) === parseInt(nroAvaliacaoAtivo));

	if (!avaliacaoExistente) {
	  aluno.avaliacao = {
		IDF_ALUNO: aluno.id,
		NOTAS: [],
		IDF_AVALIACAO: nroAvaliacaoAtivo,
		media: 0
	  };
	  for (let i = 0; i < this.numNotas; i++) {
		aluno.avaliacao.NOTAS.push({ id: i, valor: '' });
	  }
	  aluno.avaliacoes.push(aluno.avaliacao);
	} else {
	  aluno.avaliacao = avaliacaoExistente;
	  if (!aluno.avaliacao.NOTAS || !Array.isArray(aluno.avaliacao.NOTAS)) {
		aluno.avaliacao.NOTAS = [];
		for (let i = 0; i < this.numNotas; i++) {
		  aluno.avaliacao.NOTAS.push({ id: i, valor: '' });
		}
	  } else {
		aluno.avaliacao.NOTAS = this.adjustNotasArraySize(aluno.avaliacao.NOTAS);
	  }
	}

	try {
	  const registroNota = registrosNotas.find(registro =>
		parseInt(registro.IDF_ALUNO) === parseInt(aluno.id) &&
		parseInt(registro.IDF_AVALIACAO) === parseInt(nroAvaliacaoAtivo) &&
		registro.NOTAS && Array.isArray(registro.NOTAS)
	  );

	  if (registroNota) {
		aluno.avaliacao.NOTAS = [...registroNota.NOTAS];
		aluno.avaliacao.NOTAS = this.adjustNotasArraySize(aluno.avaliacao.NOTAS);
		aluno.avaliacao.media = registroNota.media || 0;
	  }
	} catch (e) {
	  console.error('Erro ao recuperar as notas do armazenamento', e);
	}

	return aluno;
  });

  console.log('Alunos com avaliações atualizadas', this.dados.alunos);
  setTimeout(() => {
	this.carregando = false;
	this.cd.markForCheck();

  }, 100)
}

// Nova função para ajustar o tamanho do array de notas
adjustNotasArraySize(notasArray: any): Nota[] {
	notasArray = notasArray.flat(); // Flatten any nested arrays
  
	// Map over the array to ensure each element is an object with 'id' and 'valor'
	notasArray = notasArray.map((nota, index) => {
	  if (typeof nota === 'object' && nota !== null && 'valor' in nota) { 
		return { id: nota.id ?? index, valor: nota.valor };
	  } else { 
		return { id: index, valor: nota };
	  }
	});
  
	if (notasArray.length < this.numNotas) {
	  return [
		...notasArray,
		...Array.from({ length: this.numNotas - notasArray.length }, (_, i) => ({ id: notasArray.length + i, valor: '' }))
	  ];
	} else if (notasArray.length > this.numNotas) {
	  return notasArray.slice(0, this.numNotas);
	} else {
	  return notasArray;
	}
  }
  
  getTituloAvaliacao() {
	try {
		return this.turmaAtiva.avaliacoes.find((x) => parseInt(x.IDF_AVALIACAO) == this.idAvaliacao || parseInt(x.NRO_AVALIACAO) == this.idAvaliacao).DES_AVALIACAO;
	}
	catch(e) {
		return '';
	}
  }
  
  filtrar(itens:any[], termo:string = "") {
      return itens.filter(item => {
        return (item.id == termo) || (item.nome.toLowerCase().indexOf(termo.toLowerCase()) > -1);
      });
  }
  ListarAlunos() {
    if(this.busca != '')
      return this.filtrar(this.dados.alunos, this.busca);
    else
      return this.dados.alunos;
  } 
	abrirNotaModal(aluno:any, idx:number){
		let aux:any = btoa(JSON.stringify( Object.assign({}, aluno)));
		console.log(aux);
		this.router.navigate(["/app/academico/academico-turma-nota-aluno/"+aux]);
	}
}
