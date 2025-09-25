import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoTurmaNotaEtapaPage } from './academico-turma-nota-etapa.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoTurmaNotaEtapaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoTurmaNotaEtapaPageRoutingModule {}
