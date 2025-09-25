import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusDadosDisciplinasPageRoutingModule } from './meus-dados-disciplinas-routing.module';

import { MeusDadosDisciplinasPage } from './meus-dados-disciplinas.page';
import {Cub3Module} from "@cub3/cub3.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    MeusDadosDisciplinasPageRoutingModule
  ],
  declarations: [MeusDadosDisciplinasPage]
})
export class MeusDadosDisciplinasPageModule {}
