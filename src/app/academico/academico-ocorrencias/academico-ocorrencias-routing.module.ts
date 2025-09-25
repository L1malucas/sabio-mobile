import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoOcorrenciasPage } from './academico-ocorrencias.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoOcorrenciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoOcorrenciasPageRoutingModule {}
