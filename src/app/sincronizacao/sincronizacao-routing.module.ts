import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SincronizacaoPage } from './sincronizacao.page';

const routes: Routes = [
  {
    path: '',
    component: SincronizacaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SincronizacaoPageRoutingModule {}
