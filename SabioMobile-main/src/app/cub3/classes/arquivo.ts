import * as _ from 'lodash'; 

export class Arquivo {
    arquivo: string;
    id: any;
    enviado: number;
    arquivo_tipo:any;
    arquivo_nome:string;

    constructor(dados?:any) {  
        if(dados) { 
            _.assignIn(this, dados);
        }
    } 
}