import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoOcorrenciaNovoPage } from './academico-ocorrencia-novo.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoOcorrenciaNovoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoOcorrenciaNovoPageRoutingModule {}
