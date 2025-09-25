/**
 * @file academico-aula-novo.page.ts
 * @description Componente para criação de uma nova aula, incluindo seleção de disciplinas, conteúdos, e duração.
 * @autor Gustavo Aguiar - gustavo@cub3.com.br
 */

import { 
	ChangeDetectionStrategy, 
	ChangeDetectorRef, 
	Component, 
	OnInit, 
	ViewChild, 
	OnDestroy 
  } from '@angular/core';
  import { ActivatedRoute, Router } from "@angular/router";
  import { Location } from "@angular/common";
  import { IonSlides, NavController, AlertController } from '@ionic/angular';
  
  // Provedores de Serviços
  import { Cub3DbProvider } from '@cub3/cub3-db/cub3-db';
  import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
  
  // Utilitários
  import { StorageUtils } from '@cub3/utils/storage.utils';
  
  // Plugins do Ionic
  import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
  
  // Bibliotecas Externas
  import * as moment from "moment";
  
  // Tipos e Constantes
  type CampoDeExperiencia = {
	id: number;
	titulo: string;
	descricao: string;
	exemplo: string;
  };
  
  const camposDeExperiencia: CampoDeExperiencia[] = [];
  
  @Component({
	selector: 'app-academico-aula-novo',
	templateUrl: './academico-aula-novo.page.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./academico-aula-novo.page.scss'],
  })
  export class AcademicoAulaNovoPage implements OnInit, OnDestroy {
	
	// Referência aos Slides do Ionic
	@ViewChild(IonSlides) slides: IonSlides;
  
	// Dados da Turma e Aula
	turmaAtiva: any = { NME_TURMA: '' };
	dados: any = {
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
	turma: any;
	data: any = { MOB_DISCIPLINAS: [], MOB_PLAULA: [], MOB_CONTEUDO: [] };
	usuario: any;
  
	// Indicadores de Carregamento e Estado
	carregando: boolean = true;
	carregandoConteudos: boolean = false;
	wizard: number = 1;
	activeSlideIndex: number = 0;
  
	// Dados de Conteúdos e Seleções
	conteudos: any[] = [];
	conteudoSelecionado: any;
	listaParcial: any[] = [];
	totalItens: number = 0;
	quantidadePorPagina: number = 10;
	busca: string = '';
  
	// Dados de Configuração
	mesesCal: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
	diasCal: string[] = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
	diasSemana: string[] = [];
	jsonData: any = { duracao: [] };
  
	// Outros Dados
	camposExperiencia: CampoDeExperiencia[] = camposDeExperiencia;
	tipoCadastro: string = 'INDIVIDUAL';
	turmaInfantil: boolean = false;
	plAula: any[] = [];
	  etapa: number = 1;
  
	/**
	 * Construtor para injeção de dependências.
	 * @param cub3Svc Serviço customizado Cub3
	 * @param location Serviço de localização
	 * @param cd Referência para detecção de mudanças
	 * @param navCtrl Controlador de Navegação
	 * @param alertController Controlador de Alertas
	 * @param cub3Db Provedor de Banco de Dados Cub3
	 * @param selector Plugin WheelSelector para seleção de duração
	 * @param route Rota ativa
	 * @param router Roteador para navegação
	 */
	constructor(
	  public cub3Svc: Cub3SvcProvider,
	  private location: Location,
	  private cd: ChangeDetectorRef,
	  private navCtrl: NavController,
	  private alertController: AlertController,
	  private cub3Db: Cub3DbProvider,
	  private selector: WheelSelector,
	  private route: ActivatedRoute,
	  private router: Router
	) { }
  
	/**
	 * Ciclo de vida: Executado quando o componente é inicializado.
	 */
	ngOnInit(): void {
	  // Inicializa dados de duração para seleção
	  for (let i = 0; i <= 120; i++) {
		if (i % 10 === 0) {
		  this.jsonData.duracao.push({ 'description': `${i} minutos` });
		}
	  }
  
	  // Observa mudanças na URL da rota
	  this.route.url.subscribe(() => {  
		const turmaId = this.route.snapshot.params.id;
		if (turmaId && turmaId !== 'undefined') {
		  this.turmaAtiva.IDF_TURMA = turmaId;
		  this.init();
		} else {
		  // Caso o ID da turma não seja válido, navega de volta
		  // this.location.back(); // Descomente se necessário
		}
	  });
	}
  
	/**
	 * Ciclo de vida: Executado quando o componente é destruído.
	 */
	ngOnDestroy(): void {
	  // Remove listener de scroll se houver
	  window.removeEventListener('scroll', this.handleScroll);
	}
  
	/**
	 * Handler para evento de scroll, garantindo que os slides permaneçam visíveis.
	 */
	handleScroll = (): void => {
	  const slider = document.querySelector('ion-slides');
	  if (slider) {
		slider.scrollIntoView({ behavior: 'smooth' });
	  }
	};
  
	/**
	 * Handler para mudança de slide, atualizando o índice ativo.
	 * @param event Evento de mudança de slide
	 */
	onSlideDidChange(event: any): void {
	  this.slides.getActiveIndex().then(index => {
		this.activeSlideIndex = index;
		this.cd.markForCheck();
	  });
	}
  
	/**
	 * Inicializa dados do usuário e outros parâmetros.
	 */
	async init(): Promise<void> { 
	  this.usuario = StorageUtils.getAccount();
	  this.turma = this.turmaAtiva.IDF_TURMA || this.turmaAtiva.id;
	  console.log("Iniciando turma", this.turmaAtiva);
	  this.tipoCadastro = 'I'; // 'I' para individual, 'P' para planejado
  
	  // Inicializa os dados da aula
	  this.dados = {
		IDF_AULA: Math.floor(Math.random() * 1000) + 1,
		DAT_AULA: new Date(),
		IDF_TURMA: this.turmaAtiva.IDF_TURMA,
		DES_TURMA: this.turmaAtiva.DES_TURMA,
		IDF_DISCIPLINA: '',
		DES_DISCIPLINA: '',
		NRO_AVALIACAO: null,
		IDF_PROFISSIONAL: this.usuario.id,		
		IDF_CONTEUDO: 'I',
		DES_ASSUNTO: '',
		OBSERVACAO: '',
		SIT_REGISTRO: 'PENDENTE',
		IDF_PLAULA: "",
		IDF_CONTEUDOS: []
	  };
  
	  // Define a data da aula com base no armazenamento local, se disponível
	  const diaAtualStorage = StorageUtils.getItem("diaAtual");
	  if (diaAtualStorage) {
		this.dados.DAT_AULA = new Date(diaAtualStorage['date']);
	  }
  
	  // Inicia a turma ativa
	  this.iniciarTurma();
	}
  
	/**
	 * Inicializa a turma ativa carregando seus dados.
	 */
	async iniciarTurma(): Promise<void> {
	  this.data = StorageUtils.getItem('data');
	  await this.getDisciplinas();
	}
  
	/**
	 * Obtém as disciplinas relacionadas à turma ativa.
	 */
	async getDisciplinas(): Promise<void> {
	  this.data.MOB_DISCIPLINAS = [];
  
	  try {
		const turmas = await this.cub3Svc.getTurmas();
		const turma = turmas.find(turma => parseInt(turma.id) === parseInt(this.turmaAtiva.IDF_TURMA));
		this.turmaAtiva = turma; 
		
		console.log("Turma", turma);
		this.data.MOB_DISCIPLINAS = turma?.disciplinas || [];
  
		// Verifica se a turma é infantil
		if (this.turmaAtiva.etapa && this.turmaAtiva.etapa.descricao) {
		  if (this.turmaAtiva.etapa.descricao.toUpperCase().includes("INFANTIL")) {
			this.turmaInfantil = true;
		  }
		  console.log('Turma infantil', this.turmaInfantil);
		}
	  } catch (error) {
		console.error("Erro ao obter disciplinas:", error);
	  }
  
	  // Avança automaticamente se não houver disciplinas
	  if (this.data.MOB_DISCIPLINAS.length === 0) {
		this.avancar();
	  }
  
	  this.cd.markForCheck();
	}
  
	/**
	 * Filtra conteúdos com base no termo de busca.
	 * @param itens Array de conteúdos a serem filtrados
	 * @param termo Termo de busca
	 * @returns Array filtrado de conteúdos
	 */
	filtrar(itens: any[], termo: string = ""): any[] {
	  return itens.filter(item => {
		return item.DES_CONTEUDO.toLowerCase().includes(termo.toLowerCase());
	  });
	}
  
	/**
	 * Lista conteúdos filtrados ou todos se não houver busca.
	 * @returns Array de conteúdos
	 */
	ListarConteudo(): any[] {
	  return this.busca !== '' ? this.filtrar(this.conteudos, this.busca) : this.conteudos;
	}
  
	/**
	 * Obtém conteúdos baseados na avaliação e disciplina selecionadas.
	 * @param evt Evento opcional
	 * @param avancar Flag para avançar automaticamente após carregar
	 */
	async getConteudos(evt?: any, avancar: boolean = true): Promise<void> {
	  console.log("Buscando conteúdo", evt);
	  this.conteudos = [];
	  
	  try {
		const turmas = await this.cub3Svc.getTurmas();
		const turma = turmas.find(turma => parseInt(turma.id) === parseInt(this.dados.IDF_TURMA));
		const avaliacao = turma.etapa?.avaliacoes.find(a => a.NRO_AVALIACAO === this.dados.NRO_AVALIACAO);
		const seqAvaliacao: number = avaliacao.SEQ_AVALIACAO;
		this.carregandoConteudos = true;
		this.cd.markForCheck();
		console.log("Turma", turma);
		
		const disciplina = turma.disciplinas.find(d => d.IDF_DISCIPLINA === this.dados.IDF_DISCIPLINA);
		if (!disciplina) {
		  console.error("Disciplina não encontrada.");
		  this.carregandoConteudos = false;
		  this.cd.markForCheck();
		  return;
		}
  
		// Obtém conteúdos da API
		const conteudos = await this.cub3Svc.getNode(`educanet/profissional/conteudoMobile?seq_avaliacao=${seqAvaliacao}&idf_disciplina=${disciplina.IDF_INEP}&idf_etapa=${turma.etapa?.idfInep}`);
		
		console.log('Verificando conteúdos da aula', this.dados.IDF_CONTEUDOS);
		if (conteudos.dados && conteudos.dados.length > 0) {
		  for (const conteudo of conteudos.dados) { 
			if (Array.isArray(this.dados.IDF_CONTEUDOS)) {
			  const conteudoAdicionado = this.dados.IDF_CONTEUDOS.find((item: any) => item.IDF_CONTEUDO === conteudo.IDF_CONTEUDO);
			  if (conteudoAdicionado) {
				conteudoAdicionado.selecionado = true;
				// Atualiza a duração e a seleção baseada na presença do conteúdo
				conteudo.DURACAO = conteudoAdicionado.DURACAO;
				conteudo.selecionado = true;
			  }
			}
  
			// Evita adicionar conteúdos duplicados
			if (!this.conteudos.some(c => c.IDF_CONTEUDO === conteudo.IDF_CONTEUDO)) {
			  this.conteudos.push(conteudo);
			} 
		  } 
		  this.cd.markForCheck();
		} else {
		  // Conteúdo não aplicável ou inexistente para a turma/disciplina selecionada
		  // this.conteudos = [{
		  //   IDF_CONTEUDO: -1,
		  //   DES_CONTEUDO: `Conteúdo programático não aplicável para o componente e período selecionados.`
		  // }];
		}
	  } catch (error) {
		console.error("Erro ao carregar conteúdos:", error);
	  } finally {
		this.carregandoConteudos = false;
		this.totalItens = this.ListarConteudo().length;
		this.carregarMaisConteudo();
		if (avancar) {
		  this.avancar();
		}
		if (this.cd) {
		  this.cd.markForCheck();
		}
	  }
	}
  
	/**
	 * Obtém e carrega mais conteúdos para paginação infinita.
	 * @param event Evento opcional de carregamento
	 */
	carregarMaisConteudo(event?: any): void {
	  const inicio = this.listaParcial.length;
	  const fim = inicio + this.quantidadePorPagina;
	  const novosItens = this.ListarConteudo().slice(inicio, fim);
	  this.listaParcial = [...this.listaParcial, ...novosItens];
  
	  if (event) {
		event.target.complete();
		if (this.listaParcial.length >= this.totalItens) {
		  event.target.disabled = true;
		}
	  }
	}
  
	/**
	 * Handler para evento de carregamento de dados (infinito scroll).
	 * @param event Evento de carregamento
	 */
	loadData(event: any): void {
	  this.carregarMaisConteudo(event);
	}
  
	/**
	 * Seleciona a data da aula.
	 * @param evt Evento de seleção de data
	 */
	selecionarData(evt: any): void {
	  this.dados.DAT_AULA = moment.utc(evt);
	  this.wizard = 2;
	}
  
	/**
	 * Seleciona a disciplina da aula.
	 * @param disciplina Objeto da disciplina selecionada
	 */
	async selecionarDisciplina(disciplina: any): Promise<void> {
	  console.log("Selecionando disciplina", disciplina);
	  this.dados.DES_DISCIPLINA = disciplina.value.DES_DISCIPLINA;
	  this.dados.IDF_DISCIPLINA = disciplina.value.IDF_DISCIPLINA; 
	  // await this.getConteudos(); // Método comentado, remover se não for necessário
	  this.avancar();
	}
  
	/**
	 * Seleciona o campo de experiência.
	 * @param idCampo ID do campo de experiência selecionado
	 */
	async selecionarCampoExperiencia(idCampo: number): Promise<void> {
	  this.dados.IDF_CAMPO_EXPERIENCIA = idCampo;
	  await this.getConteudos();
	  this.avancar();
	}
  
	/**
	 * Seleciona o plano de aula e a avaliação correspondente.
	 * @param idPlaula ID do plano de aula selecionado
	 * @param NRO_AVALIACAO Número da avaliação
	 */
	selecionarPlanoAula(idPlaula: number, NRO_AVALIACAO: number = null): void {
	  if (idPlaula) {
		this.dados.IDF_PLAULA = idPlaula;
		this.dados.NRO_AVALIACAO = NRO_AVALIACAO;
		console.log(this.dados);
		this.getConteudos();
		this.wizard = 4;
	  } else {
		this.wizard = 5;
	  }
	}
  
	/**
	 * Volta um passo no wizard.
	 */
	voltar(): void {
	  this.wizard = this.wizard > 1 ? this.wizard - 1 : 1;
	}
  
	/**
	 * Seleciona a duração de um conteúdo utilizando o WheelSelector.
	 * @param item Objeto do conteúdo
	 */
	selecionarDuracao(item: any): void {
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
			const auxSel = result[0].description;
			item.DURACAO = parseInt(auxSel.split(" ")[0]);
			// this.selecionarConteudo(item); // Método comentado, remover se não for necessário
		  },
		  err => console.log('Error: ', err)
		);
	  } catch (error) { 
		console.log((<Error>error).message); 
	  }
	}
  
	/**
	 * Avança para o próximo passo no wizard ou submete os dados se estiver no último passo.
	 */
	avancar(): void { 
	  this.slides.length().then(length => {
		this.slides.getActiveIndex().then(index => {
		  console.log(index);
		  console.log('currentIndex:', [index]);
		  this.slides.slideNext().then(() => { 
			window.scrollTo({ top: 0, behavior: 'smooth' });
		  });
		
		  this.etapa = index + 1;
		
		  // Verifica se está no último slide do slides
		  if (this.etapa === length) {
			// Se estiver no último slide, chama a função submit.
			this.submit();
		  }
		
		  this.cd.markForCheck();
		});
	  });
	}
  
	/**
	 * Seleciona ou desmarca um conteúdo na lista de conteúdos da aula.
	 * @param item Objeto do conteúdo
	 */
	selecionarConteudo(item: any): void {
	  if (!this.verificarConteudo(item)) {
		this.dados.IDF_CONTEUDOS.push(item);
	  } else {
		this.dados.IDF_CONTEUDOS = this.dados.IDF_CONTEUDOS.filter((aux: any) => aux.IDF_CONTEUDO !== item.IDF_CONTEUDO);
	  }
	}
  
	/**
	 * Verifica se um conteúdo já está selecionado.
	 * @param item Objeto do conteúdo
	 * @returns Booleano indicando se o conteúdo está selecionado
	 */
	verificarConteudo(item: any): boolean {
	  return this.dados.IDF_CONTEUDOS.some((aux: any) => aux.IDF_CONTEUDO === item.IDF_CONTEUDO);
	}
  
	/**
	 * Submete os dados da aula para armazenamento e sincronização.
	 */
	async submit(): Promise<void> {
	  let camposObrigatorios: any[] = [];
  
	  if (this.tipoCadastro === 'I') { // Individual
		camposObrigatorios = [
		  { id: 'DAT_AULA', label: 'Data da aula' }, 
		  { id: 'HOR_INICIO', label: 'Hora de início' }, 
		  { id: 'HOR_TERMINO', label: 'Hora de término' }, 
		  { id: 'DES_ASSUNTO', label: 'Conteúdo' }
		];
  
		if (this.data.MOB_DISCIPLINAS.length > 0) {
		  camposObrigatorios.push({ id: 'IDF_DISCIPLINA', label: 'Disciplina' });
		}
	  } else if (this.tipoCadastro === 'P') { // Planejado
		camposObrigatorios = [
		  // {id:'DAT_AULA_INICIAL','label': 'Data inicial'}, 
		  // {id:'DAT_AULA_FINAL','label': 'Data Final'}, 
		  // {id:'IDF_DISCIPLINA', 'label': 'Disciplina'}, 
		  // {id:'DES_ASSUNTO', 'label': 'Assunto'} 
		];
	  }
  
	  let erros: any[] = [];
  
	  // Verifica se os campos obrigatórios estão preenchidos
	  for (const item of camposObrigatorios) {
		if (!this.dados[item.id] || this.dados[item.id] === '') {
		  erros.push(item.label);
		}
	  }
  
	  if (erros.length > 0) {
		const aux: string = erros.join(", ");
		this.cub3Svc.alerta("Ops!", `Campo(s) obrigatório(s): <b>${aux}</b>`);
		return;
	  } else {
		const dados: any = { ...this.dados };
		delete dados.CONTEUDOS;
  
		dados.NRO_AVALIACAO = parseInt(dados.NRO_AVALIACAO);
  
		if (dados.DAT_AULA != null && dados.DES_ASSUNTO !== '') {
		  let carregar: any = await this.cub3Svc.carregar(1);
  
		  try {
			if (this.tipoCadastro === 'I') { // Individual
			  if (Array.isArray(dados.IDF_CONTEUDOS)) { 
				// Remove conteúdos não selecionados
				dados.IDF_CONTEUDOS = dados.IDF_CONTEUDOS.filter(item => item.selecionado !== false);
			  }
  
			  const dadosInsert: any = {
				IDF_AULA: dados.IDF_AULA,
				DAT_AULA: dados.DAT_AULA,
				IDF_TURMA: dados.IDF_TURMA,
				DES_TURMA: parseInt(dados.DES_TURMA),
				IDF_DISCIPLINA: dados.IDF_DISCIPLINA,
				DES_DISCIPLINA: dados.DES_DISCIPLINA,
				IDF_PROFISSIONAL: dados.IDF_PROFISSIONAL,
				NRO_AVALIACAO: dados.NRO_AVALIACAO,
				HOR_INICIO: dados.HOR_INICIO,
				HOR_TERMINO: dados.HOR_TERMINO,
				IDF_CONTEUDO: dados.IDF_CONTEUDO,
				DES_ASSUNTO: dados.DES_ASSUNTO,
				OBSERVACAO: dados.OBSERVACAO,
				SIT_REGISTRO: dados.SIT_REGISTRO,
				IDF_PLAULA: dados.IDF_PLAULA,
				IDF_CONTEUDOS: dados.IDF_CONTEUDOS
			  };
			  console.log("Inserindo aula", dadosInsert);
  
			  try {
				await this.cub3Db.addStorage("MOB_REGISTRO_AULA", dadosInsert);
				await this.cub3Svc.sincronizar('MOB_REGISTRO_AULA').then(() => {
				  setTimeout(() => {
					carregar.dismiss();
					// this.cub3Svc.alerta("Registro de aula", "Registro sincronizado com sucesso!");
					this.navCtrl.pop();
					// Exibe confirmação para registrar frequência
					this.exibirConfirmacaoAula();
				  }, 1000);
				}, () => {
				  setTimeout(() => {
					carregar.dismiss();
					this.cub3Svc.alerta("Registro de aula", "Registro inserido com sucesso!");
					this.navCtrl.pop();
					this.exibirConfirmacaoAula();
				  }, 500);
				});
			  } catch (error) {
				carregar.dismiss();
				this.cub3Svc.alerta("Ocorreu um problema", "Por favor, verifique a data de aula, disciplina e o assunto.");
				console.error(error);
			  }
			} else if (this.tipoCadastro === 'P') { // Planejado
			  const datasAulas = this.gerarDatasEntre(this.dados.DAT_AULA_INICIAL, this.dados.DAT_AULA_FINAL, this.diasSemana);
			  console.log("Datas geradas", datasAulas);
			  let promises: Promise<any>[] = [];
  
			  for (const dataAula of datasAulas) {
				let dadosInsert: any = {
				  IDF_AULA: dados.IDF_AULA,
				  IDF_TURMA: parseInt(dados.IDF_TURMA),
				  DES_TURMA: dados.DES_TURMA,
				  IDF_DISCIPLINA: dados.IDF_DISCIPLINA,
				  IDF_PROFISSIONAL: dados.IDF_PROFISSIONAL,
				  IDF_CONTEUDO: dados.IDF_CONTEUDO,
				  DES_DISCIPLINA: dados.DES_DISCIPLINA,
				  DES_ASSUNTO: dados.DES_ASSUNTO,
				  OBSERVACAO: dados.OBSERVACAO,
				  SIT_REGISTRO: dados.SIT_REGISTRO,
				  IDF_PLAULA: dados.IDF_PLAULA,
				  IDF_CONTEUDOS: dados.IDF_CONTEUDOS,
				  DAT_AULA: moment.utc(dataAula).format("YYYY-MM-DD")
				};
				const promise = this.cub3Db.addStorage("MOB_REGISTRO_AULA", dadosInsert);
				promises.push(promise);
			  }
			  
			  // Aguarda todas as inserções serem realizadas
			  Promise.all(promises).then(async () => {
				carregar.dismiss();
				await this.cub3Svc.sincronizar('MOB_REGISTRO_AULA').then(() => {
				  setTimeout(() => {
					this.cub3Svc.alerta("Registro de aulas", "Registros enviados com sucesso!");
					this.navCtrl.pop();
				  }, 3500);
				}, () => {
				  setTimeout(() => {
					this.cub3Svc.alerta("Registro de aulas", "Registros inseridos com sucesso!");
					this.navCtrl.pop();
				  }, 500);
				});
			  }).catch((err) => {
				carregar.dismiss();
				this.cub3Svc.alerta("Ocorreu um problema", "Por favor, verifique os dados das aulas.");
				console.error(err);
			  });
			}
		  } catch (error) {
			carregar.dismiss();
			// Trate o erro conforme necessário
			console.error(error);
		  }
		}
	  }
	}
  
	/**
	 * Exibe um alerta para confirmar o registro de frequência após submeter a aula.
	 */
	async exibirConfirmacaoAula(): Promise<void> {
	  const alert = await this.alertController.create({
		header: 'Registro de frequência',
		message: 'Deseja registrar a frequência dos alunos?',
		buttons: [
		  {
			text: 'Não',
			role: 'cancel',
			cssClass: 'secondary',
			handler: () => {
			  // Ação ao cancelar (nada)
			}
		  }, 
		  {
			text: 'Sim',
			handler: () => {
			  this.router.navigate([`/app/academico/academico-frequencia/${this.turmaAtiva.id}/${this.dados.IDF_AULA}`]);
			}
		  }
		]
	  });
	  await alert.present();
	  this.cub3Svc.alerta("Registro de aula", "Registro atualizado com sucesso!");
	}
  
	/**
	 * Obtém os planos de aula relacionados à disciplina selecionada.
	 */
	async getPlaula(): Promise<void> {
	  await this.getPeriodos();
	  this.plAula = [];
	  if (!this.data || !this.data.MOB_PLAULA || !this.dados || typeof this.verificarTurma !== 'function') {
		console.error('Data, dados ou verificarTurma não estão definidos');
		return;
	  }
	
	  const plaAulas = this.data.MOB_PLAULA;
	  const result = plaAulas.filter((plaAula: any) => 
		this.verificarTurma(plaAula.IDF_TURMA) && plaAula.IDF_DISCIPLINA === this.dados.IDF_DISCIPLINA
	  );
	
	  this.plAula = result;
	}
  
	/**
	 * Gera as datas das aulas entre dois períodos e dias selecionados.
	 * @param dataInicial Data inicial no formato 'YYYY-MM-DD'
	 * @param dataFinal Data final no formato 'YYYY-MM-DD'
	 * @param diasSemana Array de strings representando os dias da semana (e.g., ['segunda', 'quarta'])
	 * @returns Array de strings com as datas formatadas 'DD/MM/YYYY'
	 */
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
	
	/**
	 * Obtém o dia da semana em formato 'domingo', 'segunda', etc.
	 * @param data Objeto Date
	 * @returns String representando o dia da semana
	 */
	DiaDaSemana(data: Date): string {
	  const dias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
	  return dias[data.getDay()];
	}
	
	/**
	 * Formata a data como uma string 'DD/MM/YYYY'.
	 * @param data Objeto Date
	 * @returns String formatada
	 */
	formatarData(data: Date): string {
	  return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
	}
  
	/**
	 * Verifica se uma turma está presente na lista.
	 * @param turmas String com IDs das turmas separados por vírgula
	 * @returns Booleano indicando se a turma está presente
	 */
	verificarTurma(turmas: string): boolean {
	  try {
		const auxTurmas = turmas.split(",");
		return auxTurmas.includes(this.turmaAtiva.IDF_TURMA);
	  } catch (error) {
		console.error("Erro ao verificar turma:", error);
		return false;
	  }
	}
  
	/**
	 * Obtém os períodos relacionados à disciplina selecionada.
	 */
	async getPeriodos(): Promise<void> {
	  const disciplina = this.data.MOB_DISCIPLINAS.find((x: any) => x.IDF_DISCIPLINA === this.dados.idDisciplina);
	  console.log("Disciplina", disciplina);
	  this.data.MOB_CONTEUDO = this.data.escolas.conteudo.find((x: any) => x.DES_DISCIPLINA.trim() === disciplina.DES_DISCIPLINA.trim());
	  this.cd.markForCheck();
	}
  
	/**
	 * Atualiza os conteúdos selecionados com base nos IDs armazenados.
	 * @param evt Evento opcional
	 */
	async atualizarConteudos(evt: any = null): Promise<void> {
	  this.dados.CONTEUDOS = this.dados.IDF_CONTEUDOS
		.map((id: any) => this.data.CONTEUDOS.find((c: any) => c.IDF_CONTEUDO === id))
		.filter((conteudo: any) => conteudo !== undefined)
		.map((conteudo: any) => ({
		  ...conteudo,
		  DURACAO: this.getDuracao(conteudo)
		}));
	}
  
	/**
	 * Obtém a duração de um conteúdo específico.
	 * @param item Objeto do conteúdo
	 * @returns Duração em minutos
	 */
	getDuracao(item: any): number {
	  let duracao: number = 0; 
  
	  const processarDuracao = (conteudoStr: string): void => {
		const partes = conteudoStr.split("|");
		if (partes[0] === item.IDF_CONTEUDO) {
		  duracao = parseInt(partes[1]);
		}
	  };
  
	  if (this.dados.IDF_CONTEUDO.includes(",")) {
		const conteudos = this.dados.IDF_CONTEUDO.split(",");
		conteudos.forEach(conteudo => {
		  if (conteudo.includes("|")) {
			processarDuracao(conteudo);
		  } else if (conteudo === item.IDF_CONTEUDO) {
			duracao = 0; // Definir duração padrão se necessário
		  }
		});
	  } else {
		if (this.dados.IDF_CONTEUDO.includes("|")) {
		  processarDuracao(this.dados.IDF_CONTEUDO);
		} else if (this.dados.IDF_CONTEUDO === item.IDF_CONTEUDO) {
		  duracao = 0; // Definir duração padrão se necessário
		}
	  }
  
	  console.log(duracao);
	  return duracao;
	}
  }
  
  