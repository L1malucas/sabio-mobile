import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoTurmaNotaAlunoPage } from './academico-turma-nota-aluno.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoTurmaNotaAlunoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoTurmaNotaAlunoPageRoutingModule {}
