import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusDadosEscolasPageRoutingModule } from './meus-dados-escolas-routing.module';

import { MeusDadosEscolasPage } from './meus-dados-escolas.page';
import {Cub3Module} from "@cub3/cub3.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Cub3Module,
    MeusDadosEscolasPageRoutingModule
  ],
  declarations: [MeusDadosEscolasPage]
})
export class MeusDadosEscolasPageModule {}
