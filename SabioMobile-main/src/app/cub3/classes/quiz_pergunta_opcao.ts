import * as _ from 'lodash'; 

export class QuizPerguntaOpcao {
    id: number;
    titulo: string;
    correta: boolean; 

    constructor(dados?:any) {  
        if(dados) { 
            _.assignIn(this, dados);
        }
    } 
}