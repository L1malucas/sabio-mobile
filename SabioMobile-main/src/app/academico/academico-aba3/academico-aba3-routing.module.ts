import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicoAba3Page } from './academico-aba3.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoAba3Page,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicoAba3PageRoutingModule {}
