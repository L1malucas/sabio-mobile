import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAulaNovoPage } from './academico-aula-novo.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAulaNovoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAulaNovoPageRoutingModule {}
