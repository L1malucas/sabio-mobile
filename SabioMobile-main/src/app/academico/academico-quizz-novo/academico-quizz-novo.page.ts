import { Component, OnInit } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Router, ActivatedRoute} from "@angular/router";
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import {Location} from "@angular/common";
import {Quiz, QuizPergunta, QuizPerguntaOpcao, Usuario} from "@cub3/classes";
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Plugins } from '@capacitor/core'; 
const { FileSelect } = Plugins;  
import { Platform } from '@ionic/angular';
import * as moment from "moment";
import { ChangeDetectorRef } from "@angular/core";


@Component({
  selector: 'app-academico-quizz-novo',
  templateUrl: './academico-quizz-novo.page.html',
  styleUrls: ['./academico-quizz-novo.page.scss'],
})
export class AcademicoQuizzNovoPage implements OnInit {

	dados:Quiz = new Quiz();
  carregando:boolean = false;
	usuario:Usuario = StorageUtils.getAccount();
  abaAtiva:any = "informacoes";

    editorOptions = {
      anchor_bottom:                false, 
      anchor_top:                   false,
      autoresize_bottom_margin:     10,
      autoresize_min_height:        40,
      branding:                     false, 
      language:                     'en', 
      inline:                       true,
      fixed_toolbar_container:      ".tiny-mce-toolbar",
      menubar:                      false, 
      statusbar:                    false, 
      default_link_target:          '_blank', 
      link_assume_external_targets: true, 
      placeholder: 'Digite a descrição...',
      target_list:                  false, 
      link_title:                   false,
      theme: 'silver',
    mobile: {
      theme: 'mobile',
      plugins: [ 'autosave', 'lists', 'autolink' ]
    },
      base_url: '/assets/tinymce',
      plugins:                      'autoresize link lists',
      toolbar:                      'undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist indent outdent | link unlink'
    };
  constructor(
    private cub3Svc:Cub3SvcProvider,
    private platform:Platform,
    private location:Location,
    public cdr: ChangeDetectorRef,
    private cub3Db:Cub3DbProvider,
    private selector:WheelSelector,
    private route:ActivatedRoute,
    private router:Router
    ) { }

  ngOnInit() {
      this.route.url.subscribe(() => {  
        if(this.route.snapshot.params.id && this.route.snapshot.params.id != 'undefined' ) {
          this.dados.id = this.route.snapshot.params.id;
          this.init();
        }
      });
  }
  async init() {
    this.usuario = StorageUtils.getAccount();
    const carregar:any = await this.cub3Svc.carregar(1);
    this.carregando = true;

    this.cub3Svc.getNode("quiz/visualizar?id="+this.dados.id).then((res:any) => {
      carregar.dismiss();
      if(res && res.dados){
        this.dados = new Quiz(res.dados);
      }
      setTimeout(() => {
        this.cdr.detectChanges();
        this.carregando = false;
      }, 300);

    }, () => {
      carregar.dismiss();
      this.carregando = false;
      this.location.back();
      this.cub3Svc.alerta("Ops!", "Quiz inválido.");
    });
  }
  addPergunta(slider) {
    this.dados.perguntas.push(new QuizPergunta({
      titulo: '',
      descricao: '',
      opcoes: []
    }));
    setTimeout(() => {
      slider.slideTo(this.dados.perguntas.length+1);
    }, 300);
  }
  delPergunta(pergunta:QuizPergunta) {
    if(!pergunta.id)
      this.dados.perguntas.splice(this.dados.perguntas.indexOf(pergunta), 1);
    else
      this.dados.perguntas[this.dados.perguntas.indexOf(pergunta)].status = 'EXCLUIDO';
  }
  delOpcao(pergunta:any, opc:any) {
    if(!opc.id)
      pergunta.opcoes.splice(pergunta.opcoes.indexOf(opc),1);
    else
      pergunta.opcoes[pergunta.opcoes.indexOf(opc)].status = 'EXCLUIDO';
  }
  salvarQuiz() {
  	let camposObrigatorios:any[] = [
	  	{id:'titulo','label': 'Título'}, 
	  	{id:'descricao', 'label': 'Descrição'} 
  	];
  	let erros:any = [],
  		i:number = 0;

  	for(let item of camposObrigatorios) {
  		if(!this.dados[item.id] || this.dados[item.id] == ''){
  			erros.push(item.label);
  		}
  		i++;
  	}

  	if(erros.length > 0){
  		let aux:any = erros.join(", ");
  		this.cub3Svc.alerta("Ops!","Campo(s) obrigatório(s): <b>"+aux+"</b>");
  		return;
  	}
      if(!this.dados.id) {
        this.cub3Svc.postNode("quiz/novo", this.dados).then((r: any) => { 
              if (r && r.result) { 
                      this.cub3Svc.alertaToast("Novo quiz", "Quiz criado com sucesso!", "success"); 
                      this.router.navigateByUrl('/app/academico/academico-quizz', {replaceUrl: true});
              } else { 
              this.cub3Svc.alerta("Ops!", "Não foi possível criar o quiz. Por favor, tente novamente ou entre em contato com o suporte técnico.");
              }
          }, (err) => { 
              this.cub3Svc.alerta("Ops!", "Não foi possível criar o quiz. Por favor, tente novamente ou entre em contato com o suporte técnico.");
          });
     }
     else {
        this.cub3Svc.postNode("quiz/atualizar", this.dados).then((r: any) => { 
              if (r && r.result) { 
                      this.cub3Svc.alertaToast("Novo quiz", "Quiz atualizado com sucesso!", "success"); 
                      this.router.navigateByUrl('/app/academico/academico-quizz', {replaceUrl: true});
              } else { 
              this.cub3Svc.alerta("Ops!", "Não foi possível criar o quiz. Por favor, tente novamente ou entre em contato com o suporte técnico.");
              }
          }, (err) => { 
              this.cub3Svc.alerta("Ops!", "Não foi possível criar o quiz. Por favor, tente novamente ou entre em contato com o suporte técnico.");
          });

     }
  }
  montarOpcoes(pergunta:any) {
    pergunta.opcoes = [];
    for(let i = 0; i < 4; i++)
      this.addOpcao(pergunta);
  }
  addOpcao(pergunta:any) {
    const id = pergunta.opcoes.length+1;
    pergunta.opcoes.push({
      id: null,
      ordem: id,
      valor: '',
      titulo: '',
      correta: false
    });
  }
}
