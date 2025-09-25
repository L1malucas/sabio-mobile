import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAtividadeVisualizarPage } from './academico-atividade-visualizar.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAtividadeVisualizarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAtividadeVisualizarPageRoutingModule {}
