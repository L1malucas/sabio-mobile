import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeusDadosRegistroJornadaPageRoutingModule } from './meus-dados-registro-jornada-routing.module';

import { MeusDadosRegistroJornadaPage } from './meus-dados-registro-jornada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MeusDadosRegistroJornadaPageRoutingModule
  ],
  declarations: [MeusDadosRegistroJornadaPage]
})
export class MeusDadosRegistroJornadaPageModule {}
