import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoNotasPageRoutingModule } from './academico-notas-routing.module';

import { AcademicoNotasPage } from './academico-notas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoNotasPageRoutingModule
  ],
  declarations: [AcademicoNotasPage]
})
export class AcademicoNotasPageModule {}
