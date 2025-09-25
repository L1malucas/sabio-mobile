import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Cub3Module} from "@cub3/cub3.module";
import { IonicModule } from '@ionic/angular';
import {MomentModule} from "ngx-moment";

 import { EditorModule } from '@tinymce/tinymce-angular';
import { AcademicoAtividadeNovoPageRoutingModule } from './academico-atividade-novo-routing.module';

import { AcademicoAtividadeNovoPage } from './academico-atividade-novo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditorModule,
    Cub3Module,
    MomentModule,
    AcademicoAtividadeNovoPageRoutingModule
  ],
  declarations: [AcademicoAtividadeNovoPage]
})
export class AcademicoAtividadeNovoPageModule {}
