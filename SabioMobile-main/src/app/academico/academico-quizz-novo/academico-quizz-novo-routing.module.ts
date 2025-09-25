import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoQuizzNovoPage } from './academico-quizz-novo.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoQuizzNovoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoQuizzNovoPageRoutingModule {}
