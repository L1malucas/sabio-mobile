import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoImcPage } from './academico-imc.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoImcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoImcPageRoutingModule {}
