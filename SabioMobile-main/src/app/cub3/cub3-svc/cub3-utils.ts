
import {IMAGE_DIR, CUB3_CONTA, AUTH_TOKEN} from '@cub3/cub3-config';
import {Usuario} from '@cub3/classes/usuario'; 

export class StorageUtils {

    static getItem(itemName:string):any {
        if(localStorage.getItem(itemName) != 'undefined')
            return JSON.parse(localStorage.getItem(itemName));
        else
            return null;
    } 
    static setItem(titulo:string, dados:any):void {
        localStorage.setItem(titulo,JSON.stringify(dados));
    }
    
    static hasToken():boolean {
        return !!this.getItem(AUTH_TOKEN);
    }
    static getToken():string {
        if(this.hasToken()) {
            return this.getItem(AUTH_TOKEN);
        }
    }
    static setToken(token:string):void {
        localStorage.setItem(AUTH_TOKEN,JSON.stringify(token));
    }
    static removeToken():void {
        localStorage.removeItem(AUTH_TOKEN);
    }
    static hasAccount():boolean {
        return !!this.getItem(CUB3_CONTA);
    }
    static getAccount():Usuario {
        if(this.hasAccount() && this.getItem(CUB3_CONTA) != 'undefined') {
            let user:Usuario = new Usuario(this.getItem(CUB3_CONTA));   

            return user;
        }
        else
            return new Usuario();
    } 
    static setAccount(account:any):void {
        localStorage.setItem(CUB3_CONTA,JSON.stringify(account));
    }
    static removeAccount():void {
        localStorage.removeItem(CUB3_CONTA);
    }
    static logout():void {
        localStorage.clear();
    }
    static generateUUID() {
          // Cria um array de bytes aleatórios
          const randomBytes = new Uint8Array(16);
          crypto.getRandomValues(randomBytes);

          // Versão 4 do UUID (RFC4122)
          randomBytes[6] &= 0x0f;
          randomBytes[6] |= 0x40;
          randomBytes[8] &= 0x3f;
          randomBytes[8] |= 0x80;

          // Converte o array de bytes em uma string hexadecimal
          let uuid = '';
          for (let i = 0; i < 16; i++) {
            uuid += randomBytes[i].toString(16).padStart(2, '0');
          }

          return uuid;
        }
}