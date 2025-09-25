import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAlunosPorTurmaPage } from './academico-alunos-por-turma.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAlunosPorTurmaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAlunosPorTurmaPageRoutingModule {}
