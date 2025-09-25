import * as _ from 'lodash';
import {IMAGE_DIR, SITE_URL} from '../cub3-config'; 
import {UsuarioTipo} from "@cub3/classes/usuario_tipo";
import {InstrutorAssinatura} from "@cub3/classes/instrutor_assinatura";

export class Usuario {
    id:number = null;
    idfProfissional:number = null;
    ano_letivo:number = null;
    chave_acesso:string = "";
    logado:number = 0;
    nome:string = "Usuário";
    perfil:string = "";
    permissoes:any = {};
    senha:string = "";
        assinatura:InstrutorAssinatura = new InstrutorAssinatura();
    tipo:string = "";
    foto:any;
    ultimaConexao:any;
    celular:string = "";
    usuario:string = "";
    avatar:string = "/assets/img/avatar-padrao.png";
    escola:any;
    usuarioTipo:UsuarioTipo = new UsuarioTipo();
    cpf:string = "";
    email:string = "";
    desPerfil:string = "";

    constructor(usuario?:any) {
        if(usuario) {
            _.assignIn(this, usuario);
        }
    } 
    getAvatar() { 
        try {
            if(this.isBase64(this.avatar))
                return this.avatar;
            else if(this.avatar.search("uploads/") != -1){
                return this.avatar ? `${SITE_URL}${this.avatar}` : `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;
            }
            else if(this.avatar.search("://") != -1)
                return this.avatar ? `${IMAGE_DIR}${this.avatar}` : `${IMAGE_DIR}/others/uploads/avatar/padrao.png`;
            else
                return this.avatar;
        }
        catch(e) {
            return this.avatar;
        }
    
    }
    getNome() {
        return this.nome;
    }
    getPrimeiroNome() {
        const aux = this.nome.split((this.nome.search("-") == -1 ? " " : "-" ));
        return aux[0];
    }
    getNomeFormatado() {
        const aux = this.nome.split((this.nome.search("-") == -1 ? " " : "-" ));
        return `${aux[0]}${aux.length > 1 ? ' '+aux[aux.length-1] : ''}`;
    }
    isBase64(str) {
        try {
            return btoa(atob(str)) == str;
        } catch (err) {
            return false;
        }
    }
}