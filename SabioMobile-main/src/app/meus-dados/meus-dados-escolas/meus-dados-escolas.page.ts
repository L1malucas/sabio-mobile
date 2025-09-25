import { Component, OnInit } from '@angular/core';
import { Cub3SvcProvider } from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from "@cub3/utils/storage.utils";

@Component({
  selector: 'app-meus-dados-escolas',
  templateUrl: './meus-dados-escolas.page.html',
  styleUrls: ['./meus-dados-escolas.page.scss'],
})
export class MeusDadosEscolasPage implements OnInit {

	data:any = {MOB_ESCOLA: []};
  constructor(
    private cub3Svc:Cub3SvcProvider
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
  	this.init();
  }
  async init() {
    this.data = StorageUtils.getItem("data");
  }
}
