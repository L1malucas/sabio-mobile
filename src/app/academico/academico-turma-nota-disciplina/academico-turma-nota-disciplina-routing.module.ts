import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoTurmaNotaDisciplinaPage } from './academico-turma-nota-disciplina.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoTurmaNotaDisciplinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoTurmaNotaDisciplinaPageRoutingModule {}
