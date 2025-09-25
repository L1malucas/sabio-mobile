import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Cub3Module} from "@cub3/cub3.module";
import { IonicModule } from '@ionic/angular';
 import { EditorModule } from '@tinymce/tinymce-angular';

import { AcademicoQuizzNovoPageRoutingModule } from './academico-quizz-novo-routing.module';

import { AcademicoQuizzNovoPage } from './academico-quizz-novo.page';

@NgModule({
  imports: [
    CommonModule,
    Cub3Module,
    EditorModule,
    FormsModule,
    IonicModule,
    AcademicoQuizzNovoPageRoutingModule
  ],
  declarations: [AcademicoQuizzNovoPage]
})
export class AcademicoQuizzNovoPageModule {}
