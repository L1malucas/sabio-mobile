/**
 * @file academico-turma.page.ts
 * @description Componente para gerenciamento de turmas acadêmicas, incluindo visualização de aulas, avaliações e frequências.
 * @autor Gustavo Aguiar - gustavo@cub3.com.br
 */

import { 
  ChangeDetectionStrategy, 
  ChangeDetectorRef, 
  Component, 
  OnInit 
} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { AlertController } from '@ionic/angular';

// Utilitários e Configurações
import { StorageUtils } from '@cub3/utils/storage.utils';
import { CORS_URL } from '@cub3/cub3-config';

// Classes e Interfaces
import { Usuario } from "@cub3/classes/usuario";
import { Aula } from "@cub3/classes/aula";

// Provedores de Serviços
import { Cub3DbProvider } from '@cub3/cub3-db/cub3-db';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';

// Capacitor Plugins
import { ActionSheet, ActionSheetButtonStyle } from '@capacitor/action-sheet';

// Bibliotecas Externas
import * as moment from 'moment';

@Component({
  selector: 'app-academico-turma',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './academico-turma.page.html',
  styleUrls: ['./academico-turma.page.scss'],
})
export class AcademicoTurmaPage implements OnInit {
  
  // Data e Tempo
  currentDate: Date = new Date();
  currentDay: number = this.currentDate.getDay();
  currentDayDate: number = this.currentDate.getDate();
  weekDays: any[] = [];
  diaAtual: any;

  // Dados de Turmas e Horários
  turmas: any[] = [];
  horariosCarregados: boolean = false;
  filteredHorarios: any[] = [];
  filteredTurmas: any[] = [];
  filteredTurmasGroupedBySchool: any[] = [];
  animate: boolean = false;

  // Estado da Turma Ativa
  turmaAtiva: any = {
    NME_TURMA: ''
  };
  dados: any = {};

  // Dados do Usuário
  usuario: Usuario = StorageUtils.getAccount();

  // Indicadores de Carregamento
  carregandoAulas: boolean = true;
  carregando: boolean = true;

  // Controle de Aba Ativa
  abaAtiva: any = "acoes";

  // Dados de Aulas e Avaliações
  aulas: any[] = [];
  avaliacoes: any[] = [];

  /**
   * Construtor para injeção de dependências.
   * @param route Rota ativa
   * @param alertCtrl Controlador de Alertas
   * @param router Roteador para navegação
   * @param cd Referência para detecção de mudanças
   * @param location Serviço de localização
   * @param cub3Svc Serviço customizado Cub3
   * @param cub3Db Provedor de Banco de Dados Cub3
   */
  constructor(
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private router: Router, 
    private cd: ChangeDetectorRef,
    private location: Location,
    public cub3Svc: Cub3SvcProvider,
    private cub3Db: Cub3DbProvider
  ) { }

  /**
   * Formata um horário para "HH:mm".
   * @param horario Objeto contendo o horário
   * @returns Horário formatado ou string vazia em caso de erro
   */
  getHora(horario: any): string {
    try {
      return moment(horario).format("HH:mm");
    } catch (e) {
      return '';
    }
  }

  /**
   * Seleciona a aba ativa e marca para detecção de mudanças.
   * @param aba Nome da aba a ser selecionada
   */
  selecionarAba(aba: string): void {
    this.abaAtiva = aba;
    this.cd.markForCheck();
  }

  /**
   * Navega para a página de notas dos alunos para a avaliação selecionada.
   * @param avaliacao Objeto da avaliação selecionada
   */
  async selecionarAvaliacao(avaliacao: any): Promise<void> {
    this.router.navigate([`/app/academico/academico-turma-nota-alunos/${this.dados.id}/${avaliacao.IDF_AVALIACAO || avaliacao.NRO_AVALIACAO}`]);
  }

  /**
   * Abre opções para a aula selecionada, como editar conteúdo, lançar frequência ou excluir.
   * @param horario Objeto contendo os detalhes do horário da aula
   * @param inicio Hora de início da aula
   * @param fim Hora de término da aula
   * @param disciplina Objeto da disciplina associada
   */
  async selecionarAula(horario: any, inicio: string, fim: string, disciplina: any): Promise<void> {
    let opcoes: any[] = [];

    // Define as opções com base na existência de uma aula ativa
    if (horario.IDF_AULA) {
      opcoes = [
        { title: 'Conteúdo da aula' },
        { title: 'Lançamento de frequência' },
        { 
          title: 'Excluir aula',
          style: ActionSheetButtonStyle.Destructive,
        },
        { 
          title: 'Fechar opções', 
          tipo: 'fechar',
          style: ActionSheetButtonStyle.Cancel 
        }
      ];
    } else {
      opcoes = [
        { title: 'Conteúdo da aula' },
        { title: 'Lançamento de frequência' },
        { 
          title: 'Fechar opções', 
          tipo: 'fechar',
          style: ActionSheetButtonStyle.Cancel 
        }
      ];
    }

    // Exibe o Action Sheet com as opções definidas
    const result = await ActionSheet.showActions({
      title: `Opções da aula de ${inicio} às ${fim}`,
      message: 'Selecione uma opção para a aula selecionada',
      options: opcoes,
    });

    // Verifica se a ação foi cancelada ou inválida
    if (result.index < 0 || (opcoes[result.index].tipo && opcoes[result.index].tipo === 'fechar')) {
      return;
    }

    // Recupera as aulas armazenadas
    let aulas = await this.cub3Db.getStorage("MOB_REGISTRO_AULA");
    let aulaExistente: any;

    // Verifica se a aula já existe
    if (horario.detalhesAula?.IDF_AULA) {
      aulaExistente = aulas.find(aula => parseInt(aula.IDF_AULA) === parseInt(horario.IDF_AULA || horario.detalhesAula?.IDF_AULA));
    } else {
      const DAT_AULA = moment.utc(this.diaAtual.date).format('YYYY-MM-DD');
      aulaExistente = aulas.find(aula => 
        aula.DAT_AULA === horario.DAT_AULA &&
        aula.HOR_INICIO === horario.HOR_INICIO &&
        aula.HOR_TERMINO === horario.HOR_TERMINO &&
        aula.IDF_PROFISSIONAL === horario.IDF_PROFISSIONAL &&
        parseInt(aula.IDF_TURMA) === parseInt(horario.IDF_TURMA) &&
        aula.IDF_DISCIPLINA === horario.IDF_DISCIPLINA
      );
    }

    // Se a aula não existir, cria uma nova entrada
    if (!aulaExistente && !horario.IDF_AULA) {
      const dadosInsert = {
        IDF_AULA: Math.floor(Math.random() * 1000) + 1,
        DAT_AULA: moment.utc(this.diaAtual.date).format('YYYY-MM-DD'),
        HOR_INICIO: inicio,
        HOR_TERMINO: fim,
        IDF_TURMA: this.turmaAtiva.id,
        DES_TURMA: this.turmaAtiva.titulo,
        IDF_ETAPA: this.dados.IDF_ETAPA,
        IDF_DISCIPLINA: disciplina.IDF_DISCIPLINA,
        DES_DISCIPLINA: disciplina.DES_DISCIPLINA,
        IDF_PROFISSIONAL: this.usuario.id,
        DES_ASSUNTO: null,
        OBSERVACAO: "",
        SIT_REGISTRO: "PENDENTE",
        IDF_CONTEUDOS: []
      };

      await this.cub3Db.addStorage("MOB_REGISTRO_AULA", dadosInsert);
      aulas.push(dadosInsert);
      aulaExistente = dadosInsert;
    } 

    // Armazena o dia atual
    StorageUtils.setItem("diaAtual", this.diaAtual);

    // Executa a ação selecionada
    if (aulaExistente) {
      switch (result.index) {
        case 0: // Conteúdo da aula
          this.router.navigate(['/app/academico/academico-aula-editar', aulaExistente.IDF_AULA]);
          break;
        case 1: // Lançamento de frequência
          if(!aulaExistente || (aulaExistente && !aulaExistente.DES_ASSUNTO)) {
            this.cub3Svc.alerta("Conteúdo não lançado", "Para registrar a frequência, por gentileza, registre primeiro o conteúdo da aula.");
          } else {
            this.router.navigate([`/app/academico/academico-frequencia/${this.turmaAtiva.id}/${aulaExistente.IDF_AULA}`]);
          }
          break;
        case 2: // Excluir aula
          const confirm = await this.alertCtrl.create({
            header: 'Excluir aula',
            message: 'Tem certeza que deseja excluir esta aula?',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary'
              },
              {
                text: 'Excluir',
                handler: async () => {
                  // Função para gerar uma chave única para cada aula
                  const generateAulaKey = (aula: any) => {
                    return `${moment.utc(aula.DAT_AULA).format('YYYY-MM-DD')}_${aula.IDF_TURMA}_${aula.IDF_PROFISSIONAL}_${aula.IDF_DISCIPLINA}_${aula.HOR_INICIO}_${aula.HOR_TERMINO}`;
                  };

                  // Gera a chave para a aula atual
                  const currentAulaKey = generateAulaKey(aulaExistente);

                  // Filtra aulas que não correspondem à aula atual
                  aulas = aulas.filter(aula => generateAulaKey(aula) !== currentAulaKey);

                  this.aulas = aulas;
                  aulaExistente.SIT_REGISTRO = "EXCLUIDO";

                  // Atualiza o storage e sincroniza as alterações
                  this.cub3Db.updateStorage("MOB_REGISTRO_AULA", aulaExistente, 'IDF_AULA').then(async () => { 
                    let frequencias = await this.cub3Db.getStorage("MOV_REGISTRO_FREQUENCIA");
                    frequencias = frequencias.filter(f => 
                      !(parseInt(f.IDF_AULA) === parseInt(aulaExistente.IDF_AULA))
                    );
                    await this.cub3Db.setStorage("MOV_REGISTRO_FREQUENCIA", frequencias);
                    await this.cub3Svc.sincronizar('MOB_REGISTRO_AULA');
                    this.cub3Svc.alerta("Remoção da aula", "Aula removida com sucesso!");

                    this.aulas = [];
                    setTimeout(async () => {
                      await this.atualizarAulas();
                      await this.filterTurmas();
                    }, 300);
                  }, () => {
                    this.cub3Svc.alerta("Ops!", "Não foi possível remover a aula. Tente novamente!"); 
                  });
                }
              }
            ]
          });
          await confirm.present();
          break;
      }
    } else {
      this.cub3Svc.alerta("Ocorreu um problema", "Por favor, verifique a data de aula, disciplina e o assunto.");
    }
  }

  /**
   * Obtém o nome da disciplina baseado no ID.
   * @param idfDisciplina ID da disciplina
   * @returns Nome normalizado da disciplina ou mensagem padrão
   */
  getDisciplinaName(idfDisciplina: number): string {
    let disciplina = this.turmaAtiva.disciplinas.find((d: any) => parseInt(d.IDF_DISCIPLINA) === parseInt(idfDisciplina + ''));
    return disciplina ? this.cub3Svc.normalizeString(disciplina.DES_DISCIPLINA) : 'Disciplina não aplicável';
  }

  /**
   * Ciclo de vida: Executado quando a view está prestes a entrar e se tornar ativa.
   */
  async ionViewWillEnter(): Promise<void> {
    this.horariosCarregados = false;
  }

  /**
   * Ciclo de vida: Executado quando a view entrou e está totalmente ativa.
   */
  async ionViewDidEnter(): Promise<void> { 
    // Simula o carregamento dos horários
    setTimeout(() => {
      this.horariosCarregados = true;
      this.cd.markForCheck();
    }, 3000);

    // Carrega as turmas e gera os dias da semana
    this.turmas = await this.cub3Svc.getTurmas();
    this.generateWeekDays();
    this.diaAtual = this.weekDays.find(day => day.date.getDate() === this.currentDayDate); // Seleciona o dia atual automaticamente

    // Filtra as turmas após um breve atraso
    setTimeout(async () => {
      await this.filterTurmas();
    }, 500);
  }

  /**
   * Ciclo de vida: Executado quando a view está prestes a sair.
   */
  ionViewWillLeave(): void {
    this.horariosCarregados = false;
    this.cd.markForCheck();
  }

  /**
   * Inicialização do componente.
   */
  ngOnInit(): void {
    // Observa mudanças na URL da rota
    this.route.url.subscribe(() => {  
      const turmaId = this.route.snapshot.params.id;
      if (turmaId && turmaId !== 'undefined') {
        this.turmaAtiva.IDF_TURMA = turmaId;
        this.init();
      } else {
        this.location.back();
      }
    });
  }

  /**
   * Obtém aulas da API.
   */
  async getAulasPorTurma(): Promise<void> {
    const dados = await this.cub3Svc.getNode(`educanet/aulas/listar`);
    // Implementação futura
  }

  /**
   * Método placeholder para login na Home Class.
   */
  async logarHomeClass(): Promise<void> {
    const dados = StorageUtils.getAccount();
    // Implementação futura
  }

  /**
   * Abre uma aula, permitindo escolher entre dispositivo principal ou secundário.
   * @param aula Objeto da aula selecionada
   */
  async abrirAula(aula: any): Promise<void> {
    const id = aula.IDF_AULA;

    const alert = await this.alertCtrl.create({
      header: 'Selecione como gostaria de entrar na aula:',
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: 'Como dispositivo principal',
          value: 'principal',
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: 'Como dispositivo secundário (apenas áudio)',
          value: 'secundario'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, 
        {
          text: 'Confirmar',
          handler: async (val: any) => {
            // Define a preferência de stream
            switch(val) {
              case "principal":
                StorageUtils.setItem("streamPrincipal", true);
                break;
              case "secundario":
                StorageUtils.setItem("streamPrincipal", false);
                break;
            }

            // Tenta visualizar a aula existente
            this.cub3Svc.getNode("aulas/visualizar?id="+id).then((r: any) => {
              this.router.navigateByUrl('/app/academico/academico-aula-remota/'+id+"/"+aula.IDF_TURMA, {replaceUrl: true});
            }, () => { 
              // Se não existir, cria uma nova aula
              let dadosAula: any = {
                curso_id: 1,
                id: id,
                curso_tema_id: 1,
                turma_id: aula.IDF_TURMA,
                profissional_id: this.usuario.id,
                duracao: 150,
                status: 'PENDENTE', 
                facial_abertura_instrutor: '',
                tipo: 'REMOTO',
                camera: 0,
                stream: 'temonitore',
                microfone: 0
              };

              this.cub3Svc.postNode("aulas/novo", dadosAula).then((r: any) => { 
                if (r && r.result) { 
                  StorageUtils.setItem("streamPrincipal", true);
                  this.cub3Svc.alertaToast("Nova aula", "Aula criada com sucesso!", "success"); 
                  this.router.navigate(['/app/academico/academico-aula-remota/'+r.dados.id+'/'+aula.IDF_TURMA]);  
                  StorageUtils.setItem("aulaAtual", r.dados); 
                } else { 
                  this.cub3Svc.alerta("Ops!", "Não foi possível criar a aula. Por favor, tente novamente ou entre em contato com o suporte técnico.");
                }
              }, (err) => { 
                this.cub3Svc.alerta("Ops!", "Não foi possível criar a aula. Por favor, tente novamente ou entre em contato com o suporte técnico.");
              });
            });
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Gera uma chave única para uma aula.
   * @param aula Objeto da aula
   * @returns Chave única como string
   */
  getKeyForAula(aula: any): string {
    return `${aula.DAT_AULA}-${aula.HOR_INICIO}-${aula.HOR_TERMINO}-${aula.IDF_DISCIPLINA}-${aula.IDF_PROFISSIONAL}-${aula.IDF_TURMA}`;
  }

  /**
   * Mescla informações de duas aulas existentes.
   * @param aulaExistente Aula já existente
   * @param aulaNova Aula nova a ser mesclada
   * @returns Aula mesclada
   */
  mergeAulas(aulaExistente: any, aulaNova: any): any {
    const camposParaMesclar = ['DES_ASSUNTO', 'OBSERVACAO', 'IDF_CONTEUDOS', 'IDF_CONTEUDO'];

    camposParaMesclar.forEach(campo => {
      if (aulaNova[campo] && (!aulaExistente[campo] || aulaExistente[campo].length < aulaNova[campo].length)) {
        aulaExistente[campo] = aulaNova[campo];
      }
    });

    return aulaExistente;
  }

  /**
   * Obtém as aulas, sincronizando com a API e armazenando localmente.
   * @param evt Evento opcional
   * @returns Promessa que resolve com as aulas
   */
  getAulas(evt?: any): Promise<Aula[]> { 
    this.carregandoAulas = true;
    return new Promise(async (resolve, reject) => {
      let aulas: Aula[] = await this.cub3Db.getStorage("MOB_REGISTRO_AULA"); 

      this.cub3Svc.getNode(`educanet/aulas/mobile?idf_turma=${this.turmaAtiva.id}`).then(async (r) => { 
        if (!this.aulas) {
          this.aulas = [];
        }
        
        if(r && r.dados) {
          for (const aula of r.dados) {
            const conteudos: any[] = aula.conteudos.map((conteudo: any) => ({
              ANO_LETIVO: conteudo.anoLetivo,
              IDF_CONTEUDO: conteudo.idfConteudo,
              SEQ_CONTEUDO: conteudo.seqConteudo,
              NRO_HORAAULA: conteudo.duracaoMinutos,
              IDF_ETAPA: conteudo.idfEtapa,
              DES_ETAPA: conteudo.descricaoEtapa,
              IDF_DISCIPLINA: conteudo.disciplinaId,
              DES_DISCIPLINA: conteudo.descricaoDisciplina,
              NRO_AVALIACAO: conteudo.avaliacaoNumero,
              DES_AVALIACAO: conteudo.descricaoAvaliacao
            }));

            const chave = `${aula.dataAula}-${aula.horInicio}-${aula.horTermino}-${aula.idfDisciplina}-${aula.idfTurma}`;
            const existingAulaIndex = this.aulas.findIndex(a => `${a.DAT_AULA}-${a.HOR_INICIO}-${a.HOR_TERMINO}-${a.IDF_DISCIPLINA}-${a.IDF_TURMA}` === chave);

            if (existingAulaIndex !== -1) {
              let existingAula = this.aulas[existingAulaIndex];
              existingAula.DES_ASSUNTO = aula.descricaoAssunto || existingAula.DES_ASSUNTO;
              existingAula.IDF_CONTEUDOS = [...new Set([...existingAula.IDF_CONTEUDOS, ...conteudos])];
              existingAula.OBSERVACAO = aula.observacao || existingAula.OBSERVACAO;
            } else {
              this.aulas.push({
                IDF_AULA: aula.idfAula || null,
                DAT_AULA: aula.dataAula,
                HOR_INICIO: aula.horInicio || '',
                HOR_TERMINO: aula.horTermino || '',
                IDF_TURMA: aula.idfTurma || null,
                DES_TURMA: aula.desTurma || '',
                IDF_ETAPA: aula.idfEtapa || null,
                IDF_DISCIPLINA: aula.idfDisciplina,
                DES_DISCIPLINA: aula.desDisciplina || '',
                SIT_REGISTRO: aula.sitRegistro || 'PENDENTE',
                IDF_PROFISSIONAL: aula.idfProfissional,
                DES_ASSUNTO: aula.descricaoAssunto || '',
                OBSERVACAO: aula.observacao || '',
                IDF_ALUNO_AUSENTES: aula.idfAlunoAusentes || [],
                IDF_CONTEUDOS: conteudos || []
              });
            }
          }
          this.aulas = this.deduplicateAulas([...aulas, ...this.aulas]);
          await this.cub3Db.setStorage("MOB_REGISTRO_AULA", this.aulas);
        }
        resolve(aulas); 
      }, (err: any) => {
        console.error(err);
        switch (err.status) {
          case 500:  
            this.carregandoAulas = false; 
            resolve(this.cub3Db.getStorage("MOB_REGISTRO_AULA"));
            break;
          
          default:
            this.carregandoAulas = false;
            reject(false);
            break;
        }
      });
    });
  }

  /**
   * Remove duplicatas das aulas com base em uma chave única.
   * @param aulas Array de aulas a serem deduplicadas
   * @returns Array deduplicado de aulas
   */
  deduplicateAulas(aulas: any[]): any[] {
    const aulaMap = new Map<string, any>();

    aulas.forEach((aula: any) => {
      const chave = `${aula.DAT_AULA}-${aula.HOR_INICIO}-${aula.HOR_TERMINO}-${aula.IDF_DISCIPLINA}-${aula.IDF_TURMA}`;

      if (!aulaMap.has(chave)) {
        aulaMap.set(chave, aula);
      } else {
        let existingAula = aulaMap.get(chave)!;
        existingAula.DES_ASSUNTO = aula.DES_ASSUNTO || existingAula.DES_ASSUNTO;
        existingAula.OBSERVACAO = aula.OBSERVACAO || existingAula.OBSERVACAO;
        existingAula.IDF_ALUNO_AUSENTES = [...new Set([...(existingAula.IDF_ALUNO_AUSENTES ?? []), ...(aula.IDF_ALUNO_AUSENTES ?? [])])];
        existingAula.IDF_CONTEUDOS = [...new Set([...(existingAula.IDF_CONTEUDOS ?? []), ...(aula.IDF_CONTEUDOS ?? [])])];
      }
    });

    return Array.from(aulaMap.values());
  }

  /**
   * Gera os dias da semana para a visualização.
   */
  generateWeekDays(): void {
    this.weekDays = [];
    const startOfWeek = this.getStartOfWeek(this.currentDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        label: this.getDayLabel(i),
        date: date,
        hasEvent: this.checkIfDayHasEvent(this.getDayLabel(i))
      });
    }
  }

  /**
   * Obtém a data do início da semana com base em uma data fornecida.
   * @param date Data de referência
   * @returns Data do início da semana
   */
  getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajusta quando o dia é Domingo
    return new Date(date.setDate(diff));
  }

  /**
   * Retorna o rótulo do dia com base no índice.
   * @param index Índice do dia (0-6)
   * @returns Rótulo abreviado do dia
   */
  getDayLabel(index: number): string {
    const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    return days[index];
  }

  /**
   * Verifica se um dia específico possui eventos/agendamentos.
   * @param dayLabel Rótulo abreviado do dia
   * @returns Booleano indicando se há eventos
   */
  checkIfDayHasEvent(dayLabel: string): boolean {
    const dayMap: { [key: string]: string } = {
      'DOM': 'Domingo',
      'SEG': 'Segunda',
      'TER': 'Terça',
      'QUA': 'Quarta',
      'QUI': 'Quinta',
      'SEX': 'Sexta',
      'SAB': 'Sábado'
    };
    const dayName = dayMap[dayLabel];
    return this.turmas.some(turma => 
      turma.disciplinas.some((disciplina: any) => 
        disciplina.horarios.some((horario: any) => horario.dia === dayName)
      )
    );
  }

  /**
   * Seleciona um dia específico e filtra as turmas correspondentes.
   * @param day Objeto do dia selecionado
   */
  selectDay(day: any): void {
    this.horariosCarregados = false;
    this.cd.markForCheck();
    this.diaAtual = day;
    
    this.animate = false; // Reseta animação
    setTimeout(() => {
      this.animate = true; // Ativa animação
      this.filterTurmas();
    }, 0);
  }

  /**
   * Verifica se o dia está selecionado.
   * @param day Objeto do dia
   * @returns Booleano indicando se está selecionado
   */
  isSelected(day: any): boolean {
    return this.diaAtual && this.diaAtual.date.getDate() === day.date.getDate();
  }

  /**
   * Formata uma data para "YYYY-MM-DD".
   * @param date Objeto da data
   * @returns Data formatada como string
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    return `${year}-${month}-${day}`; 
  }

  /**
   * Obtém o horário de início ou término de uma disciplina específica.
   * @param horarios Array de horários
   * @param tipo Tipo de horário ('inicio' ou 'fim')
   * @returns Horário correspondente ou string vazia em caso de erro
   */
  getHorarioDiscipinaInicio(horarios: any, tipo: string = 'inicio'): string {
    try {
      const diaId = this.diaAtual.date.getDay();  
      return (horarios.find((horario: any) => horario.diaId === diaId) || {})[tipo];
    } catch(e) {
      return "";
    }
  }

  /**
   * Filtra as turmas com base no dia selecionado.
   */
  async filterTurmas(): Promise<void> {
    if (!this.diaAtual || !this.turmaAtiva){ 
      this.horariosCarregados = true;
      this.cd.markForCheck();
      return;
    }

    // Mapeamento de rótulos para nomes completos dos dias da semana.
    const dayMap: { [key: string]: string } = {
      'DOM': 'Domingo',
      'SEG': 'Segunda',
      'TER': 'Terça',
      'QUA': 'Quarta',
      'QUI': 'Quinta',
      'SEX': 'Sexta',
      'SAB': 'Sábado'
    };
    const selectedDay = dayMap[this.diaAtual.label]; // Dia da semana completo
    const selectedDate = this.formatDate(this.diaAtual.date);
    
    // Inicializa o Map para evitar duplicidades.
    let uniqueHorarios = new Map<string, any>();
    
    // Array para rastrear horários ocupados por aulas especiais
    const horariosEspeciaisOcupados: any[] = [];
    const aulas: any[] = await this.cub3Db.getStorage("MOB_REGISTRO_AULA");

    // Filtra e processa as aulas da turma
    aulas.forEach(aula => {
      if (aula.DAT_AULA === selectedDate && aula.HOR_INICIO && aula.HOR_TERMINO) {
        const inicio = moment(`${selectedDate} ${aula.HOR_INICIO}`, 'YYYY-MM-DD HH:mm');
        const termino = moment(`${selectedDate} ${aula.HOR_TERMINO}`, 'YYYY-MM-DD HH:mm');
        const key = `${selectedDate}-${inicio.format('HH:mm:ss')}-${termino.format('HH:mm:ss')}-${aula.IDF_DISCIPLINA}`;

        if (uniqueHorarios.has(key)) {
          // Mescla aulas com a mesma chave
          let existingAula = uniqueHorarios.get(key)!;
          existingAula.assunto = aula.DES_ASSUNTO || existingAula.assunto;
          existingAula.IDF_CONTEUDOS = [...new Set([...existingAula.IDF_CONTEUDOS, ...(aula.IDF_CONTEUDOS || [])])];
          existingAula.frequencia = aula.IDF_ALUNO_AUSENTES && aula.IDF_ALUNO_AUSENTES.length > 0 ? true : existingAula.frequencia || aula.temFrequencia;
        } else {
          // Adiciona nova aula se não existir com a mesma chave
          uniqueHorarios.set(key, {
            IDF_AULA: aula.IDF_AULA,
            DAT_AULA: aula.DAT_AULA,
            HOR_INICIO: aula.HOR_INICIO,
            HOR_TERMINO: aula.HOR_TERMINO,
            IDF_PROFISSIONAL: aula.IDF_PROFISSIONAL,
            IDF_TURMA: aula.IDF_TURMA,
            IDF_DISCIPLINA: aula.IDF_DISCIPLINA,
            IDF_CONTEUDOS: aula.IDF_CONTEUDOS || [],
            horario: { inicio, termino, diaId: this.diaAtual.date.getDay() },
            titulo: this.turmaAtiva.titulo,
            assunto: aula.DES_ASSUNTO,
            conteudo: aula.IDF_CONTEUDOS,
            frequencia: aula.IDF_ALUNO_AUSENTES && aula.IDF_ALUNO_AUSENTES.length > 0 ? true : aula.temFrequencia,
            disciplinas: [{
              IDF_DISCIPLINA: aula.IDF_DISCIPLINA,
              DES_DISCIPLINA: this.getDisciplinaName(aula.IDF_DISCIPLINA),
              IDF_TURMA: aula.IDF_TURMA,
              horarios: [{ inicio: aula.HOR_INICIO, fim: aula.HOR_TERMINO }]
            }],
            nomeEscola: this.turmaAtiva.nomeEscola
          });
        }

        horariosEspeciaisOcupados.push({
          inicio,
          termino,
          IDF_DISCIPLINA: aula.IDF_DISCIPLINA
        });
      }
    });

    // Adiciona aulas regulares se o dia estiver na programação da turma
    this.turmaAtiva.disciplinas.forEach((disciplina: any) => {
      disciplina.horarios.forEach((horario: any) => {
        if (horario.dia === selectedDay) { // Garante que a comparação seja com o nome completo do dia
          const inicio = moment(`${selectedDate} ${horario.inicio}`, 'YYYY-MM-DD HH:mm');
          const termino = moment(`${selectedDate} ${horario.fim}`, 'YYYY-MM-DD HH:mm');
          const conflict = horariosEspeciaisOcupados.some(especial =>
            inicio.isBefore(moment(especial.termino)) && termino.isAfter(moment(especial.inicio))
          );
          
          if (!conflict) {
            const key = `${selectedDate}-${inicio.format('HH:mm:ss')}-${termino.format('HH:mm:ss')}`;
            uniqueHorarios.set(key, {
              horario: { inicio, termino },
              titulo: this.turmaAtiva.titulo,
              disciplinas: [disciplina],
              nomeEscola: this.turmaAtiva.nomeEscola
            });
          }
        }
      });
    });

    // Converte Map para array para uso na UI
    this.filteredHorarios = Array.from(uniqueHorarios.values());

    // Atualiza a UI após breve atraso
    setTimeout(() => {
      this.horariosCarregados = true;
      this.cd.markForCheck();
    }, 500);
  }

  /**
   * Converte um horário no formato "HH:mm" para minutos.
   * @param time String do horário no formato "HH:mm"
   * @returns Número de minutos
   */
  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Agrupa as turmas por escola.
   */
  groupTurmasBySchool(): void {
    const grouped = this.filteredTurmas.reduce((acc, turma) => {
      const school = turma.nomeEscola;
      if (!acc[school]) {
        acc[school] = [];
      }
      acc[school].push(turma);
      return acc;
    }, {});

    this.filteredTurmasGroupedBySchool = Object.keys(grouped).map(school => ({
      school,
      turmas: grouped[school]
    }));
  }

  /**
   * Sincroniza as aulas com a API e atualiza os registros locais.
   */
  async sincronizarAulas(): Promise<void> {
    const carregar = await this.cub3Svc.carregar(1);
    
    this.cub3Svc.sincronizar('MOB_REGISTRO_AULA').then(async() => {
      await this.atualizarAulas();
      this.filterTurmas();
      carregar.dismiss();
      this.cub3Svc.Toast("Registros sincronizados com sucesso!");
    }, async () => {
      await this.atualizarAulas();
      this.filterTurmas();
      carregar.dismiss();
      this.cub3Svc.Toast("Registros atualizados com sucesso!");
    });
  }

  /**
   * Inicializa os dados da turma ativa e configura o componente.
   */
  async init(): Promise<any> { 
    this.usuario = StorageUtils.getAccount(); 
    this.dados = StorageUtils.getItem("data");

    // Seleciona o dia atual
    this.diaAtual = this.weekDays.find(day => day.date.getDate() === this.currentDayDate);

    // Carrega as turmas
    const turmas = await this.cub3Svc.getTurmas();
    let disciplinas = this.dados.MOB_DISCIPLINAS || [];
    let etapas = this.dados.MOB_ETAPAS || [];
    let profDisciplinas = this.dados.MOB_PROF_DISCIPLINAS || [];
    let turmasAlunos = this.dados.MOB_TURMAS_ALUNOS || [];
  
    // Encontra a turma ativa
    let turmaAtiva = turmas.find(turma => parseInt(turma.id) === parseInt(this.turmaAtiva.IDF_TURMA));
    if (!turmaAtiva) return;
  
    this.turmaAtiva = turmaAtiva;

    // Mapeia as disciplinas da turma
    let result = profDisciplinas
      .filter(profDisciplina => parseInt(profDisciplina.IDF_TURMA) === parseInt(turmaAtiva.IDF_TURMA))
      .map(profDisciplina => {
        let disciplina = disciplinas.find(disciplina => disciplina.IDF_DISCIPLINA === profDisciplina.IDF_DISCIPLINA);
        let etapa = etapas.find(etapa => etapa.IDF_ETAPA === turmaAtiva.IDF_ETAPA);
        let qtdAlunos = turmasAlunos.filter(turmaAluno => parseInt(turmaAluno.IDF_TURMA) === parseInt(turmaAtiva.IDF_TURMA)).length;
  
        return {
          ...profDisciplina,
          NME_DISCIPLINA: disciplina ? disciplina.NME_DISCIPLINA : null,
          DES_ETAPA: etapa ? etapa.DES_ETAPA : null,
          NME_TURMA: turmaAtiva.NME_TURMA,
          TURNO: turmaAtiva.TURNO,
          qtdAlunos: qtdAlunos
        };
      });
      
    // Configura os dados da turma
    this.dados = {
      NME_DISCIPLINA: turmaAtiva.disciplinas[0] || '',
      DES_ETAPA: turmaAtiva.etapa ? turmaAtiva.etapa.DES_ETAPA : null,
      IDF_ETAPA: turmaAtiva.etapa ? turmaAtiva.etapa.IDF_ETAPA : null,
      NME_TURMA: turmaAtiva.titulo,
      TURNO: turmaAtiva.turno,
      id: turmaAtiva.id,
      avaliacoes: turmaAtiva.avaliacoes || [],
      qtdAlunos: turmaAtiva.alunos.length || 0
    };

    // Atualiza aulas e avaliações
    this.atualizarAulas();
    this.atualizarAvaliacoes();

    // Seleciona o dia atual armazenado ou o dia atual do sistema
    setTimeout(() => {
      let diaAtualStorage = StorageUtils.getItem("diaAtual");
      if(diaAtualStorage)
        this.diaAtual = {
          ...diaAtualStorage,
          date: new Date(diaAtualStorage['date'])
        };
      else
        this.diaAtual = this.weekDays.find(day => day.date.getDate() === this.currentDayDate);
      
      this.selectDay(this.diaAtual);
      this.cd.markForCheck();
    }, 1000);

    this.carregando = false;
    return result;
  }
  
  /**
   * Atualiza as aulas filtrando pela turma ativa e sincronizando com o banco de dados local.
   */
  async atualizarAulas(): Promise<void> {
    let aulas: any = await this.getAulas();
    if (!aulas) return;

    // Filtra as aulas pela turma ativa e exclui as marcadas como excluídas
    aulas = aulas.filter((aula: any) => 
      parseInt(aula.IDF_TURMA) === parseInt(this.turmaAtiva.id) && 
      aula.SIT_REGISTRO !== 'EXCLUIDO'
    );

    // Carrega registros de frequência
    const frequencias = await this.cub3Db.getStorage("MOV_REGISTRO_FREQUENCIA") || [];

    // Mapeia as frequências por IDF_AULA
    const frequenciasPorAula = frequencias.reduce((acc: any, frequencia: any) => {
      if (!acc[parseInt(frequencia.IDF_AULA)]) {
        acc[parseInt(frequencia.IDF_AULA)] = [];
      }
      acc[parseInt(frequencia.IDF_AULA)].push(frequencia);
      return acc;
    }, {});

    // Agrupa as aulas por características específicas
    const aulasAgrupadas = aulas.reduce((acc: any, aula: any) => {
      const chave = `${aula.DAT_AULA}-${aula.HOR_INICIO}-${aula.HOR_TERMINO}-${aula.IDF_PROFISSIONAL}-${aula.IDF_DISCIPLINA}`;
      if (!acc[chave]) {
        acc[chave] = {
          ...aula,
          frequencias: frequenciasPorAula[aula.IDF_AULA] || [],
          IDF_CONTEUDOS: new Set(aula.IDF_CONTEUDOS || [])
        };
        acc[chave].temFrequencia = acc[chave].frequencias.length > 0 || (aula.idfAlunoAusentes && aula.idfAlunoAusentes.length > 0);
      } else {
        // Agrega informações se mais de uma aula compartilhar a mesma chave
        acc[chave].DES_ASSUNTO = aula.DES_ASSUNTO || acc[chave].DES_ASSUNTO;
        aula.IDF_CONTEUDOS.forEach((idf: any) => acc[chave].IDF_CONTEUDOS.add(idf)); // Combina os conteúdos
        acc[chave].temFrequencia = acc[chave].temFrequencia ||
          (frequenciasPorAula[parseInt(aula.IDF_AULA)] && frequenciasPorAula[parseInt(aula.IDF_AULA)].length > 0) ||
          (aula.idfAlunoAusentes && aula.idfAlunoAusentes.length > 0);
      }
      return acc;
    }, {});

    // Converte os sets de IDF_CONTEUDOS de volta para arrays
    Object.keys(aulasAgrupadas).forEach(chave => {
      aulasAgrupadas[chave].IDF_CONTEUDOS = Array.from(aulasAgrupadas[chave].IDF_CONTEUDOS);
    });

    // Transforma o objeto de aulas agrupadas de volta para array
    this.aulas = Object.values(aulasAgrupadas);
    await this.cub3Db.setStorage("MOB_REGISTRO_AULA", this.aulas);

    this.cd.markForCheck();
  }

  /**
   * Atualiza as avaliações carregando do storage local.
   */
  atualizarAvaliacoes(): void { 
    const data = StorageUtils.getItem("data");
    if(data && data['MOB_REGISTRO_AVALIACAO']) {
      this.avaliacoes = data['MOB_REGISTRO_AVALIACAO'] || [];
    }
    this.cd.markForCheck();
  }

  /**
   * Remove uma aula específica após confirmação do usuário.
   * @param item Objeto da aula a ser removida
   */
  async removerAula(item: any): Promise<void> {
    const alert = await this.alertCtrl.create({ 
      header: 'Confirme a exclusão',
      message: 'Deseja excluir a aula selecionada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, 
        {
          text: 'Sim',
          handler: () => {
            this.cub3Db.delStorage("MOB_REGISTRO_AULA", item.IDF_AULA, 'IDF_AULA').then(async () => { 
              this.cub3Svc.alerta("Remoção da aula", "Aula removida com sucesso!");
              await this.cub3Svc.sincronizar('MOB_REGISTRO_AULA');
              this.sincronizarAulas();
            }, () => {
              this.cub3Svc.alerta("Ops!", "Não foi possível remover a aula. Tente novamente!"); 
            });
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Remove uma avaliação específica após confirmação do usuário.
   * @param item Objeto da avaliação a ser removida
   */
  async removerAvaliacao(item: any): Promise<void> {
    const alert = await this.alertCtrl.create({ 
      header: 'Confirme a exclusão',
      message: 'Deseja excluir a avaliação selecionada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, 
        {
          text: 'Sim',
          handler: () => {
            this.cub3Db.del("MOB_REGISTRO_AVALIACAO", item.id, 'id').then(() => { 
              this.cub3Svc.alerta("Remoção da avaliação", "Avaliação removida com sucesso!");
              this.atualizarAvaliacoes();
            }, () => {
              this.cub3Svc.alerta("Ops!", "Não foi possível remover a avaliação. Tente novamente!"); 
            });
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Obtém a lista de alunos da turma ativa.
   * @returns Array de alunos
   */
  getAlunosDaTurma(): any[] {
    let turmas = this.dados.MOB_TURMAS;
    let alunos = this.dados.MOB_ALUNOS;
    let turmasAlunos = this.dados.MOB_TURMAS_ALUNOS;

    let turmaAtiva = turmas.find((turma: any) => parseInt(turma.IDF_TURMA) === parseInt(this.turmaAtiva.IDF_TURMA));
    if (!turmaAtiva) return [];

    let result = turmasAlunos
      .filter((turmaAluno: any) => parseInt(turmaAluno.IDF_TURMA) === parseInt(this.turmaAtiva.IDF_TURMA))
      .map((turmaAluno: any) => {
        let aluno = alunos.find((aluno: any) => aluno.IDF_ALUNO === turmaAluno.IDF_ALUNO);
        return (aluno && aluno.IDF_ALUNO) ? aluno : null;
      })
      .filter((aluno: any) => aluno !== null) // Remove valores nulos
      .sort((a: any, b: any) => a.NME_ALUNO.localeCompare(b.NME_ALUNO));
    
    return result;
  }

  /**
   * Lista todas as turmas de todas as escolas.
   * @param escolas Array de escolas
   * @returns Array de turmas
   */
  listarTurmas(escolas: any[]): any[] {
    let turmas: any[] = [];
  
    escolas.forEach(escola => {
      escola.turmas.forEach(turma => {
        turmas.push(turma);
      });
    });
  
    return turmas;
  }

  /**
   * Inicia a turma ativa carregando seus dados.
   */
  async iniciarTurma(): Promise<void> {  
    const turmas = await this.cub3Svc.getTurmas(); 
    const turma = turmas.filter((x: any) => x.id === this.turmaAtiva.id);
    this.dados = turma; 
    this.carregando = false;
    this.cd.markForCheck(); 
  }

}
