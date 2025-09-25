import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoPlanosEnsinoPage } from './academico-planos-ensino.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoPlanosEnsinoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoPlanosEnsinoPageRoutingModule {}
