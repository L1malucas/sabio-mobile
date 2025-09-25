import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoEtapasPage } from './academico-etapas.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoEtapasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoEtapasPageRoutingModule {}
