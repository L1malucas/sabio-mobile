import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoTurmaPage } from './academico-turma.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoTurmaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoTurmaPageRoutingModule {}
