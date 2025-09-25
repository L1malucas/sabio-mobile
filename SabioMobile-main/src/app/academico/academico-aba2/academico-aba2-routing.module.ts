import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicoAba2Page } from './academico-aba2.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAba2Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicoAba2PageRoutingModule {}
