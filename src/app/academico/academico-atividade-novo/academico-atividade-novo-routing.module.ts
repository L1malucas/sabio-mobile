import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAtividadeNovoPage } from './academico-atividade-novo.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAtividadeNovoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAtividadeNovoPageRoutingModule {}
