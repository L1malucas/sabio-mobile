import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAtividadePage } from './academico-atividade.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAtividadePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAtividadePageRoutingModule {}
