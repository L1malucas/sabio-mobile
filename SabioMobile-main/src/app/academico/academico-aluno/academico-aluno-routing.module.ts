import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAlunoPage } from './academico-aluno.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAlunoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAlunoPageRoutingModule {}
