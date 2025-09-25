import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicoAba1Page } from './academico-aba1.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAba1Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicoAba1PageRoutingModule {}
