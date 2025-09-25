/**
 * @file academico-frequencia.page.ts
 * @description Componente para gerenciamento de frequência dos alunos em uma aula específica.
 * @autor Gustavo Aguiar - gustavo@cub3.com.br
 */

import { 
    Component, 
    OnInit, 
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
  
  // Bibliotecas Externas
  import * as moment from 'moment';
  
  @Component({
    selector: 'app-academico-frequencia',
    templateUrl: './academico-frequencia.page.html',
    styleUrls: ['./academico-frequencia.page.scss'],
  })
  export class AcademicoFrequenciaPage implements OnInit {
  
    // Dados da Turma e Aula
    turma: any = { aulas: [], IDF_TURMA: null };
    aula: any;
    turmaAtiva: any = {};
    dados: any = {};
    
    // Dados de Registro de Aula e Frequência
    data: any = {
      MOB_REGISTRO_AULA: []
    };
    
    // Indicadores de Carregamento e Modo de Exibição
    carregando: boolean = true;
    modoExibicao: string = 'Slides'; 
  
    // Referência aos Slides do Ionic
    @ViewChild(IonSlides) slides: IonSlides;
  
    /**
     * Construtor para injeção de dependências.
     * @param cub3Db Provedor de Banco de Dados Cub3
     * @param navCtrl Controlador de Navegação
     * @param cub3Svc Serviço customizado Cub3
     * @param location Serviço de localização
     * @param route Rota ativa
     * @param router Roteador para navegação
     * @param alertCtrl Controlador de Alertas
     */
    constructor(
      private cub3Db: Cub3DbProvider,
      private navCtrl: NavController,
      public cub3Svc: Cub3SvcProvider,
      private location: Location,
      private route: ActivatedRoute,
      private router: Router,
      private alertCtrl: AlertController
    ) { }
  
    /**
     * Inicialização do componente.
     */
    ngOnInit(): void {
      // Observa mudanças na URL da rota
      this.route.url.subscribe(() => {  
        const turmaId = this.route.snapshot.params.id;
        const aulaId = this.route.snapshot.params.idAula;
  
        if (turmaId && turmaId !== 'undefined') {
          this.turma.IDF_TURMA = turmaId;
          this.turma.IDF_AULA = aulaId;
          this.init();
        } else {
          this.location.back();
        }
      }); 
    }
  
    /**
     * Inicializa os dados da turma e da aula.
     */
    async init(): Promise<void> {
      // Recupera dados armazenados localmente
      this.data = StorageUtils.getItem("data");
      this.carregando = true;
  
      // Obtém todas as turmas disponíveis
      const turmas = await this.cub3Svc.getTurmas();
      const aulas = await this.cub3Db.getStorage("MOB_REGISTRO_AULA");
  
      // Encontra a turma ativa com base no ID fornecido
      this.turmaAtiva = turmas.find(turma => turma.id == this.turma.IDF_TURMA);
  
      // Encontra a aula específica dentro das aulas registradas
      this.aula = aulas.find(aula => aula.IDF_AULA == this.turma.IDF_AULA);
      console.log(this.turma.aulas);
      this.carregando = false;
  
      // Obtém e processa a lista de alunos da turma
      this.getAlunos();
    }
  
    /**
     * Obtém a lista de alunos da turma e atualiza seu status de frequência.
     */
    async getAlunos(): Promise<void> {
      console.log("Obtendo alunos", this.turma);
      this.carregando = true;
  
      // Recupera registros de frequência e aulas armazenadas
      const movLancamento = await this.cub3Db.getStorage("MOV_REGISTRO_FREQUENCIA");
      const aulas = await this.cub3Db.getStorage("MOB_REGISTRO_AULA");
      const aulaAtual = aulas.find(aula => parseInt(aula.IDF_AULA) === parseInt(this.turma.IDF_AULA));
  
      // Mapeia os alunos da turma ativa para incluir seu status de frequência
      this.dados.alunos = this.turmaAtiva.alunos.map(aluno => {
        const avaliacaoAluno = movLancamento.find(registro =>
          parseInt(registro.IDF_ALUNO) === parseInt(aluno.id) && 
          parseInt(registro.IDF_AULA) === parseInt(this.turma.IDF_AULA) && 
          registro.SIT_ALUNO !== 'PRESENTE'
        );
  
        console.log("Aluno verificado", avaliacaoAluno);
  
        if (avaliacaoAluno) {
          aluno.SIT_ALUNO = avaliacaoAluno.SIT_ALUNO;
        } else {
          if (this.aula && this.aula.IDF_ALUNO_AUSENTES && this.aula.IDF_ALUNO_AUSENTES.includes(`${aluno.id}`)) {
            aluno.SIT_ALUNO = 'AUSENTE';
          } else {
            // Verifica aulas alternativas no mesmo dia para determinar presença
            let aulaAlternativa = aulas.find(aula =>
              moment.utc(aula.DAT_AULA).format("YYYY-MM-DD") === moment.utc(aulaAtual.DAT_AULA).format("YYYY-MM-DD") && 
              parseInt(aula.IDF_TURMA) === parseInt(aulaAtual.IDF_TURMA)
            );
  
            console.log("Buscando aula alternativa", [aulas, aulaAtual]);
  
            if (
              (aulaAlternativa && aulaAlternativa.IDF_ALUNO_AUSENTES && 
                aulaAlternativa.IDF_ALUNO_AUSENTES.includes(`${aluno.id}`)) ||
              (aulaAlternativa && aulaAlternativa.frequencias && 
                aulaAlternativa.frequencias.some(f => parseInt(f.IDF_ALUNO) === parseInt(aluno.id) && f.SIT_ALUNO !== 'PRESENTE'))
            ) {
              aluno.SIT_ALUNO = 'AUSENTE';
            } else {
              aluno.SIT_ALUNO = 'PRESENTE'; // Define como presente se nenhuma informação for encontrada
            }
          }
        }
  
        return aluno;
      });
  
      console.log(this.dados.alunos);
      console.log("Aula", this.aula);
      this.carregando = false;
    }
  
    /**
     * Alterna o modo de exibição entre 'Slides' e 'Lista'.
     */
    revisarChamada(): void {
      this.modoExibicao = this.modoExibicao === 'Slides' ? 'Lista' : 'Slides';
    }
  
    /**
     * Define o status de frequência de um aluno e avança para o próximo aluno ou revisa a chamada.
     * @param item Objeto do aluno
     * @param val Valor do status de frequência
     * @param index Índice do aluno na lista
     */
    setFreq(item: any, val: any, index: number): void {
      this.dados.alunos[index].SIT_ALUNO = val;
  
      if (index < this.dados.alunos.length - 1) {
        this.slides.slideTo(index + 1, 500);
      } else {
        this.revisarChamada();
      }
    }
  
    /**
     * Finaliza a chamada registrando as frequências dos alunos.
     */
    async finalizarChamada(): Promise<void> {
      const carregar = await this.cub3Svc.carregar(1);
  
      let nFrequentes = 0;
      let dados: any[] = [];
  
      // Itera sobre os alunos para registrar suas frequências
      for (let i = 0; i < this.dados.alunos.length; i++) {
        const aluno = this.dados.alunos[i];
        if (aluno && aluno.SIT_ALUNO != undefined && aluno.SIT_ALUNO != null) {
          nFrequentes++;
          let aux = {
            IDF_FREQUENCIA: Math.floor(Math.random() * 1000) + 1,
            IDF_AULA: this.turma.IDF_AULA,
            IDF_ALUNO: aluno.id,
            SIT_ALUNO: aluno.SIT_ALUNO
          };
  
          // **Alteração Importante:** Armazena registros de frequência para todos os alunos,
          // independentemente de estarem presentes ou ausentes.
          // Isso garante que a flag 'temFrequencia' seja definida corretamente no componente 'academico-turma'.
          dados.push(aux);
        }
      }
  
      // Verifica se todas as frequências foram registradas
      if (nFrequentes === this.dados.alunos.length) {
        let frequencias = await this.cub3Db.getStorage("MOV_REGISTRO_FREQUENCIA");
        
        // Remove registros de frequência duplicados ou conflitantes
        let registrosRemovidos = frequencias.filter(f => 
          parseInt(f.IDF_AULA) === parseInt(this.turma.IDF_AULA) && 
          dados.some(d => parseInt(d.IDF_ALUNO) === parseInt(f.IDF_ALUNO))
        );
        console.log("Frequencias eliminadas", registrosRemovidos);
    
        // Filtra os registros removidos
        frequencias = frequencias.filter(f => 
          !(parseInt(f.IDF_AULA) === parseInt(this.turma.IDF_AULA) && 
            dados.some(d => parseInt(d.IDF_ALUNO) === parseInt(f.IDF_ALUNO)))
        );
  
        // **Alteração Importante:** Adiciona todos os registros de frequência, incluindo 'PRESENTE' e 'AUSENTE'
        frequencias = [...frequencias, ...dados];
        await this.cub3Db.setStorage("MOV_REGISTRO_FREQUENCIA", frequencias);
  
        let nAdd = dados.length;
        if (nAdd === dados.length) {
          this.cub3Svc.sincronizar('MOB_REGISTRO_AULA').then(() => {
            carregar.dismiss();
            this.cub3Svc.alerta("Registro de frequência", "Registro sincronizado com sucesso!");
            this.navCtrl.pop();
          }, (err) => {
            console.log("Erro freq", err);
            carregar.dismiss();
            this.cub3Svc.alerta("Registro de frequência", "Registro atualizado com sucesso!");
            this.navCtrl.pop();
          });
        }
      } else {
        carregar.dismiss();
        this.cub3Svc.alerta("Frequência incompleta", "Por favor, verifique se todos os alunos foram marcados com presença ou falta.");
      }
    }
  
  }
  