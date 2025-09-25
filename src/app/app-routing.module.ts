import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { Cub3AuthGuard } from './cub3/cub3-svc/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'app',
    children: [{
        path: 'home',
        children: [{
          path: 'academico',
          loadChildren: () => import('./academico/academico-abas/academico-abas.module').then(m => m.AcademicoAbasPageModule)
        }]
      },
      {
        path: 'ajustes',
        loadChildren: () => import('./ajustes/ajustes.module').then( m => m.AjustesPageModule)
      },
      {
        path: 'notificacoes',
        loadChildren: () => import('./notificacoes/notificacoes.module').then( m => m.NotificacoesPageModule)
      }, 
      {
        path: 'meus-dados',
        children: [
          {
            path: '',
            loadChildren: () => import('./meus-dados/meus-dados-pagina/meus-dados-pagina.module').then( m => m.MeusDadosPaginaPageModule)
          },{
            path: 'meus-dados-escolas',
            loadChildren: () => import('./meus-dados/meus-dados-escolas/meus-dados-escolas.module').then( m => m.MeusDadosEscolasPageModule)
          },
          {
            path: 'meus-dados-disciplinas',
            loadChildren: () => import('./meus-dados/meus-dados-disciplinas/meus-dados-disciplinas.module').then( m => m.MeusDadosDisciplinasPageModule)
          },
          {
            path: 'meus-dados-frequencia',
            loadChildren: () => import('./meus-dados/meus-dados-frequencia/meus-dados-frequencia.module').then( m => m.MeusDadosFrequenciaPageModule)
          },
          {
            path: 'meus-dados-registro-jornada',
            loadChildren: () => import('./meus-dados/meus-dados-registro-jornada/meus-dados-registro-jornada.module').then( m => m.MeusDadosRegistroJornadaPageModule)
          },
          {
            path: 'meus-dados-registro-jornada-novo',
            loadChildren: () => import('./meus-dados/meus-dados-registro-jornada-novo/meus-dados-registro-jornada-novo.module').then( m => m.MeusDadosRegistroJornadaNovoPageModule)
          },
        ]
      }, 
      {
        path: 'academico',
        children: [
          {
            path: 'academico-atividade-visualizar/:id',
            loadChildren: () => import('./academico/academico-atividade-visualizar/academico-atividade-visualizar.module').then( m => m.AcademicoAtividadeVisualizarPageModule)
          },
          {
            path: 'academico-atividade-novo',
            loadChildren: () => import('./academico/academico-atividade-novo/academico-atividade-novo.module').then( m => m.AcademicoAtividadeNovoPageModule)
          },
          {
            path: 'academico-atividade-editar/:id',
            loadChildren: () => import('./academico/academico-atividade-novo/academico-atividade-novo.module').then( m => m.AcademicoAtividadeNovoPageModule)
          },
          {
            path: 'academico-atividades',
            loadChildren: () => import('./academico/academico-atividades/academico-atividades.module').then( m => m.AcademicoAtividadesPageModule)
          },
          {
            path: 'academico-quiz-novo',
            loadChildren: () => import('./academico/academico-quizz-novo/academico-quizz-novo.module').then( m => m.AcademicoQuizzNovoPageModule)
          },
          {
            path: 'academico-quiz-visualizar/:id',
            loadChildren: () => import('./academico/academico-quizz-visualizar/academico-quizz-visualizar.module').then( m => m.AcademicoQuizzVisualizarPageModule)
          }, 
          {
            path: 'academico-quiz-editar/:id',
            loadChildren: () => import('./academico/academico-quizz-novo/academico-quizz-novo.module').then( m => m.AcademicoQuizzNovoPageModule)
          },
          {
            path: 'academico-quiz-pergunta/:id',
            loadChildren: () => import('./academico/academico-quiz-pergunta/academico-quiz-pergunta.module').then( m => m.AcademicoQuizPerguntaPageModule)
          },
          {
            path: 'academico-quizz',
            loadChildren: () => import('./academico/academico-quizz/academico-quizz.module').then( m => m.AcademicoQuizzPageModule)
          }, 
          {
            path: 'academico-avaliacao-novo/:id',
            loadChildren: () => import('./academico-avaliacao-novo/academico-avaliacao-novo.module').then( m => m.AcademicoAvaliacaoNovoPageModule)
          },
          {
            path: 'academico-avaliacao-visualizar/:id/:idAula',
            loadChildren: () => import('./academico-avaliacao-visualizar/academico-avaliacao-visualizar.module').then( m => m.AcademicoAvaliacaoVisualizarPageModule)
          },
          {
            path: 'academico-conteudo',
            loadChildren: () => import('./academico/academico-conteudo/academico-conteudo.module').then( m => m.AcademicoConteudoPageModule)
          },
          {
            path: 'academico-etapas',
            loadChildren: () => import('./academico/academico-etapas/academico-etapas.module').then( m => m.AcademicoEtapasPageModule)
          },  {
            path: 'academico-ocorrencias',
            loadChildren: () => import('./academico/academico-ocorrencias/academico-ocorrencias.module').then( m => m.AcademicoOcorrenciasPageModule)
          },
          {
            path: 'academico-ocorrencia-novo',
            loadChildren: () => import('./academico/academico-ocorrencia-novo/academico-ocorrencia-novo.module').then( m => m.AcademicoOcorrenciaNovoPageModule)
          },
          {
            path: 'academico-ocorrencia/:id',
            loadChildren: () => import('./academico/academico-ocorrencia/academico-ocorrencia.module').then( m => m.AcademicoOcorrenciaPageModule)
          },{
            path: 'academico-acompanhamentos/:alunoId',
            loadChildren: () => import('./academico/academico-acompanhamentos/academico-acompanhamentos.module').then( m => m.AcademicoAcompanhamentosPageModule)
          },
          {
            path: 'academico-acompanhamento-novo/:alunoId',
            loadChildren: () => import('./academico/academico-acompanhamento-novo/academico-acompanhamento-novo.module').then( m => m.AcademicoAcompanhamentoNovoPageModule)
          },
          {
            path: 'academico-acompanhamento/:alunoId/:id',
            loadChildren: () => import('./academico/academico-acompanhamento/academico-acompanhamento.module').then( m => m.AcademicoAcompanhamentoPageModule)
          },
          {
            path: 'academico-horarios',
            loadChildren: () => import('./academico/academico-horarios/academico-horarios.module').then( m => m.AcademicoHorariosPageModule)
          },
          {
            path: 'academico-imc',
            loadChildren: () => import('./academico/academico-imc/academico-imc.module').then( m => m.AcademicoImcPageModule)
          },
          {
            path: 'sincronizacao',
            loadChildren: () => import('./sincronizacao/sincronizacao.module').then( m => m.SincronizacaoPageModule)
          },
          {
            path: 'academico-turmas',
            loadChildren: () => import('./academico/academico-turmas/academico-turmas.module').then( m => m.AcademicoTurmasPageModule)
          },
          {
            path: 'academico-turma/:id',
            loadChildren: () => import('./academico/academico-turma/academico-turma.module').then( m => m.AcademicoTurmaPageModule)
          }, 
          {
            path: 'academico-planos-ensino',
            loadChildren: () => import('./academico/academico-planos-ensino/academico-planos-ensino.module').then( m => m.AcademicoPlanosEnsinoPageModule)
          },
          {
            path: 'academico-plano-ensino/:id',
            loadChildren: () => import('./academico/academico-plano-ensino/academico-plano-ensino.module').then( m => m.AcademicoPlanoEnsinoPageModule)
          }, 
          {
            path: 'academico-aula-novo/:id',
            loadChildren: () => import('./academico/academico-aula-novo/academico-aula-novo.module').then( m => m.AcademicoAulaNovoPageModule)
          },
          {
            path: 'academico-aula-editar/:id',
            loadChildren: () => import('./academico/academico-aula-editar/academico-aula-editar.module').then( m => m.AcademicoAulaEditarPageModule)
          },
          {
            path: 'academico-aluno',
            loadChildren: () => import('./academico/academico-aluno/academico-aluno.module').then( m => m.AcademicoAlunoPageModule)
          },
          {
            path: 'academico-frequencia/:id/:idAula',
            loadChildren: () => import('./academico/academico-frequencia/academico-frequencia.module').then( m => m.AcademicoFrequenciaPageModule)
          },
          {
            path: 'academico-notas',
            loadChildren: () => import('./academico/academico-notas/academico-notas.module').then( m => m.AcademicoNotasPageModule)
          },
          {
            path: 'academico-turma-nota-aluno/:aluno',
            loadChildren: () => import('./academico/academico-turma-nota-aluno/academico-turma-nota-aluno.module').then( m => m.AcademicoTurmaNotaAlunoPageModule)
          },
          {
            path: 'academico-turma-nota-alunos/:id/:idAvaliacao',
            loadChildren: () => import('./academico/academico-turma-nota-alunos/academico-turma-nota-alunos.module').then( m => m.AcademicoTurmaNotaAlunosPageModule)
          },
          {
            path: 'academico-turma-nota-disciplina',
            loadChildren: () => import('./academico/academico-turma-nota-disciplina/academico-turma-nota-disciplina.module').then( m => m.AcademicoTurmaNotaDisciplinaPageModule)
          },
          {
            path: 'academico-turma-nota-etapa',
            loadChildren: () => import('./academico/academico-turma-nota-etapa/academico-turma-nota-etapa.module').then( m => m.AcademicoTurmaNotaEtapaPageModule)
          },
          {
            path: 'academico-alunos-por-turma',
            loadChildren: () => import('./academico/academico-alunos-por-turma/academico-alunos-por-turma.module').then( m => m.AcademicoAlunosPorTurmaPageModule)
          }
        ]
      },
    ],
    canActivate: [Cub3AuthGuard]
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
