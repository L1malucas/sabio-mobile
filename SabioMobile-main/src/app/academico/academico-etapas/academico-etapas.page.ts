import { Component, OnInit } from '@angular/core';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';

@Component({
  selector: 'app-academico-etapas',
  templateUrl: './academico-etapas.page.html',
  styleUrls: ['./academico-etapas.page.scss'],
})
export class AcademicoEtapasPage implements OnInit {

data:any = {MOB_ETAPAS: []};
  constructor(
    private cub3Svc:Cub3SvcProvider
  ) { }

  ngOnInit() {
  	this.init();
  }
  async init() {
  	this.data = StorageUtils.getItem("data");
  }

}
