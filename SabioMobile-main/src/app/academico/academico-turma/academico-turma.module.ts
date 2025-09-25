import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActionSheetController, IonicModule } from '@ionic/angular';

import { AcademicoTurmaPageRoutingModule } from './academico-turma-routing.module';

import { AcademicoTurmaPage } from './academico-turma.page';
import {Cub3Module} from '@cub3/cub3.module';
import {MomentModule} from "ngx-moment";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    IonicModule,
    Cub3Module, 
    AcademicoTurmaPageRoutingModule
  ],
  declarations: [AcademicoTurmaPage]
})
export class AcademicoTurmaPageModule {}
