import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Router, ActivatedRoute} from "@angular/router";
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import {Location} from "@angular/common";
import * as moment from "moment";
@Component({
  selector: 'app-academico-avaliacao-novo',
  templateUrl: './academico-avaliacao-novo.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./academico-avaliacao-novo.page.scss'],
})
export class AcademicoAvaliacaoNovoPage implements OnInit {

	turmaAtiva:any = {
		NME_TURMA: ''
	};
	dados:any = {
  		IDF_AULA: '',
      IDF_CONTEUDO: '',
  		DAT_AULA: '',
  		IDF_TURMA: '',
  		IDF_PROFISSIONAL: '',
  		NRO_AVALIACAO: '',
  		IDF_DISCIPLINA: '',
  		DES_ASSUNTO: '',
  		OBSERVACAO: '',
  		SIT_REGISTRO: '',
  		IDF_CONTEUDOS: []
	};

	tipoCadastro:any = 'INDIVIDUAL';
	diasSemana:any[] = [];

	turma:any;
	plAula:any[] = [];
	conteudos:any[] = [];
	data:any = {MOB_DISCIPLINAS: [], MOB_PLAULA: []};
	usuario:any = StorageUtils.getAccount();

	carregando:boolean = true;
	wizard:number = 1;
	mesesCal:any[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
	diasCal:any[] = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
    jsonData:any = {
	    duracao: [] 
    };


  constructor(

  	private cub3Svc:Cub3SvcProvider,
  	private location:Location,
  	private cd: ChangeDetectorRef,
  	private cub3Db:Cub3DbProvider,
  	private selector:WheelSelector,
  	private route:ActivatedRoute,
  	private router:Router
  	) { }

  ngOnInit() {

	    for (var i = 0; i <= 120; i++) {
	    	if(i % 10 == 0)
		    	this.jsonData.duracao.push({'description':i+" minutos" });
		}

	    this.route.url.subscribe(() => {  
	    	if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
		    	this.turmaAtiva.IDF_TURMA = this.route.snapshot.params.id;
		    	this.init();
		    }
		    else {
	    		// this.location.back();
		    }
	    });
  }
  async getPeriodos() {
    try {
        // Busca a disciplina específica pelo ID da disciplina.
        const disciplina = this.data.MOB_DISCIPLINAS.find(x => x.IDF_DISCIPLINA === this.dados.idDisciplina);

        // Certifica-se de que encontrou a disciplina.
        if (!disciplina) {
            console.error('Disciplina não encontrada.');
            return;
        }

        // Obtém os dados das escolas do armazenamento.
        const escolas = StorageUtils.getItem("escolas");
        console.log("Escolas", disciplina.DES_DISCIPLINA.trim());
        // Verifica se os dados das escolas estão corretos e existem.
        if (!escolas || !escolas.conteudo) {
            console.error('Dados de escolas não estão disponíveis ou mal formados.');
            return;
        }

        // Encontra o conteúdo que corresponde ao nome da disciplina, que é trimado para evitar problemas com espaços extras.
        const conteudoAchado = [escolas.conteudo.find(x => 
            x.DES_DISCIPLINA.trim() === disciplina.DES_DISCIPLINA.trim()
        )];
        console.log("Conteudo", conteudoAchado);

        // Verifica se encontrou o conteúdo correspondente.
        if (!conteudoAchado) {
            console.error('Conteúdo correspondente não encontrado.');
            return;
        }

        // Atribui o conteúdo encontrado para ser usado posteriormente no sistema.
        this.data.MOB_CONTEUDO = conteudoAchado;
        console.log("Disciplina encontrada: ", this.data.MOB_CONTEUDO);
    } catch (e) {
        console.error('Erro ao buscar períodos:', e);
    } finally {
        // Garante que as mudanças sejam verificadas independentemente do resultado.
        this.cd.markForCheck();
    }
}

  async iniciarTurma() {
	this.data = StorageUtils.getItem('data');


  	this.getDisciplinas();
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
  async getDisciplinas() {
	// if (!this.data || !this.data.MOB_TURMAS || !this.data.MOB_DISCIPLINAS || !this.data.MOB_PROF_DISCIPLINAS) {
	//   console.error('Data is not defined');
	//   return;
	// }
  
	let turmas = await this.cub3Svc.getTurmas();
	let turma = turmas.find(turma => turma.id == this.turmaAtiva.IDF_TURMA)
	this.turmaAtiva = turma; 
	
	console.log("Turma", turma);
	this.data.MOB_DISCIPLINAS = this.turmaAtiva.disciplinas;
	this.cd.markForCheck();
  }
  init(){ 
  	this.turma = this.turmaAtiva.IDF_TURMA;
	console.log("Iniciando turma", this.turmaAtiva);
  	// if(this.turma == null)
  	// 	this.location.back();
	this.tipoCadastro = 'I';

  	this.dados = {
  		IDF_AULA: Math.floor(Math.random() * 1000) + 1,
		DAT_AULA: new Date(),
		// IDF_HORARIO: '',
		IDF_TURMA: this.turma,
		IDF_DISCIPLINA: '',
		NRO_AVALIACAO: null,
		IDF_PROFISSIONAL: this.usuario.id,		
    	IDF_CONTEUDO: 'I',
		DES_ASSUNTO: '',
		OBSERVACAO: '',
		SIT_REGISTRO: 'PENDENTE',
		IDF_PLAULA: "",
		IDF_CONTEUDOS: []
	}; 
	this.iniciarTurma();
  }

// Função para gerar as datas das aulas entre dois períodos e dias selecionados
 gerarDatasEntre(dataInicial: string, dataFinal: string, diasSemana: string[]): string[] {
	const datas: string[] = [];
	let dataAtual = new Date(dataInicial);
	const dataLimite = new Date(dataFinal);
  
	while (dataAtual <= dataLimite) {
	  if (diasSemana.includes(this.DiaDaSemana(dataAtual))) {
		datas.push(this.formatarData(dataAtual));
	  }
	  dataAtual.setDate(dataAtual.getDate() + 1);
	}
  
	return datas;
  }
  
  // Função para obter o dia da semana em formato 'domingo', 'segunda', etc.
   DiaDaSemana(data: Date): string {
	const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
	return dias[data.getDay()];
  }
  
  // Função para formatar a data como uma string 'DD/MM/YYYY'
   formatarData(data: Date): string {
	return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  }
  async submit() {
	let camposObrigatorios = [];
 
		  	camposObrigatorios= [
	  	{id:'idDisciplina','label': 'Disciplina'}, 
	  	{id:'tipo', 'label': 'Tipo de avaliação'}, 
	  	{id:'titulo', 'label': 'Nome da avaliação'} 
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
 
		  	let dados:any = this.dados; 
 
		  	 
		  		let carregar:any = await this.cub3Svc.carregar(1);


			if (erros.length === 0) {
				try { 
								const dadosInsert:any = {
                  id:  Math.floor(Math.random() * 1000) + 1,
									idDisciplina: dados.idDisciplina,
                  idPeriodo: dados.idPeriodo,
									tipo: dados.tipo,
									titulo: dados.titulo
								};
											try{
						
											
													this.cub3Db.add("MOB_REGISTRO_AVALIACAO", dadosInsert).then(() => {
										carregar.dismiss();
											this.cub3Svc.sincronizar('MOB_REGISTRO_AVALIACAO').then(() => {
													this.cub3Svc.alerta("Registro de avaliação", "Registro enviado com sucesso!");
													this.location.back();
											}, () => {
													this.cub3Svc.alerta("Registro de avaliação", "Registro inserido com sucesso!");
													this.location.back();
											});
										}, (err) => {
										carregar.dismiss();
										this.cub3Svc.alerta("Ocorreu um problema", "Por favor, verifique os campos obrigatórios da avaliação.");
										console.log(err);
										});
											}
											catch {
													carregar.dismiss();	
											} 
			} catch (e) {
				carregar.dismiss();
				// Trate o erro conforme necessário
				console.error(e);
			}
			} 
  	}

  }
  async getPlaula() {
	this.plAula = [];
	if (!this.data || !this.data.MOB_PLAULA || !this.dados || typeof this.verificarTurma !== 'function') {
	  console.error('Data, dados or verificarTurma is not defined');
	  return;
	}
  
	let plaAulas = this.data.MOB_PLAULA;
  
	let result = plaAulas
	  .filter(plaAula => this.verificarTurma(plaAula.IDF_TURMA) && plaAula.IDF_DISCIPLINA == this.dados.IDF_DISCIPLINA);
  
	this.plAula = result;
  }
  async getConteudos() {
  	this.data.CONTEUDOS = [];

	const conteudos = await this.cub3Svc.getNode(`educanet/profissional/conteudoItens?idf_disciplina=${this.dados.IDF_DISCIPLINA}`);
	if(conteudos && conteudos.dados)
		this.conteudos = conteudos.dados;

	const PLAULA = this.conteudos;
  	if(PLAULA) {
  		console.log(PLAULA);
  		for(let item of PLAULA) {
  			if(this.verificarTurma(item.IDF_TURMA) && this.dados.IDF_PLAULA == item.IDF_PLAULA) {

  				this.dados.NRO_AVALIACAO = (item.NRO_AVALIACAO);

  				for(let cont of item.CONTEUDOS) {
	  					this.data.CONTEUDOS.push(cont);
	  			}
  			}
  		}
  	}

  } 
  async atualizarConteudos(evt:any = null) {
  	let aux:any[] = [];
  	this.dados.CONTEUDOS = [];


  	for(let item of this.dados.IDF_CONTEUDOS) {
  		for(let i2 of this.data.CONTEUDOS) {
  			if(i2.IDF_CONTEUDO == item)
  				this.dados.CONTEUDOS.push(i2);
  		}
  	}
  }


  verificarTurma(turmas:any) {
	try {
  	const auxTurmas = turmas.split(",");
  	let flag:boolean = false;

  	for(let item of auxTurmas) {
  		if(item == this.turmaAtiva.IDF_TURMA)
  			flag = true;
  	}

	

  	return flag;
}
catch(e) {
	return false;
}
  }
  selecionarData(evt:any) {
  	this.dados.DAT_AULA = moment(evt);
  	this.wizard = 2;
  }
  selecionarDisciplina(idDisciplina) {
  	this.dados.IDF_DISCIPLINA = idDisciplina;
  	this.getPlaula();
  	this.wizard = 3;
  }
  selecionarPlanoAula(idPlaula, NRO_AVALIACAO:number = null) {
  	if(idPlaula){
  		this.dados.IDF_PLAULA = idPlaula;
  		this.dados.NRO_AVALIACAO = (NRO_AVALIACAO);
  		console.log(this.dados);
	  	this.getConteudos();
	  	this.wizard = 4;
  	}
  	else {
  		this.wizard = 5;
  	}

  }
  voltar() {
  	this.wizard = this.wizard > 1 ? this.wizard-1 : 1;
  }
 selecionarDuracao(item:any) {
  try {
     this.selector.show({
       title: "Duração de apresentação do conteúdo:",
       items: [
         this.jsonData.duracao
       ],
       positiveButtonText: "Selecionar",
       negativeButtonText: "Cancelar",
     }).then(
       result => {
       	let auxSel = result[0].description;

       		item.DURACAO = auxSel.split(" ")[0];
       		// this.selecionarConteudo(item);
       },
       err => console.log('Error: ', err)
       );
    }
    catch (e){ 
      console.log((<Error>e).message); 
    }
 }
 selecionarConteudo(item:any) {
 	if(!this.verificarConteudo(item)) {
 		this.dados.IDF_CONTEUDOS.push(item);
 	}
 	else {
	 	for(let aux of this.dados.IDF_CONTEUDOS) {
	 		if(item.IDF_CONTEUDO == aux.IDF_CONTEUDO) {
	 			this.dados.IDF_CONTEUDOS.splice(this.dados.IDF_CONTEUDOS.indexOf(aux), 1);
	 		}
	 	} 	 	
 	}
 }
 verificarConteudo(item:any) {
 	let flag:boolean = false;

 	for(let aux of this.dados.IDF_CONTEUDOS) {
 		if(item.IDF_CONTEUDO == aux.IDF_CONTEUDO) {
 			flag = true;
 		}
 	} 	 	
 	return flag;
 }
 avancar() {
 	switch (this.wizard) {
 		case 4:
 				this.wizard = 5;
 			break; 		
 		case 5:
 			this.submit();
 			break;
 	}
 }
}
