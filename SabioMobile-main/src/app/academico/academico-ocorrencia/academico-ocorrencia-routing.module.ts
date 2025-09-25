import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoOcorrenciaPage } from './academico-ocorrencia.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoOcorrenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoOcorrenciaPageRoutingModule {}
