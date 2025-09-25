import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAlunosPage } from './academico-alunos.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAlunosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAlunosPageRoutingModule {}
