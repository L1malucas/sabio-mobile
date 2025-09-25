import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusDadosFrequenciaPage } from './meus-dados-frequencia.page';

const routes: Routes = [
  {
    path: '',
    component: MeusDadosFrequenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusDadosFrequenciaPageRoutingModule {}
