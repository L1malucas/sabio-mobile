import { DOCUMENT } from '@angular/common';
import { SecurityContext, Injectable, ViewChild, ElementRef, Inject, Renderer2, RendererFactory2  } from '@angular/core'; 
import { HttpClient,HttpEventType, HttpParams, HttpHeaders } from '@angular/common/http';
// import {RequestOptions} from "@angular/http";
import { Observable} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Toast } from '@ionic-native/toast/ngx';

import { Router, ActivatedRoute } from "@angular/router";
import {APP_NAME, BACKEND_URL, IMAGE_DIR, BACKEND_API_URL, BASE_URL, APPLICATION_JSON, CONTENT_TYPE_HEADER, NODE_URL, VERSAO_APP} from '../cub3-config'; 

import {Usuario} from '../classes/usuario'; 
import { DomSanitizer } from '@angular/platform-browser'; 
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';
import {SocketLocal } from '../../app.module';
import * as isBase64 from "is-base64";
import { AppVersion } from '@ionic-native/app-version/ngx';
import {  LoadingController,IonicSafeString, AlertController, Platform } from '@ionic/angular';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import * as moment from 'moment';
import { throwError } from 'rxjs';
import { StorageUtils } from '@cub3/utils/storage.utils';
import { Storage } from '@ionic/storage';
declare var cordova: any;
export type Devices = MediaDeviceInfo[];
@Injectable({
  providedIn: 'root'
})
export class Cub3SvcProvider {  
    private renderer: Renderer2;
	loading:any;
  storageDirectory: string = '';
  loaderOpt:any;
  safeSvg:any;
  imgDir:string = IMAGE_DIR;
  backUrl:string = BACKEND_URL;
  apiUrl:string = BACKEND_API_URL;

  versaoApp:string = VERSAO_APP;

  logSinc:any = [];

  public homolog:boolean = false;
  
  private usuario:Usuario = StorageUtils.getAccount();


  constructor( 
    private rendererFactory: RendererFactory2,
    private appVersion:AppVersion,
    private alertController:AlertController,
    public socket:SocketLocal,
    private router:Router, 
    private toast: Toast,
    private toastr:ToastController,
    private storage:Storage,
    public platform: Platform,
    private cub3Db:Cub3DbProvider,
    public httpo: HttpClient, 
    private http: HTTP,
    private load:LoadingController,
    private sanitizer:DomSanitizer  ) {   

 

      this.platform.ready().then(() => {  
          this.appVersion.getVersionNumber().then(async (value) => {
            this.usuario = StorageUtils.getAccount();
              StorageUtils.setItem("versao", value);
              this.versaoApp = value;
            }).catch(err => {
              // alert(err);
            });
         
        if(!this.platform.is('cordova')) {
          return false;
        }

        if (this.platform.is('ios')) {
          this.storageDirectory = cordova.file.documentsDirectory;
        }
        else if(this.platform.is('android')) {
          try {
            this.storageDirectory = cordova.file.dataDirectory;
          }
          catch(e) {

          }
          
        }
        else { 
          return false;
        }
      });    


     this.loaderOpt  = {
          spinner: "hide", content: this.safeSvg
      };
        this.renderer = rendererFactory.createRenderer(null, null);
  }
   
  getAppName():string {
    return APP_NAME;
  }
    isApp(): boolean {
      return (
        ((this.platform.is('cordova') && this.platform.is('ios')) || (this.platform.is('cordova') && this.platform.is('android') ))
      );
    }

    isBrowser(): boolean {
      return !this.isApp();
    }

    getVersaoApp() {
      return this.versaoApp;
    }
   public getSvg(titulo:string, exibirSpinner:boolean = true){
     let svg:any = "";

     if(exibirSpinner)
      svg = '<span class="loader"></span>';
    else
      svg = titulo;
   
      return new IonicSafeString((svg));
   }
  private tratarErro(error: any): Promise<any> {
        console.error('Erro: ', error);
        return Promise.reject(error.message || error);
  }

  private extractData(res: Response) {
      let body = res;
      return body || {};
  }


    public getImgDir(arquivo:string, relative:boolean = false) {
        if(arquivo !== null && isBase64(arquivo)){
          if(arquivo.search("base64") != -1)
              return arquivo;
          else
              return `data:image/png;base64,${arquivo}`;
        }
      else if(arquivo) {
        if(!relative)
          return `${this.imgDir}${arquivo}`;
        else
          return `${this.backUrl}arquivo?url=${arquivo}`;
      }
      else
        return arquivo;
    }
  async post(url:string, dados:any): Promise<any>{
    this.usuario = StorageUtils.getAccount();
    let token:any = StorageUtils.getToken();

    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9' });
 
    
        // headers = headers.append(`Authorization`, `Bearer ${token}`);
        headers = headers.append(`Content-Type`, `application/json`);
        headers = headers.append(`Accept`, `q=0.8;application/json;q=0.9`);

      let options:any = { headers: headers };  
    let results = null; 

  return new Promise((resolve, reject) => {
    let apiURL:any;
      apiURL = BACKEND_URL + url;

    this.http.post(apiURL, dados,  {'Content-Type': 'application/json'})
      .then(
        res => {  
        results = res;
        resolve(results);
        },
        msg => {  
        reject(msg);
        }
      )
      .catch(
        err => {
          // // console.log(err);
        }
        );
  }); 

  }  
  postRaw(url:string, dados:any): Promise<any>{  
  const dt = JSON.stringify(dados);

  return new Promise((resolve, reject) => {
    let apiURL:any;
      apiURL = BACKEND_URL + url;

    this.httpo.post<object>(apiURL, dt)
      .subscribe(
        res => {   
        resolve(res);
        },
        msg => {  
        reject(msg);
        }
      );
  }); 

  }  
  async postRequestUrl(url:string,  dadosOri?:any): Promise<any> {
    this.usuario = StorageUtils.getAccount();
    let token:any = StorageUtils.getToken();
     let body = new URLSearchParams();
    let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
    let options = ({ headers: headers });
    // if(dados != null  && this.usuario != null)
    //   dados.cliente_id = this.usuario.id;
     
     let dados:any = Object.assign({}, dadosOri);
    if(dados != undefined) {
      Object.keys(dados).forEach(key => {
        if(dados[key] instanceof Object)
          dados[key] = JSON.stringify(dados[key]);

        body.append(key, dados[key]);
      });
    } 
    let results = null;
  return new Promise((resolve, reject) => {
    let apiURL:any;
      apiURL = BACKEND_URL + url;

    this.http.post(apiURL, body.toString(), options)
      .then(
        res => {  
        results = res;
        resolve(results);
        },
        msg => {  
        reject(msg);
        }
      )
      .catch(
        err => {
          // // console.log(err);
        }
        );
  }); 
  }
 
  async putRequest(metodo: string, dadosOri?: any): Promise<any> {
    const usuario = StorageUtils.getAccount();
    const token = StorageUtils.getToken();
    const body = new URLSearchParams();
    
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Accept', 'text/html, application/xhtml+xml, */*');
    
    const options: any = { headers: headers, responseType: 'text' };
    
    let dados: any;
    if (dadosOri) {
      dados = Object.assign({}, dadosOri);
      Object.keys(dados).forEach(key => {
        if (dados[key] instanceof Object) {
          dados[key] = JSON.stringify(dados[key]);
        }
        body.append(key, dados[key]);
      });
    }
    let apiURL;

    if(metodo.search("://") == -1)
      apiURL = BACKEND_URL + metodo;
    else
    apiURL = metodo;
    
    try {
      const res = await this.httpo.put<any>(apiURL, body.toString(), options).toPromise();
      let data:any = res;
      data = data.replace(": ,", ": []");
      data = data.replace(":,", ": []");
      return JSON.parse(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async postRequest(metodo: string, dadosOri?: any): Promise<any> {
    const usuario = StorageUtils.getAccount();
    const token = StorageUtils.getToken();
    const body = new URLSearchParams();
    
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.append('Accept', 'text/html, application/xhtml+xml, */*');
    
    const options: any = { headers: headers, responseType: 'text' };
    
    let dados: any;
    if (dadosOri) {
      dados = Object.assign({}, dadosOri);
      Object.keys(dados).forEach(key => {
        if (dados[key] instanceof Object) {
          dados[key] = JSON.stringify(dados[key]);
        }
        body.append(key, dados[key]);
      });
    }
    let apiURL;

    if(metodo.search("://") == -1)
      apiURL = BACKEND_URL + metodo;
    else
    apiURL = metodo;
    
    try {
      const res = await this.httpo.post<any>(apiURL, body.toString(), options).toPromise();
      let data:any = res;
      data = data.replace(": ,", ": []");
      data = data.replace(":,", ": []");
      return JSON.parse(data);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  async postUrl(url:string,  dados?:any): Promise<any> {

    this.usuario = StorageUtils.getAccount();
    let token:any = StorageUtils.getToken();

    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9', 'Authorization': 'Bearer '+token});
    let options =  { headers: headers };
      
    let results = null; 

  return new Promise((resolve, reject) => {
    let apiURL:any;
 
      apiURL = url;
       
    this.http.post(apiURL, JSON.stringify(dados), options)
      .then(
        res => {  
        results = res;
        resolve(results);
        },
        msg => {  
        reject(msg);
        }
      )
      .catch(
        err => {
          // // console.log(err);
        }
        );
  }); 

  }


  login(dados:any): Promise<any> { 
    let body = new URLSearchParams();
     let headers = new HttpHeaders({'Content-Type':  'application/json' });
     let options = ({ headers: headers });  
     let results = null;
 
     dados.app = 'educanet';
   return new Promise((resolve, reject) => {
     let apiURL:any; 
       apiURL = NODE_URL + "login/mobile";
     this.httpo.post(apiURL, JSON.stringify(dados), options)
       .toPromise()
       .then(
         res => {  
         results = res;
         resolve(results);
         },
         msg => {  
          console.log("Msg login", msg);
         reject(msg);
         }
       )
       .catch(
         err => {
         }
         );
   }); 
   } 
 

  async getUrl(url:string): Promise<any>{
    this.usuario = StorageUtils.getAccount();
    let token:any = StorageUtils.getToken();
    // let headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9', 'Authorization': 'Bearer '+token});
    let options =  { };
      
    let results = null; 
 
    let apiURL:any = url;
 
      return new Promise((resolve, reject) => {
          this.httpo.get<any>(apiURL,  options)
              .pipe(
                map((res:any) => { 
                  resolve(res);
                }),
                catchError((err:any) => {
                  reject(err);
                  return err;
                })
              ).toPromise(); 
        }); 
  } 

  async get(url:string): Promise<any>{
    this.usuario = StorageUtils.getAccount();
    let token:any = StorageUtils.getToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9'});
    let options =  { headers: headers };
      
    let results = null; 
 
    let apiURL:any;
    let back:string = BACKEND_URL;

      apiURL = back + url; 
      return new Promise((resolve, reject) => {
          this.httpo.get<any>(apiURL,  options)
              .pipe(
                map((res:any) => { 
                  resolve(res);
                }),
                catchError((err:any) => {
                  reject(err);
                  return err;
                })
              ).toPromise(); 
        }); 
  } 


  async getApi(url:string): Promise<any>{
    this.usuario = StorageUtils.getAccount();
    let token:any = StorageUtils.getToken();
    let headers = new HttpHeaders({'Content-Type': 'application/json', 'Accept': 'q=0.8;application/json;q=0.9', 'Authorization': 'Bearer '+token});
    let options =  { headers: headers };
      
    let results = null; 

  return new Promise((resolve, reject) => {
    let apiURL:any; 

      apiURL = BACKEND_URL + url;

    this.http.get(apiURL,{}, options)
      .then(
        res => {  
        results = res;
        resolve(results);
        },
        msg => {  
        reject(msg);
        }
      )
      .catch(
        err => {
        }
        );
  }); 
  } 

  getForm(id:any): Promise<any> { 
   let body = new URLSearchParams();
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    let options = ({ headers: headers });  
    var secs = Math.floor(+new Date() / 1000) + "";

    let results = null;
  return new Promise((resolve, reject) => { 
    this.http.get(`./assets/cub3/dados/${id}.json?v=${secs}`, {}, options)
      .then(
        res => {  
        results = res;
        resolve(results);
        },
        msg => {  
        reject(msg);
        }
      )
      .catch(
        err => {
        }
        );
  }); 
  }

  getAvatarUrl():string {
    return IMAGE_DIR + "others/uploads/avatar/";
  }

  async alerta(titulo:string = "", texto:string = "") {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
      message: texto,
      buttons: [ {
          text: 'Confirmar',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }
  executarPromises(promises:any) {
    return promises.reduce((p, task) => p.then(task), Promise.resolve());
  }
  async carregar(v:any, titulo:string = "Carregando...", exibirSpinner:boolean = true): Promise<any> {  
    const svg = <any> this.getSvg(titulo, exibirSpinner);

    const loading = await this.load.create({
          spinner: null, message: svg
    });
  return new Promise((resolve, reject) => { 
     loading.present();
 

    resolve(loading);
  });

  //   if(v){ 
  //       this.loading = await this.load.create(this.loaderOpt);
  //       await this.loading.present(); 
  //       setTimeout(() => {
  //         await this.loading.dismiss();
  //       }, 50000); 
  //   }
  // else{
  //   try{
  //     await this.loading.dismiss();
  //   }
  //   catch (e){ 
  //     // console.log((<Error>e).message); 
  //   }
  // }
  }

  async sincronizar(tipo:any):Promise<any> {
    //  const carregar:any = await this.carregar(1);
    this.logSinc = this.cub3Db.getStorage("logSinc");
     const login:any = StorageUtils.getItem("login");
     let nProcessamento:number = 0;

    return new Promise(async (resolve, reject) => { 
        switch(tipo) {
          case 'MOB_OCORRENCIAS':
          let promises_ocorrencias = [];

                this.cub3Db.query("SELECT MOB_OCORRENCIA.*, MOB_TURMAS_ALUNOS.IDF_TURMA FROM MOB_OCORRENCIA INNER JOIN MOB_TURMAS_ALUNOS ON MOB_TURMAS_ALUNOS.IDF_ALUNO = MOB_OCORRENCIA.IDF_ALUNO GROUP BY MOB_OCORRENCIA.IDF_OCORRENCIA_LOCAL").then((data:any) => {
                  if(data != undefined) { 

                    nProcessamento = 0;
                    let aux:any = {
                          usuario: this.usuario.usuario,
                          senha: this.usuario.senha,
                          chave_acesso: this.usuario.chave_acesso,
                          mob_ocorrencia: {"MOB_OCORRENCIA": []}  
                            }; 
                    for (var i = 0; i < data.rows.length;i++) { 
                      const query = data.rows.item(i);  
                      // console.log("Verificando ocorrência", query.IDF_OCORRENCIA_LOCAL);
                      if( query != undefined && !this.verificarSinc(tipo, 'IDF_OCORRENCIA_LOCAL', query.IDF_OCORRENCIA_LOCAL)) {
                        promises_ocorrencias.push(() => {

                        let ocorr:any = query;
                        let auxOcorrencia:any = {};
                        auxOcorrencia.IDF_OCORRENCIA = query.IDF_OCORRENCIA;
                        auxOcorrencia.DAT_OCORRENCIA = query.DAT_OCORRENCIA != undefined ? query.DAT_OCORRENCIA.substr(0,11) : null;
                        auxOcorrencia.IDF_ALUNO = query.IDF_ALUNO;
                        auxOcorrencia.IDF_TURMA = query.IDF_TURMA;
                        auxOcorrencia.OBSERVACAO = query.OBSERVACAO != undefined ? query.OBSERVACAO : '';
                        auxOcorrencia.TXT_OCORRENCIA = query.TXT_OCORRENCIA; 
                        auxOcorrencia.ANO_LETIVO = this.usuario.ano_letivo; 

                        aux.mob_ocorrencia = JSON.stringify({MOB_OCORRENCIA: [auxOcorrencia]});
                        // console.log('ocorrencia', aux);

                          return new Promise((resolve, reject) => {this.postRequest("profissional/aluno/ocorrencia/", aux).then((res:any) => { 
                          try {
                            if(res.error == false || res.error == 'false'){
                              this.setSinc(tipo, 'IDF_OCORRENCIA_LOCAL', ocorr.IDF_OCORRENCIA_LOCAL);
                              resolve(true);
                            }
                          }
                          catch(err) {
                            reject(err); 
                          }

                        }, (err:any) => { 
                          reject(err);
                        } )
                      })
                      });
                      }
                    } 
                  } 
                  this.executarPromises(promises_ocorrencias).then(() => {
                    this.Toast("Sincronização realizada com sucesso!");
                    resolve(true);
                    // carregar.dismiss();                    
                  });
              });
                       
            break;
          case 'MOB_REGISTRO_AULA':
                  // SELECT MOB_REGISTRO_AULA.*, 
                  // MOV_REGISTRO_FREQUENCIA.IDF_ALUNO, 
                  // MOV_REGISTRO_FREQUENCIA.SIT_ALUNO, 
                  // MOB_TURMAS_ALUNOS.IDF_ALUNOESCOLA 
                  // FROM MOB_REGISTRO_AULA 
                  // LEFT JOIN MOV_REGISTRO_FREQUENCIA 
                  // ON MOV_REGISTRO_FREQUENCIA.IDF_AULA = MOB_REGISTRO_AULA.IDF_AULA 
                  // LEFT JOIN MOB_TURMAS_ALUNOS 
                  // ON MOB_TURMAS_ALUNOS.IDF_ALUNO = MOV_REGISTRO_FREQUENCIA.IDF_ALUNO

                  try {
                  nProcessamento = 0;
                      let aux:any = {
                        usuario: this.usuario.usuario,
                        senha: this.usuario.senha,
                        chave_acesso: this.usuario.chave_acesso,
                        mob_registro_aula: {"MOB_REGISTRO_AULA": []}  
                          }; 

                  
                    
                    this.montarAulasFreq(tipo).then((arrayAulas) => {  
                      // console.log("Montando aulas", arrayAulas);
                          if(arrayAulas && arrayAulas.length > 0)
                            aux.mob_registro_aula = JSON.stringify({MOB_REGISTRO_AULA: arrayAulas || []});
                          
                            this.putNode("educanet/aulas/mobile/", aux).then((res:any) => {
                              if(!res.error){
                                for(let aula of arrayAulas) {
                                  this.setSinc(tipo, 'IDF_AULA', aula.IDF_AULA);
                                }
                              }
                            }, (err:any) => {

                            });
                          // } 

                      
                      this.Toast("Sincronização realizada com sucesso!");
                      resolve(true);
                      // carregar.dismiss(); 
                    }, (e) => {
                      reject(e);
                    });
                    }
                    catch(e) {
                      console.error("Erro ao montar registro", e);
                      reject(e);
                      // carregar.dismiss();
                    }
                        // Fim
            
            break;
          case 'MOV_REGISTRO_FREQUENCIA':
                this.cub3Db.query("SELECT * FROM MOV_REGISTRO_FREQUENCIA").then((data:any) => {
                  if(data != undefined) { 
                    nProcessamento = 0;
                        let aux:any = {
                          IDF_PROFISSIONAL: this.usuario.id,
                          ANO_LETIVO: this.usuario.ano_letivo,
                          LOG_LOGIN: this.usuario.usuario,
                          LOG_SENHA: this.usuario.senha,
                          LOG_CHAVE: this.usuario.chave_acesso,
                          IDF_AULA: '',
                          IDF_ALUNO: '',
                          SIT_ALUNO: '',
                          JUS_FALTA: '',
                          OBSERVACAO: ''
                            }; 

                    for (var i = 0; i < data.rows.length; i++) { 
                      if( data.rows.item(i) != undefined && !this.verificarSinc(tipo, 'IDF_FREQUENCIA', data.rows.item(i).IDF_FREQUENCIA)) {
                        aux.IDF_AULA = data.rows.item(i).IDF_AULA;
                        aux.IDF_ALUNO = data.rows.item(i).IDF_ALUNO;
                        aux.SIT_ALUNO = data.rows.item(i).SIT_ALUNO; 
                        aux.JUS_FALTA = data.rows.item(i).JUS_FALTA; 
                        aux.OBSERVACAO = data.rows.item(i).OBSERVACAO; 
                        this.postRequest("profissional/turma/aluno/frequencia/", aux).then((res:any) => {
                          if(!res.error)
                            this.setSinc(tipo, 'IDF_FREQUENCIA', data.rows.item(i).IDF_FREQUENCIA);
                        }, (err:any) => {
                        });
                      }
                    } 
                  } 
                  this.Toast("Sincronização realizada com sucesso!");
                  // carregar.dismiss();
                  resolve(true);
              });
            
            break;
          case 'MOB_AVALIACAO_NOTA':  
                try {
                              nProcessamento = 0;
                              let notas:any = await (StorageUtils.getItem("MOB_AVALIACOES_ALUNOS")),
                              avaliacoes:any = await (StorageUtils.getItem("MOB_AVALIACOES"));
      
                                for (var q = 0; q < avaliacoes.length; q++) {
                                  let auxAval:any = avaliacoes[q];
                                  let auxNotas:any = [];
                                  for (var z = 0; z < notas.length; z++) {
                                    if(notas[z] != null && notas[z].IDF_AVALIACAO == auxAval.IDF_AVALIACAO)
                                      auxNotas.push(notas[z]);
                                  }
                                    let aux:any = {
                                            avaliacao_nota: JSON.stringify({MOB_AVALIACOES_ALUNOS: auxNotas}),
                                            ano_letivo: this.usuario.ano_letivo,
                                            usuario: this.usuario.usuario,
                                              senha: this.usuario.senha,
                                              chave_acesso: this.usuario.chave_acesso
                                          }; 
                              if(!this.verificarSinc(tipo, 'IDF_AVALIACAO', auxAval.IDF_AVALIACAO)) {
                                try {
                                  this.postRequest("profissional/turma/aluno/avaliacao/nota/", aux).then((res:any) => {
                                    if(!res.error)
                                      this.setSinc(tipo, 'IDF_AVALIACAO', auxAval.IDF_AVALIACAO);
                                  }, (err:any) => {
                                  }); 
                                }
                                catch(e) {
                                  console.error(e);
                                }
                                    nProcessamento++;
                                }
                              } 
                  
                    if(nProcessamento == avaliacoes.length){
                        // carregar.dismiss();
                        this.Toast("Sincronização realizada com sucesso!");
                        resolve(true);
                    }

                    // carregar.dismiss();
                  }
                  catch(e) {
                    // console.log('Erro ao sincronizar avaliações', e);
                    // carregar.dismiss(); 
                    resolve(true);

                  }
            break;
          case 'MOB_PROF_FRQ':
                this.cub3Db.query("SELECT * FROM MOB_PROF_FRQ").then((data:any) => {
                  if(data != undefined) { 
                    nProcessamento = 0;
                        let aux:any = { 
                          usuario: this.usuario.usuario,
                          senha: this.usuario.senha,
                          chave_acesso: this.usuario.chave_acesso,
                          mob_prof_frq: {"MOB_PROF_FRQ": []} 
                          }

                      if(data.rows && data.rows.length > 0) {
                        for (var i = 0; i < data.rows.length; i++) { 
                          if( data.rows.item(i) != undefined && !this.verificarSinc(tipo, 'IDF_FREQUENCIA', data.rows.item(i).IDF_FREQUENCIA)) {
                            let auxFrq:any = {},
                                idFreq:number = data.rows.item(i).IDF_FREQUENCIA;
    
                            // auxFrq.IDF_FREQUENCIA = 0;
                            auxFrq.IDF_ESCOLA = data.rows.item(i).IDF_ESCOLA == undefined ? null : data.rows.item(i).IDF_ESCOLA;
                            auxFrq.TIP_REGISTRO = data.rows.item(i).TIP_REGISTRO;
                            auxFrq.DAT_REGISTRO = data.rows.item(i).DAT_REGISTRO; 
                            auxFrq.LOC_LATITUDE = data.rows.item(i).LOC_LATITUDE; 
                            auxFrq.LOC_LONGITUDE = data.rows.item(i).LOC_LONGITUDE; 
                            auxFrq.ANO_LETIVO = this.usuario.ano_letivo;
                            auxFrq.IDF_PROFISSIONAL = this.usuario.id;
                            auxFrq.TIP_CONEXAO = "APP";
    
                            aux.mob_prof_frq = JSON.stringify({MOB_PROF_FRQ: [auxFrq]});
    
                            this.postRequest("profissional/frequencia/", aux).then((res:any) => {
                              if(idFreq  != undefined && !res.error)
                                this.setSinc(tipo, 'IDF_FREQUENCIA', idFreq);
                            }, (err:any) => {
                            });
                          }
                        } 

                      }
                  } 
                      this.Toast("Sincronização realizada com sucesso!");
                  // carregar.dismiss();
                  resolve(true);
              });
            
            break;
            case 'GERAL':

                  let dados:any = {
                    chave_acesso: login.chave,
                    ano_letivo: login.ano,
                    usuario: login.usuario,
                    senha: login.senha
                  }; 

                  if(dados.usuario == '' || dados.senha == '' || dados.ano_letivo == '' || dados.chave_acesso == '')
                    reject(false);

                  this.postRequest("profissional/logar/", dados).then(data => {
                    if(data != undefined){
                        if(!data.error){
                            StorageUtils.setItem("data", data);
                            StorageUtils.setItem("MOB_AVALIACOES", data['MOB_AVALIACOES']);
                            StorageUtils.setItem("MOB_AVALIACOES_ALUNOS", data['MOB_AVALIACOES_ALUNOS']);
                            StorageUtils.setItem("MOB_CPROGRAMA", data['MOB_CPROGRAMA']);
                            this.get("profissional/plano_aula/"+dados.chave_acesso+"/"+dados.usuario+"/"+dados.senha+"/"+dados.ano_letivo+"/").then((res:any) => {
                              if(res){
                                StorageUtils.setItem("MOB_PLAULA", res);
                                for(let item of res) {
                                  this.get("profissional/plano_aula_cp/"+dados.chave_acesso+"/"+dados.usuario+"/"+dados.senha+"/"+dados.ano_letivo+"/"+item.IDF_PLAULA+"/").then((rCon:any) => {
                                    if(rCon) {
                                      res[res.indexOf(item)].CONTEUDOS = rCon;
                                      StorageUtils.setItem("MOB_PLAULA", res);
                                    }
                                  }, () => {

                                  });
                                }
                              }
                            }, () => {

                            });
                        }
                      }
                      this.Toast("Sincronização realizada com sucesso!");
                    // carregar.dismiss();
                    resolve(true);
                    }, () => {
                        this.Toast("Ocorreu um problema! Por favor, tente novamente.");
                        // carregar.dismiss();
                        reject(false);
                    });
              break;
            default:
              // carregar.dismiss();
              resolve(true);
            break;
        }
    });
  }
  async getRegistroAula(): Promise<any> { 
    let registroAula = await this.cub3Db.getStorage("MOB_REGISTRO_AULA");
  
    // Sort the data by DAT_AULA in ascending order
    registroAula.sort((a, b) => (a.DAT_AULA > b.DAT_AULA) ? 1 : -1);
  
    return registroAula;
  }
  private async montarAulasFreq(tipo:any):Promise<any> {
    return new Promise(async (resolve, reject) => {
                const promises = [];
                const login:any = StorageUtils.getItem("login");

                // this.cub3Db.query("SELECT MOB_REGISTRO_AULA.* FROM MOB_REGISTRO_AULA ORDER BY MOB_REGISTRO_AULA.DAT_AULA ASC").then((data:any) => {
                  this.getRegistroAula().then((data:any) => {
                                  if(data != undefined) { 

                                    let arrayAulas:any[] = [];
                                    let auxAlunos:any = [];

                                    // console.log("Sincronizando aulas", data);

                                    for (let aula of data) { 
                                      if( aula != undefined && !this.verificarSinc(tipo, 'IDF_AULA', aula.IDF_AULA)) {

                                        let auxFreq:any = {},
                                            freq:any = aula; 

                                            if(auxFreq != undefined && this.usuario.ano_letivo == parseInt(moment(freq.DAT_AULA).format("YYYY"))){ 

                                              // console.log("Montando aula para sincronizacao", aula);
                                                  auxFreq.IDF_AULA = freq.IDF_AULA || null;
                                                  auxFreq.DAT_AULA = (freq.DAT_AULA);
                                                  auxFreq.IDF_TURMA = freq.IDF_TURMA;
                                                  auxFreq.IDF_DISCIPLINA = freq.IDF_DISCIPLINA;
                                                  auxFreq.DES_DISCIPLINA = freq.DES_DISCIPLINA;
                                                  auxFreq.DES_ASSUNTO = freq.DES_ASSUNTO;
                                                  auxFreq.OBSERVACAO = freq.OBSERVACAO;
                                                  auxFreq.HOR_INICIO = freq.HOR_INICIO || '';
                                                  auxFreq.HOR_TERMINO = freq.HOR_TERMINO || '';
                                                  // auxFreq.IDF_ALUNOESCOLA = freq.IDF_ALUNOESCOLA;

                                                  // if(freq.IDF_HORARIO != null && freq.IDF_HORARIO != '')
                                                  //   auxFreq.IDF_HORARIO = freq.IDF_HORARIO;

                                                  auxFreq.SIT_REGISTRO = freq.SIT_REGISTRO;
                                                  auxFreq.IDF_PROFISSIONAL = this.usuario.idfProfissional;
                                                  
                                                  // if(freq.IDF_ALUNO != null)
                                                  //   auxFreq.IDF_ALUNO = freq.IDF_ALUNO;

                                                  // if(freq.SIT_ALUNO != null)
                                                  //   auxFreq.SIT_ALUNO = freq.SIT_ALUNO;

                                                  // if(freq.IDF_ALUNOESCOLA)
                                                  //   arrayAulas.push(auxFreq);

                                                  if(freq.NRO_AVALIACAO != null && freq.NRO_AVALIACAO != 'NaN')
                                                    auxFreq.NRO_AVALIACAO = parseInt(freq.NRO_AVALIACAO);

                                                  if(freq.IDF_PLAULA != null)
                                                    auxFreq.IDF_PLAULA = freq.IDF_PLAULA;

                                                  // if(freq.IDF_CONTEUDO != null){
                                                  //   auxFreq.IDF_CONTEUDOS = freq.IDF_CONTEUDO;
                                                  // }
                                                  try {
                                                    auxFreq.IDF_CONTEUDOS = freq.IDF_CONTEUDOS.slice(0, 5);
                                                    auxFreq.IDF_CONTEUDOS = auxFreq.IDF_CONTEUDOS.map(conteudo => ({
                                                      ANO_LETIVO: conteudo.ANO_LETIVO,
                                                      IDF_CONTEUDO: conteudo.IDF_CONTEUDO,
                                                      SEQ_CONTEUDO: conteudo.SEQ_CONTEUDO,
                                                      // DES_CONTEUDO: conteudo.descricaoConteudo,
                                                      NRO_HORAAULA: conteudo.NRO_HORAAULA,
                                                      IDF_ETAPA: conteudo.IDF_ETAPA,
                                                      DES_ETAPA: conteudo.DES_ETAPA,
                                                      IDF_DISCIPLINA: conteudo.IDF_DISCIPLINA,
                                                      DES_DISCIPLINA: conteudo.DES_DISCIPLINA,
                                                      NRO_AVALIACAO: conteudo.NRO_AVALIACAO,
                                                      DES_AVALIACAO: conteudo.DES_AVALIACAO
                                                    }));
                                    
                                                  }
                                                  catch(e) {
                                                    auxFreq.IDF_CONTEUDOS = [];
                                                  }
                                                  auxFreq.IDF_CONTEUDO = freq.IDF_CONTEUDO;


                                                  promises.push(new Promise(async (resolve, reject) => {
                                                    auxFreq.IDF_ALUNOESCOLA_AUSENTES = ""; 
                                                    auxFreq.IDF_ALUNO_AUSENTES  = [];
                                                    auxAlunos = []; 
                                                    // const frequencia = await this.cub3Db.getStorage("MOV_REGISTRO_FREQUENCIA");
                                                    // const dataAlunos = frequencia.filter(item => parseInt(item.IDF_AULA) === parseInt(freq.IDF_AULA));
                                                  
                                                    // // console.log("Montando frequência", dataAlunos);
                                                    // const auxAlunos = [];  // Redefine aqui para garantir que está limpa a cada iteração
                                                    // if (dataAlunos.length > 0) { 
                                                    //   for (let aluno of dataAlunos) {
                                                    //     if (aluno.SIT_ALUNO === "AUSENTE" && auxAlunos.indexOf(aluno.IDF_ALUNO) === -1) {
                                                    //       auxAlunos.push(aluno.IDF_ALUNO);
                                                    //     }
                                                    //   }
                                                    //   if (auxAlunos.length > 0)
                                                    //     auxFreq.IDF_ALUNO_AUSENTES = auxAlunos.join(",");
                                                    // }
                                                  
                                                    const frequencia = await this.cub3Db.getStorage("MOV_REGISTRO_FREQUENCIA");
                                                    const aulas = await this.cub3Db.getStorage("MOB_REGISTRO_AULA");
                                                    let turmas = await this.getTurmas();
                                                    const turmaSelecionada = turmas.find(turma => parseInt(turma.id) === parseInt(freq.IDF_TURMA));
                                                    // console.log(turmaSelecionada);
                                                    
                                                    for(let aluno of turmaSelecionada.alunos) { 
                                                      const avaliacaoAluno = frequencia.find(registro => 
                                                        registro.IDF_ALUNO === aluno.id && parseInt(registro.IDF_AULA) === parseInt(freq.IDF_AULA) && registro.SIT_ALUNO !== 'PRESENTE'
                                                      );
                                                      // console.log("Verificando freq do aluno", [aluno.id, avaliacaoAluno]);
                                                    
                                                      if (avaliacaoAluno && avaliacaoAluno.SIT_ALUNO === 'AUSENTE') {
                                                        auxAlunos.push(aluno.id);
                                                      }
                                                    }
                                                    
                                                    if (auxAlunos.length > 0) {
                                                      auxFreq.IDF_ALUNO_AUSENTES = auxAlunos.join(",");
                                                    }
                                                    
                                                    // console.log("Alunos ausentes", [auxFreq.IDF_AULA, auxAlunos]);
                                                    arrayAulas.push(auxFreq);
                                                    resolve(arrayAulas);
                                                    
                                                  }));
                                                  
                                                }
                                                // Fim Consulta
                                              }
                                            }
                                            Promise.all(promises).then(() => {
                                              resolve(arrayAulas);
                                            }, (err) => {
                                              reject(err);
                                            });
                                          }
                                          else {
                                            reject(false);
                                          }
                                        });
        });
 
  }
  verificarSinc(tbl:any, chave:any, valor:any) {
    // for (var x = 0; x < this.logSinc.length; x++) {
    //   if(this.logSinc[x].tbl == tbl && this.logSinc[x].chave == chave && parseInt(this.logSinc[x].valor) == parseInt(valor))
    //     return true;
    // }
    return false;
  }
  async setSinc(tbl:any, chave:any, valor:any) { 
    // let flag = false;
    // if(!this.logSinc)
    //   this.logSinc = [];
    // try {
    // for(let item of this.logSinc) {
    //   if(item.chave == chave && item.valor == valor)
    //     flag = true;
    // }
    // if(!flag) {
    //   this.logSinc.push({tbl: tbl, chave:chave, valor:valor});
    //   // StorageUtils.setItem("logSinc",  (this.logSinc));
    //   await this.cub3Db.setStorage("logSinc", this.logSinc);
    // }
    // }
    // catch(e) {

    // }
  }
  async Toast(texto:string = "") {
    this.toast.show(texto, '5000', 'bottom').subscribe(
      toast => {
      }
    );
  } 


  async getNode(url: string, redirecionar:boolean = true): Promise<any> {
    this.usuario = StorageUtils.getAccount();
    let token: any = StorageUtils.getToken();

    let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'q=0.8;application/json;q=0.9',
        ...(token && { 'Authorization': token })
    });

    let options = {
        headers: headers
    };

    let apiURL: any = NODE_URL + url;

    try {
        const res = await this.httpo.get<any>(apiURL, options).pipe(
            map((res: any) => res),
            catchError((err: any) => {
                // Tratamento do erro dentro do catchError
                if (err?.error?.mensagem?.name === 'TokenExpiredError') {
                    StorageUtils.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(err);
            })
        ).toPromise();
        return res;
    } catch (err) {
        // Rejeitar promessa em caso de erro
        return Promise.reject(err);
    }
}

    formatarTelefone(numero: string): string {
      // Remove todos os caracteres não numéricos
      let numeros = numero.replace(/\D/g, '');
  
      // Desconsidera o zero inicial se houver
      if (numeros.startsWith('0')) {
          numeros = numeros.substring(1);
      }
  
      // Extrai o DDD e o número
      const ddd = numeros.substring(0, 2);
      let num = numeros.substring(2);
  
      // Insere o hífen antes dos últimos 4 dígitos
      num = num.substring(0, num.length - 4) + '-' + num.substring(num.length - 4);
  
      // Retorna o número formatado
      return `(${ddd}) ${num}`;
  }
    getPhoneMask(phone: string): string { 
      const numericPhone = phone.replace(/\D/g, '');
 
      return numericPhone.length > 10 ? '(00) 00000-0000' : '(00) 0000-0000';
    }
    getCpfTexto(cpf: string): string {
      try {
        const cpfNumeros = cpf.replace(/\D/g, '');
        const cpfFormatado = cpfNumeros.replace(
          /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
          '$1.$2.$3-$4'
        );
        return cpfFormatado;
      }
      catch(e) {
        return cpf;
      }
    }
    async postFormData(url:string, formData:any): Promise < any > {
      this.usuario = StorageUtils.getAccount();
      let token: any = StorageUtils.getToken();
    
      let headers = new HttpHeaders({ 
          'Authorization': token
      });
    
      let options = {
          headers: headers,
          reportProgress: true,
          observe: 'events' as 'events'
      }; 
    
      return new Promise((resolve, reject) => {
        let apiURL: any; 
        apiURL = `https://node.educanethomeclass.com.br:49996/suporte/uploadArquivo`;
    
        this.httpo.post<any>(apiURL, formData, options)
            .pipe(
                tap((event: any) => {
                    if (event.type === HttpEventType.Response) {
                        // console.log("Retorno upload", event.body);
                        resolve(event.body);
                    }
                }),
                catchError((err:any) => {
                    reject(err);
                    return throwError(err);
                })
            ).subscribe();  
      });
    }
    async postNode(url:string, dadosOri:any): Promise < any > {
        this.usuario = StorageUtils.getAccount();
        let token: any = StorageUtils.getToken();
        let body = new URLSearchParams();
        let headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': token
        });
        // console.log(headers);
        let options = {
            headers: headers
        };
        // if(dados != null  && this.usuario != null)
        //   dados.cliente_id = this.usuario.id;

        let dados: any = Object.assign({}, dadosOri);
        if (dados != undefined) {
            Object.keys(dados).forEach(key => {
                if (dados[key] != null) {
                    if (dados[key] instanceof Object)
                        dados[key] = JSON.stringify(dados[key]);

                    body.append(key, dados[key]);
                }
            });
        }
        let results = null;
        return new Promise((resolve, reject) => {
            let apiURL: any; 
                apiURL = NODE_URL + url;

               
          this.httpo.post<any>(apiURL, body.toString(), options)
              .pipe(
                map((res:any) => { 
                  resolve(res);
                }),
                catchError((err:any) => {
                  reject(err);
                  return err;
                })
              ).toPromise();  
        });
    }
    async putNode(url:string, dadosOri:any): Promise < any > {
      this.usuario = StorageUtils.getAccount();
      let token: any = StorageUtils.getToken();
      let body = new URLSearchParams();
      let headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': token
      });
      // console.log(headers);
      let options = {
          headers: headers
      };
      // if(dados != null  && this.usuario != null)
      //   dados.cliente_id = this.usuario.id;

      let dados: any = Object.assign({}, dadosOri);
      if (dados != undefined) {
          Object.keys(dados).forEach(key => {
              if (dados[key] != null) {
                  if (dados[key] instanceof Object)
                      dados[key] = JSON.stringify(dados[key]);

                  body.append(key, dados[key]);
              }
          });
      }
      let results = null;
      return new Promise((resolve, reject) => {
          let apiURL: any; 
              apiURL = NODE_URL + url;

             
        this.httpo.put<any>(apiURL, body.toString(), options)
            .pipe(
              map((res:any) => { 
                resolve(res);
              }),
              catchError((err:any) => {
                reject(err);
                return err;
              })
            ).toPromise();  
      });
  }

    normalizeString(str:string) {
      try {
      return str ? ((str).toLowerCase()).replace(/(?:^|\s)\S/g, (a) => { return a.toUpperCase(); }): '';
      }
      catch(e) {
        return str;
      }
  }
   getPrimeiroNome(nomeCompleto: string): string | undefined {
    if (typeof nomeCompleto !== 'string' || nomeCompleto.trim() === '') {
      return '';
    }

    const [primeiroNome] = nomeCompleto.trim().split(/\s+/);
    if (!primeiroNome) {
      return '';
    }

    return this.normalizeString(primeiroNome);
  }

  async listarAlunos(escolas:any[] = null) {

    // if(!escolas || (escolas && escolas.length == 0))
      escolas = StorageUtils.getItem("escolas")?.escolas;

    let alunos = [];
    
    escolas.forEach(escola => {
      // console.log("Escola", escola);
      escola.turmas.forEach(turma => {
      turma.alunos.forEach(aluno => { 
        let alunoComNomeTurma = {...aluno, nomeTurma: turma.titulo};
        alunos.push(alunoComNomeTurma);
      });
      });
    });
    
    return alunos;
    }
  listarTurmas(escolas) {
    let turmas = [];
    
    escolas.forEach(escola => {
      escola.turmas.forEach(turma => {
      turmas.push(turma);
      });
    });
    
    return turmas;
    }
    async getTurmas() {
      try {
        const turmas:any = StorageUtils.getItem("escolas");
        if(turmas && turmas.escolas)
          return this.listarTurmas(turmas.escolas);
        else
          return [];
      }
      catch(e) {
        return [];
      }
    }
   getPrimeiroUltimoNome(nomeCompleto: any): string | undefined { 
      if (typeof nomeCompleto !== 'string') {
        return nomeCompleto;
      }
   
      const partes = nomeCompleto.trim().split(/\s+/);
      const nome = partes.shift();
      const sobrenome = partes.pop();
      if (!nome || !sobrenome) {
        return this.getPrimeiroNome(nomeCompleto);
      }
   
      return `${nome} ${sobrenome}`;
    }
  public notificarSom(tipo:string = 'chat') {
    const audioChat = new Audio('/assets/sons/chat.mp3');
    const audioCamera = new Audio('/assets/sons/abertura_camera.mp3');
    const audioErro = new Audio('/assets/sons/erro.mp3');
    const audioInicio = new Audio('/assets/sons/transmissao.mp3');
    const audioSucesso = new Audio('/assets/sons/sucesso.mp3');
    switch (tipo) {
      case "chat":
            audioChat.play();
        break;
      case "camera":
            audioCamera.play();
        break;
      case "erro":
            audioErro.play();
        break;
      case "inicio":
            audioInicio.play();
        break;
      case "sucesso":
            audioSucesso.play();
        break;
      default:
            audioChat.play();
        break;
    }
     
  }


    loginHomeClass(dados: any, tipo:string = 'instrutor'): Promise < any > {
        let body = new URLSearchParams();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        let options = ({
            headers: headers
        });
        let results = null;
        return new Promise((resolve, reject) => {
            let apiURL: any;
            apiURL = NODE_URL + (tipo == 'instrutor' ? "loginInstrutor" : "loginAluno");
            this.httpo.post(apiURL, JSON.stringify(dados), options)
                .toPromise()
                .then(
                    res => {
                        results = res;
                        resolve(results);
                    },
                    msg => {
                        reject(msg);
                    }
                )
                .catch(
                    err => {
                      reject(err);
                        // // console.log(err);
                    }
                );
        });
    }

 async alertaToast(texto:string, mensagem?:any, duracao:any = 3000, pos:any = 'top') {
    const toast = await this.toastr.create({
      message: '<b>'+texto+'</b> / '+mensagem, 
      position: pos,
      duration: duracao
    });
    toast.present();

    setTimeout(() => {
      toast.dismiss();
    }, parseInt(duracao,10));
    // this.toast.show(texto, duracao, 'center').subscribe(
    //   toast => {
    //     // console.log(toast);
    //   }
    // );
    }

    validarFacial(socket:any, probe:string, candidate:string, idUsuario?:any):Promise<any> {

        return new Promise((resolve, reject) => { 
                this.postRequestUrl(NODE_URL+"validarFacial/instrutor", {
                            idUsuario: idUsuario,
                            candidate: candidate
                }).then((res:any) => {  
                        if(res && res.result && res.label == idUsuario) {
                            resolve(res);
                        }
                        else {
                            reject(false);
                        } 
                }, (err) => {
                  // console.log(err);
                  
                    reject(false);
                });
      });
  }
    validarFacialAluno(socket:any, probe:string, candidate:string, idUsuario?:any):Promise<any> {

        return new Promise((resolve, reject) => { 
                this.postRequestUrl(NODE_URL+"validarFacial/v2", {
                            idUsuario: idUsuario,
                            candidate: candidate
                }).then((res:any) => {  
                        if(res && res.result && res.label == idUsuario) {
                            resolve(res);
                        }
                        else {
                            reject(false);
                        } 
                }, (err) => {
                  // console.log(err);
                  
                    reject(false);
                });
      });
  }

    private tratarNomeDevice(device:string) {
     if(device == 'Front Camera')
       return "Câmera frontal";
     else if(device == 'Back Camera')
       return "Câmera traseira";
     else
       return device;
    }
    public async getDevices():Promise<Devices> {
        return new Promise((resolve, reject) => {
          this.platform.ready().then(() => {  
                navigator.mediaDevices.enumerateDevices().then((mediaDevices:MediaDeviceInfo[]) => {
                    let devicesBruto:any = [];

                        for(let m = 0; m < mediaDevices.length; m++) {
                            if(mediaDevices[m].deviceId == 'default') {
                                mediaDevices.splice(m, 1);
                            }
                        }
                        if(cordova.plugins.EnumerateDevicesPlugin) {
                           cordova.plugins.EnumerateDevicesPlugin.getEnumerateDevices().then(devices => {
                               // console.log("Devices navegador", mediaDevices );
                               // console.log("Devices nativos", devices);
                                  for(let i = 0; i < mediaDevices.length; i++) {
                                      if(mediaDevices[i].deviceId != 'default') {
                                          devicesBruto.push({
                                              deviceId: mediaDevices[i].deviceId,
                                              groupIp: mediaDevices[i].groupId,
                                              kind: mediaDevices[i].kind,
                                              label: this.tratarNomeDevice(devices[i].label)
                                          });
                                      }
                                  }
                                  resolve(devicesBruto);
                           });  
                         }
                         else {
                           resolve(mediaDevices);
                         }

                }, () => {

                });
              });
        });
    }
    public iniciarCamera(camera:string = 'rear') { 
    //   this.platform.ready().then(() => {
    //   const cameraPreviewOpts: CameraPreviewOptions = {
    //     x: 0,
    //     y: 0,
    //     width: window.screen.width,
    //     height: (window.screen.height - 200),
    //     camera: "rear",
    //     tapPhoto: false,
    //     previewDrag: false,
    //     toBack: false,
    //     alpha: 1
    //   };

    //   try {
    //     this.cameraPreview.startCamera(cameraPreviewOpts).then(
    //       (res) => {
    //         // console.log(res)
    //       },
    //       (err) => {
    //         // console.log(err)
    //       });
    //   }
    //   catch(err) {
    //     // console.log("Erro", err);
    //   }
    // });
    }
    public alterarCamera() { 
      // this.cameraPreview.switchCamera();
    }
    public fecharCamera() { 
      // this.platform.ready().then(() => {
      //   try {
      //     this.cameraPreview.stopCamera();
      //   }
      //   catch(err) {
      //     // console.log(err);
      //   }
      // });
    }
    public capturarCamera() { 
      return new Promise((resolve, reject) => {
        reject(false);
      //   this.platform.ready().then(() => {
      //     try {
      //       this.cameraPreview.takePicture(this.pictureOpts).then((foto) => {
      //         resolve(foto);
      //       }, (err) => {
      //         // console.log(err);
      //         reject(err);
      //       });
      //     }
      //     catch(err) {
      //       // console.log(err);
      //       reject(err);
      //     }
      //   }); 
      });
    }

  public getImgPadrao() {
    return "assets/img/avatar-padrao.png";
  } 
  download(url: string): Observable<Blob> {
    return this.httpo.get(url, {
      responseType: 'blob'
    })
  }
  public camelize(s:any) {
    return (s && s[0].toUpperCase() + s.slice(1)) || "";
  }
}
