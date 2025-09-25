import * as _ from 'lodash'; 
import {Arquivo} from "./arquivo";

export class Tarefa {
	id:number;
    titulo: string;
    descricao: string;
    link: string;
    status:string;
    arquivos: Arquivo[] = [];

    constructor(dados?:any) {  
        if(dados) { 
            _.assignIn(this, dados);
        }
    } 
}