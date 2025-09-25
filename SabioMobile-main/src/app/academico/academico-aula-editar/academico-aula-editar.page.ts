/**
 * @file academico-aula-editar.page.ts
 * @description Componente para editar uma aula específica, incluindo seleção de disciplinas, conteúdos e durações.
 * @autor Gustavo Aguiar - gustavo@cub3.com.br
 */

import { 
	ChangeDetectionStrategy, 
	ChangeDetectorRef, 
	Component, 
	OnInit, 
	OnDestroy, 
	ViewChild 
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
  
  @Component({
	selector: 'app-academico-aula-editar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './academico-aula-editar.page.html',
	styleUrls: ['./academico-aula-editar.page.scss'],
  })
  export class AcademicoAulaEditarPage implements OnInit, OnDestroy {
	
	// Referência aos Slides do Ionic
	@ViewChild(IonSlides) slides: IonSlides;
  
	// Dados da Turma e Aula
	turmaAtiva: any = { NME_TURMA: '' };
	dados: any = {
	  IDF_AULA: '',
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
	data: any = { MOB_DISCIPLINAS: [], MOB_PLAULA: [] };
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
	jsonData: any = { duracao: [] };
	  etapa: number = 1;
  
	/**
	 * Construtor para injeção de dependências.
	 * @param cub3Svc Serviço customizado Cub3
	 * @param location Serviço de localização
	 * @param navCtrl Controlador de Navegação
	 * @param alertController Controlador de Alertas
	 * @param cd Referência para detecção de mudanças
	 * @param cub3Db Provedor de Banco de Dados Cub3
	 * @param selector Plugin WheelSelector para seleção de duração
	 * @param route Rota ativa
	 * @param router Roteador para navegação
	 */
	constructor(
	  public cub3Svc: Cub3SvcProvider,
	  private location: Location,
	  private navCtrl: NavController,
	  private alertController: AlertController,
	  private cd: ChangeDetectorRef,
	  private cub3Db: Cub3DbProvider,
	  private selector: WheelSelector,
	  private route: ActivatedRoute,
	  private router: Router
	) { }
  
	/**
	 * Ciclo de vida: Executado quando o componente é inicializado.
	 */
	ngOnInit(): void {
	  // Inicializa dados do usuário
	  this.init();
  
	  // Observa mudanças na URL da rota
	  this.route.url.subscribe(() => {  
		const aulaId = this.route.snapshot.params.id;
		if (aulaId && aulaId !== 'undefined') {
		  this.dados.IDF_AULA = aulaId;
		  this.getAula();
		} else {
		  this.location.back();
		}
	  });
  
	  // Adiciona listener para scroll
	  window.addEventListener('scroll', this.handleScroll);
	}
  
	/**
	 * Ciclo de vida: Executado quando o componente é destruído.
	 */
	ngOnDestroy(): void {
	  // Remove listener de scroll
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
	  // Método placeholder para futuras inicializações
	}
  
	/**
	 * Obtém a aula específica com base no ID fornecido.
	 */
	async getAula(): Promise<void> {
	  this.carregando = true;
  
	  // Recupera dados armazenados localmente
	  this.data = StorageUtils.getItem("data");
	  this.data.MOB_DISCIPLINAS = [];
	  this.carregando = true;
  
	  try {
		// Obtém todas as turmas disponíveis
		const turmas = await this.cub3Svc.getTurmas();
		console.log("Turmas", turmas); 
		
		// Obtém todas as aulas armazenadas
		const aulas = await this.cub3Db.getStorage("MOB_REGISTRO_AULA");
		
		// Encontra a aula específica
		this.dados = aulas.find(aula => parseInt(aula.IDF_AULA) === parseInt(this.dados.IDF_AULA));
		console.log('Aula', this.dados);
  
		this.cd.markForCheck();
		console.log("Aula carregada", [this.dados, this.conteudos]);
  
		// Obtém disciplinas relacionadas à turma
		await this.getDisciplinas();
		// this.getPlaula(); // Método comentado, remover se não for necessário
		this.carregando = false;
		// this.getConteudos(); // Método comentado, remover se não for necessário
		// this.atualizarConteudos(); // Método comentado, remover se não for necessário
	  } catch (error) {
		console.error("Erro ao obter aula:", error);
		this.carregando = false;
	  }
	}
  
	/**
	 * Obtém as disciplinas relacionadas à turma ativa.
	 */
	async getDisciplinas(): Promise<void> {
	  try {
		const turmas = await this.cub3Svc.getTurmas();
		const turma = turmas.find(turma => parseInt(turma.id) === parseInt(this.dados.IDF_TURMA));
		this.turmaAtiva = turma; 
		
		console.log("Turma", turma);
		this.data.MOB_DISCIPLINAS = turma?.disciplinas || [];
	  } catch (error) {
		console.error("Erro ao obter disciplinas:", error);
		this.data.MOB_DISCIPLINAS = [];
	  }
	  
	  this.cd.markForCheck();
	}
  
	/**
	 * Valida e submete os dados da aula para armazenamento.
	 */
	async submit(): Promise<void> {
	  // Define campos obrigatórios
	  const camposObrigatorios: any[] = [ 
		{ id: 'DES_ASSUNTO', label: 'Conteúdo' }
	  ];
  
	  if (this.data.MOB_DISCIPLINAS.length > 0) {
		camposObrigatorios.push({ id: 'IDF_DISCIPLINA', label: 'Disciplina' });
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
		// Processa conteúdos selecionados e suas durações
		const CONT = this.dados.CONTEUDOS;
		console.log("CONT", CONT);
  
		let auxCont: string = "";
		let contador: number = 1;
		if (CONT && CONT.length > 0) {
		  for (const item of CONT) {
			if (item.DURACAO) {
			  auxCont += `${item.IDF_CONTEUDO}|${item.DURACAO}`;
			  if (contador < CONT.length) {
				auxCont += ",";
			  }
			} else {
			  auxCont += item.IDF_CONTEUDO;
			  if (contador < CONT.length) {
				auxCont += ",";
			  }
			}
			contador++;
		  } 
		}
		this.dados.IDF_CONTEUDO = auxCont;
		
		const dados: any = { ...this.dados };
		delete dados.CONTEUDOS;
  
		dados.NRO_AVALIACAO = parseInt(dados.NRO_AVALIACAO);
		console.log(dados);
		
		if (dados.DES_ASSUNTO !== '') {
		  let carregar: any = await this.cub3Svc.carregar(1);
  
		  try {
			const aulas = await this.cub3Db.getStorage("MOB_REGISTRO_AULA");
			
			// Função para gerar uma chave única para cada aula
			const generateAulaKey = (aula: any): string => {
			  return `${moment.utc(aula.DAT_AULA).format('YYYY-MM-DD')}_${aula.IDF_TURMA}_${aula.IDF_PROFISSIONAL}_${aula.IDF_DISCIPLINA}_${aula.HOR_INICIO}_${aula.HOR_TERMINO}`;
			};
		
			// Gera a chave para a aula atual
			const currentAulaKey = generateAulaKey(this.dados);
		
			// Procura a aula existente para atualizar ou adicionar uma nova
			const index = aulas.findIndex((aula: any) => generateAulaKey(aula) === currentAulaKey);
			if (index !== -1) {
			  // Atualiza a aula existente
			  aulas[index] = this.dados;
			  console.log("=== Aula localizada", this.dados);
			} else {
			  // Adiciona uma nova aula
			  aulas.push(this.dados);
			}
  
			// Transforma o array de IDF_CONTEUDOS em string se necessário
			if (Array.isArray(this.dados.IDF_CONTEUDOS)) {
			  console.log("Adicionando conteudos", this.dados.IDF_CONTEUDOS);
			  // Remove conteúdos não selecionados
			  this.dados.IDF_CONTEUDOS = this.dados.IDF_CONTEUDOS.filter(item => item.selecionado !== false);
			}
  
			// Salva os dados atualizados no armazenamento
			await this.cub3Db.setStorage("MOB_REGISTRO_AULA", aulas);
  
			// Sincroniza os dados com o backend
			this.cub3Svc.sincronizar('MOB_REGISTRO_AULA').then(() => {
			  setTimeout(() => {
				carregar.dismiss();
				// this.cub3Svc.alerta("Registro de aula", "Registro sincronizado com sucesso!");
				this.navCtrl.pop();
				// Exibe confirmação para registrar frequência
				this.exibirConfirmacaoAula();
			  }, 3500);
			}, () => {
			  setTimeout(() => {
				carregar.dismiss();
				this.navCtrl.pop();
				this.exibirConfirmacaoAula();
			  }, 500);
			});
		  } catch (error) {
			console.error("Erro ao submeter aula:", error);
			carregar.dismiss();	
		  }
		} else {
		  this.cub3Svc.alerta("Ocorreu um problema", "Por favor, verifique a data de aula, disciplina e o assunto.");
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
	 * Obtém conteúdos baseados na avaliação e disciplina selecionadas.
	 * @param evt Evento opcional
	 * @param avancar Flag para avançar automaticamente após carregar
	 */
	async getConteudos(evt?: any, avancar: boolean = true): Promise<void> {
	  console.log("Buscando conteudo", evt);
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
		
		console.log('Verificando conteudos da aula', this.dados.IDF_CONTEUDOS);
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
  
	/**
	 * Atualiza os conteúdos selecionados com base nos IDs armazenados.
	 * @param evt Evento opcional
	 */
	atualizarConteudos(evt: any = null): void {
	  this.dados.CONTEUDOS = this.dados.IDF_CONTEUDOS
		.map((id: any) => this.data.CONTEUDOS.find((c: any) => c.IDF_CONTEUDO === id))
		.filter((conteudo: any) => conteudo !== undefined)
		.map((conteudo: any) => ({
		  ...conteudo,
		  DURACAO: this.getDuracao(conteudo)
		}));
	}
  
	/**
	 * Verifica se uma turma está presente na lista.
	 * @param turmas String com IDs das turmas separados por vírgula
	 * @returns Booleano indicando se a turma está presente
	 */
	verificarTurma(turmas: string): boolean {
	  const auxTurmas = turmas.split(",");
	  return auxTurmas.includes(this.turmaAtiva.IDF_TURMA);
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
	 * @param idDisciplina ID da disciplina selecionada
	 */
	selecionarDisciplina(idDisciplina: number): void {
	  this.dados.IDF_DISCIPLINA = idDisciplina;
	  this.getPlaula();
	  this.wizard = 3;
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
	async avancar(): Promise<void> { 
	  this.slides.length().then(async length => {
		const index = await this.slides.getActiveIndex();
		console.log(index);
		console.log('currentIndex:', [index]);
  
		this.etapa = index + 1;
		switch(index) {
		  case 0:
			await this.getConteudos(null, false);
			this.slides.slideNext().then(() => { 
			  window.scrollTo({ top: 0, behavior: 'smooth' });
			});
			break;
		  default:
			this.slides.slideNext().then(() => { 
			  window.scrollTo({ top: 0, behavior: 'smooth' });
			});
			break;
		}
  
		// Verifica se está no último slide do slides
		if (this.etapa === length) {
		  // Se estiver no último slide, chama a função submit.
		  this.submit();
		}
  
		this.cd.markForCheck();
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
	 * Obtém os planos de aula relacionados à disciplina selecionada.
	 */
	async getPlaula(): Promise<void> {
	  this.data.MOB_PLAULA = [];
	  const PLAULA = StorageUtils.getItem("MOB_PLAULA");
  
	  if (PLAULA) {
		this.data.MOB_PLAULA = PLAULA.filter((item: any) => item.IDF_DISCIPLINA === this.dados.IDF_DISCIPLINA);
	  }
	}
  
  }
  