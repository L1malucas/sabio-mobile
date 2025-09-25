import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AcademicoAbasPageRoutingModule } from './academico-abas-routing.module';

import { AcademicoAbasPage } from './academico-abas.page';
import {Cub3Module } from "@cub3/cub3.module";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Cub3Module,
    AcademicoAbasPageRoutingModule
  ],
  declarations: [AcademicoAbasPage]
})
export class AcademicoAbasPageModule {}
