import { Component, OnInit } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db'; 
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc'; 
import { Router } from "@angular/router";
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import {Usuario} from "@cub3/classes/usuario";
import {StorageUtils} from "@cub3/utils/storage.utils";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as moment from 'moment';

import {Platform} from "@ionic/angular";

@Component({
  selector: 'app-meus-dados-registro-jornada-novo',
  templateUrl: './meus-dados-registro-jornada-novo.page.html',
  styleUrls: ['./meus-dados-registro-jornada-novo.page.scss'],
})
export class MeusDadosRegistroJornadaNovoPage implements OnInit {

	ultimoRegistro:any;
	novoRegistro:boolean = false;
	tipoRegistro:string = "";
	usuario:Usuario = StorageUtils.getAccount();
	dataAtual:any = moment(new Date());
	  data:any = {MOB_ESCOLA: []};
		localizacao:any = {
			lat: 0,
			lng: 0
		};
	registro:any = {};
  watchCoords:boolean = false;

  constructor(
  	private cub3Db: Cub3DbProvider,
  	private geolocation:Geolocation,
    private androidPermissions:AndroidPermissions,
  	private platform:Platform,
  	private router:Router, 
  	private cub3Svc:Cub3SvcProvider
  	) { 

  	}

  ngOnInit() {

  }
  ionViewWillEnter() {
  	this.init();
  }
  ionViewWillLeave() {
    this.watchCoords = false;

  }
  async init() {
    this.usuario = StorageUtils.getAccount();
  	this.getRegistros();
    this.getEscolas();
  	this.novoRegistro = false;
    this.watchCoords = true;

      if (this.platform.is('android')) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        if(result.hasPermission) {
            this.getLocal();
            const watch = this.geolocation.watchPosition();
            watch.subscribe((resp:any) => {  
                if(this.watchCoords && resp != undefined && resp.coords) {
                 this.localizacao.lat = resp.coords.latitude;
                 this.localizacao.lng = resp.coords.longitude;
                }
            });
          }
          else {
            window.location.reload();
          }

        console.log('Has permission?',result.hasPermission)},
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
    );
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_LOCATION_EXTRA_COMMANDS)
    );
	}	


  }
  getLocal():Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.geolocation.getCurrentPosition().then((resp:any) => { 
          if(resp != undefined && resp.coords) {
           this.localizacao.lat = resp.coords.latitude;
           this.localizacao.lng = resp.coords.longitude;
           resolve(resp.coords);
          }
          else {
            reject(resp);
          }
        }).catch((error) => { 
          reject(error);
        });
      }
      catch(err) {
        console.log(err);
        reject(err);
      }
    });
  }
  registrar(tipo:string) {
  	this.tipoRegistro = tipo;
  	this.dataAtual = moment(new Date());
  	this.novoRegistro = true;
  }
  getRegistros() {
	  this.cub3Db.query("SELECT * FROM MOB_PROF_FRQ ORDER BY IDF_FREQUENCIA DESC LIMIT 0,1 ").then((data:any) => {
	 
	    if(data != undefined) {
	        this.ultimoRegistro = (data.rows.item(0));
	    } 
	  });
  } 
  async registrarPronto() {
    const carregar:any = await this.cub3Svc.carregar(1);

    if(!this.data.MOB_ESCOLA || (this.data.MOB_ESCOLA && this.data.MOB_ESCOLA.length == 0)) {
      carregar.dismiss();
      this.cub3Svc.alerta("Ops!", "Não foi possível localizar as informações da escola. Realize a sincronização novamente.");
    }
try {
    this.getLocal().then((coords:any) => {
      this.registro = {
        IDF_FREQUENCIA: moment().unix(),
        IDF_PROFISSIONAL: this.usuario.id,
        ANO_LETIVO: this.usuario.ano_letivo,
        // LOG_LOGIN: this.usuario.usuario,
        // LOG_SENHA: this.usuario.senha,
        // LOG_CHAVE: this.usuario.chave_acesso,
        IDF_ESCOLA: this.data.MOB_ESCOLA[0].IDF_ESCOLA,
        TIP_REGISTRO: this.tipoRegistro == 'E' ? 'ENTRADA' : 'SAIDA',
        DAT_REGISTRO:  this.dataAtual  ,
        LOC_LATITUDE: coords.latitude,
        LOC_LONGITUDE: coords.longitude
      };

      this.registro.LOC_LATITUDE = coords.latitude;
      this.registro.LOC_LONGITUDE = coords.longitude;
      
      let dados:any = Object.assign({}, this.registro);
        dados.DAT_REGISTRO = dados.DAT_REGISTRO.format("YYYY-MM-DD HH:mm:ss"); 
      try{
        this.cub3Db.add("MOB_PROF_FRQ", dados); 
          console.log("Jornada", dados);
          this.cub3Svc.alerta("Registro de jornada", "Registro inserido com sucesso!");
          this.router.navigate(["/app/home/academico"]);
      }
      catch {  
      }
      finally {
          carregar.dismiss();   
      }
    }, () => {
      carregar.dismiss();

      this.cub3Svc.alerta("Ops!", "Não foi possível registrar a frequência. Por favor, verifique se a localização está habilitada no dispositivo ou se as devidas permissões foram concedidas.");
    });
}
catch {
  carregar.dismiss();
      this.cub3Svc.alerta("Ops!", "Não foi possível registrar a frequência. Por favor, verifique se a localização está habilitada no dispositivo, se os dados estão sincronizados corretamente ou se as devidas permissões foram concedidas.");
}

  }
  async getEscolas() {

    let carregar:any = await this.cub3Svc.carregar(1);
    this.cub3Db.query("SELECT * FROM MOB_ESCOLA GROUP BY IDF_ESCOLA").then((data:any) => {
      if(data != undefined) {
        for (var i = 0; i < data.rows.length; i++) {
          this.data.MOB_ESCOLA.push(data.rows.item(i));
          console.log( this.data.MOB_ESCOLA);
        }
        if(this.data.MOB_ESCOLA[0])
          this.registro.IDF_ESCOLA = this.data.MOB_ESCOLA[0].IDF_ESCOLA;
 
      }
      carregar.dismiss();
    }, () => {
    	carregar.dismiss();
    });
  }
}
