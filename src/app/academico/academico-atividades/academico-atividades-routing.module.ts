import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoAtividadesPage } from './academico-atividades.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAtividadesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoAtividadesPageRoutingModule {}
