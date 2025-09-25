import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusDadosPaginaPage } from './meus-dados-pagina.page';

const routes: Routes = [
  {
    path: '',
    component: MeusDadosPaginaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusDadosPaginaPageRoutingModule {}
