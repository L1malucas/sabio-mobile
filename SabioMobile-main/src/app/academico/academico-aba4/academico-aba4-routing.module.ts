import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicoAba4Page } from './academico-aba4.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAba4Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicoAba4PageRoutingModule {}
