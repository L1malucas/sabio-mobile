import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAbasContainerComponent } from './academico-abas-container.component';
import {Cub3Module } from "@cub3/cub3.module";


@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, Cub3Module],
  declarations: [AcademicoAbasContainerComponent],
  exports: [AcademicoAbasContainerComponent]
})
export class AcademicoAbasContainerComponentModule {}
