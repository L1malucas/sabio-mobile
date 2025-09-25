import { Component } from '@angular/core';

@Component({
  selector: 'app-academico-aba2',
  templateUrl: 'academico-aba2.page.html',
  styleUrls: ['academico-aba2.page.scss']
})
export class AcademicoAba2Page {

	menu:any = [];
  constructor() {
    // this.menu.push({
    //   'label': 'Atividades',
    //   'icone': 'bookmarks-outline',
    //   'link': '/app/academico/academico-atividades',
    //   'descricao': 'Criação e visualização de quizz'
    // });
    // this.menu.push({
    //   'label': 'Acompanhamento pedagógico',
	//   // Icone de acompanhamento pedagógico
    //   'icone': 'git-pull-request-outline',
    //   'link': '/app/academico/academico-acompanhamentos',
    //   'descricao': 'Observações pedagógicas'
    // });
  	this.menu.push({
		'label': 'Alunos por turma',
		'icone': 'people-outline',
		'link': '/app/academico/academico-alunos-por-turma',
		'descricao': 'Listagem de conteúdo'
	});
    this.menu.push({
      'label': 'Conteúdo Programático',
      'icone': 'document-outline',
      'link': '/app/academico/academico-conteudo',
      'descricao': 'Listagem de conteúdo'
    });
    // this.menu.push({
    //   'label': 'Quizzes',
    //   'icone': 'git-pull-request-outline',
    //   'link': '/app/academico/academico-quizz',
    //   'descricao': 'Criação e visualização de quizz'
    // });

    // this.menu.push({
    //   'label': 'Plano de ensino',
    //   'icone': 'create-outline',
    //   'link': '/app/academico/academico-planos-ensino',
    //   'descricao': 'Listagem de planos de ensino'
    // });
  	// this.menu.push({
  	// 	'label': 'Etapas / Séries',
  	// 	'icone': 'albums-outline',
  	// 	'link': '/app/academico/academico-etapas',
  	// 	'descricao': 'Listagem de etapas'
  	// });
  	// this.menu.push({
  	// 	'label': 'Turmas',
  	// 	'icone': 'bookmarks-outline',
  	// 	'link': '/app/academico/academico-turmas',
  	// 	'descricao': 'Listagem de turmas'
  	// });
  	this.menu.push({
  		'label': 'Quadro de horários',
  		'icone': 'calendar-outline',
  		'link': '/app/academico/academico-horarios',
  		'descricao': 'Listagem de conteúdo'
  	});
  	this.menu.push({
  		'label': 'Registro de ocorrências',
  		'icone': 'clipboard-outline',
  		'link': '/app/academico/academico-ocorrencias',
  		'descricao': 'Listagem de conteúdo'
  	});
  	// this.menu.push({
  	// 	'label': 'Cálculo de I.M.C',
  	// 	'icone': 'calculator-outline',
  	// 	'link': '/app/academico/academico-imc',
  	// 	'descricao': 'Ferramenta'
  	// });
  }

}
