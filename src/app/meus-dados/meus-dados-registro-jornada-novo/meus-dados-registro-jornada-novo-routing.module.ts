import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusDadosRegistroJornadaNovoPage } from './meus-dados-registro-jornada-novo.page';

const routes: Routes = [
  {
    path: '',
    component: MeusDadosRegistroJornadaNovoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusDadosRegistroJornadaNovoPageRoutingModule {}
