import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusDadosRegistroJornadaPage } from './meus-dados-registro-jornada.page';

const routes: Routes = [
  {
    path: '',
    component: MeusDadosRegistroJornadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusDadosRegistroJornadaPageRoutingModule {}
