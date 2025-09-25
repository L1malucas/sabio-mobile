import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoQuizzVisualizarPageRoutingModule } from './academico-quizz-visualizar-routing.module';

import { AcademicoQuizzVisualizarPage } from './academico-quizz-visualizar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoQuizzVisualizarPageRoutingModule
  ],
  declarations: [AcademicoQuizzVisualizarPage]
})
export class AcademicoQuizzVisualizarPageModule {}
