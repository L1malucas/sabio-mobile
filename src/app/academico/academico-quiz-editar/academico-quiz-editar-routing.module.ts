import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoQuizEditarPage } from './academico-quiz-editar.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoQuizEditarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoQuizEditarPageRoutingModule {}
