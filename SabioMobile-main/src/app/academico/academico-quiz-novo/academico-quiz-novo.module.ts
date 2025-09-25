import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcademicoQuizNovoPageRoutingModule } from './academico-quiz-novo-routing.module';

import { AcademicoQuizNovoPage } from './academico-quiz-novo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcademicoQuizNovoPageRoutingModule
  ],
  declarations: [AcademicoQuizNovoPage]
})
export class AcademicoQuizNovoPageModule {}
