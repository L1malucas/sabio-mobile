import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoTurmasPageRoutingModule } from './academico-turmas-routing.module';

import { AcademicoTurmasPage } from './academico-turmas.page';
import {Cub3Module} from '@cub3/cub3.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    AcademicoTurmasPageRoutingModule
  ],
  declarations: [AcademicoTurmasPage]
})
export class AcademicoTurmasPageModule {}
