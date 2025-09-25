import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoFrequenciaPage } from './academico-frequencia.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoFrequenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoFrequenciaPageRoutingModule {}
