import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusDadosEscolasPage } from './meus-dados-escolas.page';

const routes: Routes = [
  {
    path: '',
    component: MeusDadosEscolasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusDadosEscolasPageRoutingModule {}
