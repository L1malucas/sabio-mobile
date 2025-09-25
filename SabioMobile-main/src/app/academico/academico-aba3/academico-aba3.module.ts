import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicoAba3Page } from './academico-aba3.page';
import { AcademicoAbasContainerComponentModule } from '../academico-abas-container/academico-abas-container.module';

import { AcademicoAba3PageRoutingModule } from './academico-aba3-routing.module';
import {Cub3Module } from "@cub3/cub3.module";


@NgModule({
  imports: [
    IonicModule,
    Cub3Module,
    CommonModule,
    FormsModule,
    AcademicoAbasContainerComponentModule,
    RouterModule.forChild([{ path: '', component: AcademicoAba3Page }]),
    AcademicoAba3PageRoutingModule,
  ],
  declarations: [AcademicoAba3Page]
})
export class AcademicoAba3PageModule {}
