import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoQuizzPage } from './academico-quizz.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoQuizzPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoQuizzPageRoutingModule {}
