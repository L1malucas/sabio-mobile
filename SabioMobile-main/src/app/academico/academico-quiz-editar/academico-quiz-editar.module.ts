import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoQuizEditarPageRoutingModule } from './academico-quiz-editar-routing.module';

import { AcademicoQuizEditarPage } from './academico-quiz-editar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoQuizEditarPageRoutingModule
  ],
  declarations: [AcademicoQuizEditarPage]
})
export class AcademicoQuizEditarPageModule {}
