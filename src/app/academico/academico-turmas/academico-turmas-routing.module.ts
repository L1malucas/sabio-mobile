import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoTurmasPage } from './academico-turmas.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoTurmasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoTurmasPageRoutingModule {}
