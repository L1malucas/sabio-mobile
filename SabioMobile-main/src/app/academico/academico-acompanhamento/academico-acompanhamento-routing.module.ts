import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAcompanhamentoPage } from './academico-acompanhamento.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAcompanhamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAcompanhamentoPageRoutingModule {}
