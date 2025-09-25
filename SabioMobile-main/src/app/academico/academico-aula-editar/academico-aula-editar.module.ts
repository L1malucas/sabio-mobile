import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoAulaEditarPageRoutingModule } from './academico-aula-editar-routing.module';

import { AcademicoAulaEditarPage } from './academico-aula-editar.page';
import {Cub3Module} from '@cub3/cub3.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Cub3Module,
    IonicModule,
    AcademicoAulaEditarPageRoutingModule
  ],
  declarations: [AcademicoAulaEditarPage]
})
export class AcademicoAulaEditarPageModule {}
