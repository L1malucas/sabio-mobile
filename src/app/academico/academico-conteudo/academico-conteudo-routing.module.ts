import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcademicoConteudoPage } from './academico-conteudo.page';

const routes: Routes = [
  {
    path: '',
    component: AcademicoConteudoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcademicoConteudoPageRoutingModule {}
