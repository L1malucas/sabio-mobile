import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoTurmaNotaEtapaPageRoutingModule } from './academico-turma-nota-etapa-routing.module';

import { AcademicoTurmaNotaEtapaPage } from './academico-turma-nota-etapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoTurmaNotaEtapaPageRoutingModule
  ],
  declarations: [AcademicoTurmaNotaEtapaPage]
})
export class AcademicoTurmaNotaEtapaPageModule {}
