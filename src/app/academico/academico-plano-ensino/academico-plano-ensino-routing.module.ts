import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoPlanoEnsinoPage } from './academico-plano-ensino.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoPlanoEnsinoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoPlanoEnsinoPageRoutingModule {}
