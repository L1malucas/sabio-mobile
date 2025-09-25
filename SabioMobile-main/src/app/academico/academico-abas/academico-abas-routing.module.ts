import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcademicoAbasPage } from './academico-abas.page';

const routes: Routes = [
  {
    path: 'academico-abas',
    component: AcademicoAbasPage,
    children: [
      {
        path: 'academico-aba1',
        loadChildren: () => import('../academico-aba1/academico-aba1.module').then(m => m.AcademicoAba1PageModule)
      },
      {
        path: 'academico-aba2',
        loadChildren: () => import('../academico-aba2/academico-aba2.module').then(m => m.AcademicoAba2PageModule)
      },
      {
        path: 'academico-aba3',
        loadChildren: () => import('../academico-aba3/academico-aba3.module').then(m => m.AcademicoAba3PageModule)
      },
      {
        path: 'academico-aba4',
        loadChildren: () => import('../academico-aba4/academico-aba4.module').then(m => m.AcademicoAba4PageModule)
      },
      {
        path: '',
        redirectTo: '/app/home/academico/academico-abas/academico-aba1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/app/home/academico/academico-abas/academico-aba1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademicoAbasPageRoutingModule {}
