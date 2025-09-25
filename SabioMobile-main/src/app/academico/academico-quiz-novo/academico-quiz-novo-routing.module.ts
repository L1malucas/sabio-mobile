import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoQuizNovoPage } from './academico-quiz-novo.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoQuizNovoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoQuizNovoPageRoutingModule {}
