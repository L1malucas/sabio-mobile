import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import {StorageUtils} from '@cub3/utils/storage.utils';
import {Router, ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import * as moment from 'moment';

@Component({
  selector: 'app-academico-ocorrencia-novo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './academico-ocorrencia-novo.page.html',
  styleUrls: ['./academico-ocorrencia-novo.page.scss'],
})
export class AcademicoOcorrenciaNovoPage implements OnInit {

	turmaAtiva:any = {
		NME_TURMA: ''
	};
	dados:any = {
  		IDF_AULA: '',
		DAT_AULA: '',
		IDF_TURMA: '',
		IDF_PROFISSIONAL: '',
		IDF_DISCIPLINA: '',
		DES_ASSUNTO: '',
		OBSERVACAO: '',
		SIT_REGISTRO: '',
	};
	turma:any;
  turmas:any[] = [];
	data:any = {MOB_DISCIPLINAS: []};
	usuario:any = StorageUtils.getAccount();

	carregando:boolean = true;
	ocorrencia:any = {
    OBSERVACAO: '',
    TXT_OCORRENCIA: ''
  };
	  alunos:any = [];
	  tipos:any = []; 

  constructor(
  	public cub3Svc:Cub3SvcProvider,
  	private location:Location,
  	private cub3Db:Cub3DbProvider,
    private cd:ChangeDetectorRef,
  	private route:ActivatedRoute,
  	private router:Router
  	) { }
  ngOnInit() {
  	this.init();
  }

  init() {

  	this.getAlunos();
  	this.getTipos();
  }
  async submit() { 
    let camposObrigatorios:any[] = [
      // {id:'TXT_OCORRENCIA','label': 'Detalhes da ocorrência'},   
      {id:'IDF_OCORRENCIA', 'label': 'Ocorrência'}, 
      {id:'IDF_ALUNO', 'label': 'Aluno'}
    ];

    let erros:any = [],
      i:number = 0;
      for(let item of camposObrigatorios) {
        if(!this.ocorrencia[item.id] || this.ocorrencia[item.id] == ''){
          erros.push(item.label);
        }
        i++;
      }

    if(erros.length > 0){
      let aux:any = erros.join(", ");
      this.cub3Svc.alerta("Ops!","Campo(s) obrigatório(s): <b>"+aux+"</b>");
      return;
    }
    else { 
    	let dados:any = {
    		IDF_PROFISSIONAL: this.usuario.id,
    		ANO_LETIVO: this.usuario.ano_letivo,
    		// LOG_LOGIN: this.usuario.usuario,
    		// LOG_CHAVE: this.usuario.chave_acesso,
    		IDF_OCORRENCIA: this.ocorrencia.IDF_OCORRENCIA,
    		DAT_OCORRENCIA: moment().format("YYYY-MM-DD HH:mm:ss"),
    		IDF_ALUNO: this.ocorrencia.IDF_ALUNO,
    		// TIP_REGISTRO: '',
    		OBSERVACAO: this.ocorrencia.OBSERVACAO,
    		TXT_OCORRENCIA: this.ocorrencia.TXT_OCORRENCIA
    	}
    	try{

        let carregar:any = await this.cub3Svc.carregar(1);
        this.data = StorageUtils.getItem("data");
        
        let ocorrencias = this.data.MOB_OCORRENCIA || [];
        let alunos = this.data.MOB_ALUNOS || [];
        
        console.log([ocorrencias, alunos]);
        // Check if the arrays are not undefined
        if (!ocorrencias || !alunos) return;
        
        console.log("Obtendo ocorrências locais");
        let result = ocorrencias
          .map(ocorrencia => {
            let aluno = alunos.find(aluno => aluno.IDF_ALUNO == ocorrencia.IDF_ALUNO);
        
            // Check if IDF_ALUNO exists before adding the record to the array
            return (aluno && aluno.IDF_ALUNO) ? {...ocorrencia, aluno} : null;
          })
          .filter(ocorrencia => ocorrencia !== null); // Remove null values from the array
        
        if(result.length > 0) {
          dados.IDF_OCORRENCIA_LOCAL = result.length;
        }
        else {
          dados.IDF_OCORRENCIA_LOCAL = Math.floor(+new Date() / 1000);  
        }
        
        this.cub3Db.addStorage("MOB_OCORRENCIA", dados).then(() => {
          this.cub3Svc.alerta("Registro de ocorrência", "Registro inserido com sucesso!");
          this.location.back();
          carregar.dismiss();
        }, (err) => {
          console.log("Ocorreu um erro", err);
          carregar.dismiss();
        });

    	}
    	catch {
    		console.log("Ocorreu um erro");
  	  		this.location.back();		
    	}
  }
  }
  async getAlunos() {
    this.carregando = true;

    this.turmas = await this.cub3Svc.getTurmas();
    this.alunos = await this.cub3Svc.listarAlunos(this.turmas); 

    this.alunos.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordenar alunos pelo nome

    this.carregando = false;
    this.cd.markForCheck();
}

  async getTipos() {
    this.data = StorageUtils.getItem("data");
    this.carregando = true;
  
    // let ocorrencias = this.data.MOB_OCORRENCIAS;
  
    // console.log([ocorrencias]);
    // // Check if the array is not undefined
    // if (!ocorrencias) return;
  
    // console.log("Obtendo tipos de ocorrências");
    // let result = ocorrencias
    //   .map(ocorrencia => {
    //     // Check if IDF_OCORRENCIA exists before adding the type to the array
    //     return (ocorrencia && ocorrencia.IDF_OCORRENCIA) ? ocorrencia : null;
    //   })
    //   .filter(ocorrencia => ocorrencia !== null); // Remove null values from the array
  
    this.tipos = [{
      IDF_OCORRENCIA:1,
      DES_OCORRENCIA: "Acidente"
    }, {
      IDF_OCORRENCIA:2,
      DES_OCORRENCIA: "Agressão física ao colega"
    },{
      IDF_OCORRENCIA:3,
      DES_OCORRENCIA: "Agressão física ao professor"
    }, {
      IDF_OCORRENCIA:99,
      DES_OCORRENCIA: "Outras"
    }];
    console.log(this.tipos);
    this.carregando = false;
  }
}
