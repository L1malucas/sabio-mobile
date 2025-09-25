import { Component, OnInit } from '@angular/core';
import {StorageUtils} from '@cub3/utils/storage.utils';

import {Router, ActivatedRoute} from "@angular/router";
import {Cub3DbProvider} from '@cub3/cub3-db/cub3-db';
import {Cub3SvcProvider} from '@cub3/cub3-svc/cub3-svc';
import { WheelSelector } from '@ionic-native/wheel-selector/ngx';
import {Location} from "@angular/common";
@Component({
  selector: 'app-academico-imc',
  templateUrl: './academico-imc.page.html',
  styleUrls: ['./academico-imc.page.scss'],
})
export class AcademicoImcPage implements OnInit {

  jsonData:any = {
    notas1: [],
    notas2: [],
    peso: []
  };

  dados:any = {};
  constructor(
  	private route:ActivatedRoute,
  	private router:Router,
  	private location:Location,
  	private selector:WheelSelector,
  	private cub3Svc:Cub3SvcProvider,
  	private cub3Db:Cub3DbProvider
  	) { 

  }

  popularNotas() {
    for (var i = 0; i <= 2; i++) {
        this.jsonData.notas1.push({'description':i+"" })
    }
      for (var j = 0; j <= 99; j++) {
        this.jsonData.notas2.push({'description':"."+j+"" })
      }
  }
  popularFaltas() {
    for (var i = 30; i <= 110; i++) {
      this.jsonData.peso.push({'description': i+""});
    }
  }
 selecionarPeso() {
  try {
   this.selector.show({
     title: "Qual o peso em KG?",
     items: [
       this.jsonData.peso
     ],
     positiveButtonText: "Selecionar",
     negativeButtonText: "Cancelar",
   }).then(
     result => {
       console.log(result[0].description + ' at index: ' + result[0].index);
       this.dados.peso = result[0].description;
     },
     err => console.log('Error: ', err)
     );
    }
    catch (e){ 
      console.log((<Error>e).message); 
    }
 }
 selecionarAltura() {
  try {
     this.selector.show({
       title: "Qual a altura em metros?",
       items: [
         this.jsonData.notas1, this.jsonData.notas2
       ],
       positiveButtonText: "Selecionar",
       negativeButtonText: "Cancelar",
     }).then(
       result => {
         console.log(result[0].val + ' at index: ' + result[0].index);
       this.dados.altura = result[0].description+""+result[1].description;
       },
       err => console.log('Error: ', err)
       );
    }
    catch (e){ 
      console.log((<Error>e).message); 
    }
 }
 salvar() { 
    let simulado:any = {peso:this.dados.peso, altura:this.dados.altura, resultado: this.getImc('texto'), data: new Date()};

    let imc:any = StorageUtils.getItem("imc");
    if(!imc || (imc && imc.length == 0)) {
      imc = [];
    }
      imc.push(simulado);

      StorageUtils.setItem("imc", imc);

 }

 getImc(tipo:any):any {
 	let valor:any = (parseInt(this.dados.peso,10)/(parseFloat(this.dados.altura) * parseFloat(this.dados.altura))).toFixed(2);;

 	switch (tipo) {
 		case "valor":
 			return valor;
 		
 		case "texto":
 				if(valor < 18.5)
 					return "Magreza - 0";
 				else if(valor => 18.5 && valor < 25)
 					return "Normal - 0";
 				else if(valor >= 25 && valor < 30)
 					return "Sobrepeso - I";
 				else if(valor >= 30 && valor < 40)
 					return "Obesidade - II";
 				else if(valor >= 40)
 					return "Obesidade Grave - III";
 			break;
 	}
 	
 }
  ngOnInit() {
    this.popularFaltas();
    this.popularNotas();
  }

 getResultados() {
   let imc:any = StorageUtils.getItem("imc");
   if(!imc)
     imc = [];
   
   return imc;
 }
}
