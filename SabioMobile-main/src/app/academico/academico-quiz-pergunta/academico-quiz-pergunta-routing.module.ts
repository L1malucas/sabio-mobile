import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoQuizPerguntaPage } from './academico-quiz-pergunta.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoQuizPerguntaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoQuizPerguntaPageRoutingModule {}
