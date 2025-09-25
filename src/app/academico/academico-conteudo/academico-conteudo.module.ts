import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoConteudoPageRoutingModule } from './academico-conteudo-routing.module';

import { AcademicoConteudoPage } from './academico-conteudo.page';
import {Cub3Module} from '@cub3/cub3.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    AcademicoConteudoPageRoutingModule
  ],
  declarations: [AcademicoConteudoPage]
})
export class AcademicoConteudoPageModule {}
