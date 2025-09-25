import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeusDadosDisciplinasPage } from './meus-dados-disciplinas.page';

const routes: Routes = [
  {
    path: '',
    component: MeusDadosDisciplinasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeusDadosDisciplinasPageRoutingModule {}
