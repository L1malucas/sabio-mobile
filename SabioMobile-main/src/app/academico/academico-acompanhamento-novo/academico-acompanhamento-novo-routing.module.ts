import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAcompanhamentoNovoPage } from './academico-acompanhamento-novo.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAcompanhamentoNovoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAcompanhamentoNovoPageRoutingModule {}
