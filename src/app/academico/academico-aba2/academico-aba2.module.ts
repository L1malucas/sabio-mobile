import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicoAba2Page } from './academico-aba2.page';
import { AcademicoAbasContainerComponentModule } from '../academico-abas-container/academico-abas-container.module';

import { AcademicoAba2PageRoutingModule } from './academico-aba2-routing.module';
import {Cub3Module } from "@cub3/cub3.module";


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    Cub3Module,
    FormsModule,
    AcademicoAbasContainerComponentModule,
    AcademicoAba2PageRoutingModule
  ],
  declarations: [AcademicoAba2Page]
})
export class AcademicoAba2PageModule {}
