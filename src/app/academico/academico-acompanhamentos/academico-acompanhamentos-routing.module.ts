import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAcompanhamentosPage } from './academico-acompanhamentos.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAcompanhamentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAcompanhamentosPageRoutingModule {}
