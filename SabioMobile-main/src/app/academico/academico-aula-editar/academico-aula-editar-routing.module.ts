import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAulaEditarPage } from './academico-aula-editar.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAulaEditarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAulaEditarPageRoutingModule {}
