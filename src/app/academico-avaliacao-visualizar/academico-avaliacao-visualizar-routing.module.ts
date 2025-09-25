import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAvaliacaoVisualizarPage } from './academico-avaliacao-visualizar.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAvaliacaoVisualizarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAvaliacaoVisualizarPageRoutingModule {}
