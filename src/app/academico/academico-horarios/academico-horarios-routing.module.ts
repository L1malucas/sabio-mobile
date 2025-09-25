import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoHorariosPage } from './academico-horarios.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoHorariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoHorariosPageRoutingModule {}
