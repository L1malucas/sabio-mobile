import {Platform, NavController, AlertController, LoadingController} from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'; 
import {DB_NAME, APP_NAME} from '../cub3-config';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx'; 
import { StorageUtils } from '@cub3/utils/storage.utils';
import * as alasql from 'alasql';
import { Storage } from '@ionic/storage';

export const browserDBInstance = (db) => {

  return {
    executeSql: (sql) => { 
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(sql, [], (tx, rs) => {
            resolve(rs)
          }, (err) => {
            reject(err);
          });
        }, (err) => { 
          reject(err);
        });
      })
    },
    sqlBatch: (arr) => {
      return new Promise((r, rr) => {
        let batch = [];
        db.transaction((tx) => {
          for (let i = 0; i < arr.length; i++) {
            batch.push(new Promise((resolve, reject) => {
              tx.executeSql(arr[i], [], () => { 
                resolve(true);
              }, (err) => {
                reject(err);
              })
            }))
            Promise.all(batch).then((res) => { 
              r(true);
            }, (err) => {
              console.log("Erro ao executar", err);
              rr(err);
            });
          }
        });
      })
    }
  }
}
declare var window: any;
 
@Injectable({
  providedIn: 'root'
})
export class Cub3DbProvider {
  public text : string = "";
  public db :any = null;
  public arr :any[] = [];

  constructor(public http: HttpClient,
    public platform: Platform,  
    private storage:Storage,
    public sqlite: SQLite) {

  }  
  errorHandler(transaction, error) {
  } 
  successHandler(transaction) {
  }
  isInt(value) {
    return !isNaN(value) && 
           parseInt((value)) == value && 
           !isNaN(parseInt(value, 10));
  } 
    isApp(): boolean {
      return (
        ((this.platform.is('cordova') && this.platform.is('ios')) || (this.platform.is('cordova') && this.platform.is('android') ))
      );
    }

  iniciar():Promise<any> {
    return new Promise((resolve, reject) => {

            if (!this.platform.is('cordova')) {
              let db = window.openDatabase(DB_NAME, '1.0', 'DEV', 5 * 1024 * 1024);
              this.db = browserDBInstance(db);
              this.http.get("assets/cub3/sql/init.json", {responseType: 'text'})
                .toPromise()
                .then(
                  (res:any) => {     
                    // if(res && res.script){
                      if(res){
                      // let txt:any = res.script.split(";");
                      let txt:any = res.split(";");
                        for (var i = 0; i < txt.length; i++) { 
                              this.db.executeSql(txt[i])
                                .then(() => {
                                  resolve("Tabela criada");
                                })
                                .catch((e:any) => reject(e));
                        }                   
                    }
                    else {
                      reject(false);
                    }
                  },
                  msg => {  
                    reject(msg);
                  }
                )
                .catch(
                  err => {
                    reject(err);
                  }
                  );

            } 
            else {
              this.db = this.sqlite.create({
                  name: DB_NAME,
                  location: 'default'
                })
                      .then((db: SQLiteObject) => { 
                    // this.http.get("https://api.portaleducanet.com.br/script/")

                    this.http.get("assets/cub3/sql/init.json", {responseType: 'text'})
                      .toPromise()
                      .then(
                        (res:any) => {     
                          // if(res && res.script){
                            if(res){
                            // let txt:any = res.script.split(";");
                            let txt:any = res.split(";");
                              for (var i = 0; i < txt.length; i++) { 
                                    db.executeSql(txt[i], [])
                                      .then(() => {
                                        resolve("Tabela criada");
                                      })
                                      .catch((e:any) => reject(e));
                              }                   
                          }
                          else {
                            reject(false);
                          }
                        },
                        msg => {  
                          reject(msg);
                        }
                      )
                      .catch(
                        err => {
                          reject(err);
                        }
                        );


                      })
                      .catch(e => reject(e));
                } 
              });
  }
  /* Início do CRUD */
  async add(tbl: string, dados: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Get the current data from storage
      let data = StorageUtils.getItem("data");
  
      // Check if the table exists in the data, if not, create it
      if (!data[tbl]) {
        data[tbl] = [];
      }
  
      // Add the new data to the table
      data[tbl].push(dados);
  
      // Update the data in storage
      StorageUtils.setItem("data", data);
  
      resolve(true);
    });
  }

  get(tbl: string) {
  // Get the current data from storage
  let data = StorageUtils.getItem("data");

  // Check if the table exists in the data, if not, return an empty array
  if (!data[tbl]) {
    return Promise.resolve([]);
  }

  // Return the data from the table
  return Promise.resolve(data[tbl]);
}
async getStorage(tbl: string) {
// Get the current data from storage
// let data = StorageUtils.getItem("data");
let data = await this.storage.get(tbl);

// Check if the table exists in the data, if not, return an empty array
if (!data) {
  return Promise.resolve([]);
}

// Return the data from the table
return Promise.resolve(data);
}
async setStorage(tbl: string, dados: any) {
  try {
  await this.storage.set(tbl, dados);
  }
  catch(e) {
    console.log('Erro ao salvar', e);
  }
}
// Método addStorage, que irá adicionar um novo registro a uma tabela no storage
async addStorage(tbl: string, dados: any) { 
  try {
    let data = await this.storage.get(tbl);
  
    if (!data) {
      data = [];
    }
  
    data.push(dados);
  
    await this.storage.set(tbl, data);

    return true;
  }
  catch(e) {
    console.log('Erro ao adicionar', e)
    return false;
  }
}
// Método delStorage, que irá excluir um registro de uma tabela no storage
delStorage(tbl: string, id: any, idf?: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    let data = await this.storage.get(tbl);

    if (!data) {
      reject(false);
    }

    let idField = idf || 'id';
    let index = data.findIndex(item => item[idField] === id);

    if (index === -1) {
      reject(false);
    }

    data.splice(index, 1);

    await this.storage.set(tbl, data);

    resolve(true);
  });
}
// Método updateStorage, que irá atualizar um registro de uma tabela no storage
async updateStorage(tbl: string, dados: any, id: any = null) {
  let data = await this.storage.get(tbl);
 
  if (!data) {
    return false;
  }
 
  let idField = id || 'id';
  let index = data.findIndex(item => item[idField] === dados[idField]);
 
  if (index === -1) {
    return false;
  }
 
  data[index] = dados;
 
  await this.storage.set(tbl, data);
 
  return true;
}
query(txt: string) {
  return new Promise((resolve, reject) => {
    // Parse the SQL query to get the table names
    let matches = txt.match(/SELECT \* FROM (\w+)((?: JOIN (\w+) ON .+)+)/i);
    if (!matches) {
      resolve([]);
    }

    // Get the current data from storage
    let data = StorageUtils.getItem("data");

    // Extract the base table and join tables
    let baseTable = matches[1];
    let joinParts = matches[2].split('JOIN').slice(1);

    // Check if the tables exist in the data, if not, return an empty array
    if (!data[baseTable] || joinParts.some(part => !data[part.trim().split(' ')[0]])) {
      resolve([]);
      return;
    }

    // Perform the join operation
    let result = data[baseTable];
    for (let part of joinParts) {
      let joinTable = part.trim().split(' ')[0];
      let newResult = [];
      for (let item1 of result) {
        for (let item2 of data[joinTable]) {
          if (item1.id === item2.id) { // Adjust this line to match your JOIN condition
            newResult.push({...item1, ...item2});
          }
        }
      }
      result = newResult;
    }

    // Return the result of the join operation
    resolve(result);
  });
}
async queryStorage(txt: string) {
  return new Promise(async (resolve, reject) => {
    // Parse the SQL query to get the table names
    let matches = txt.match(/SELECT .* FROM (\w+)((?: LEFT JOIN \w+ ON .+)+)?/i);
    if (!matches) {
      resolve([]);
      return;
    }

    console.log("Matches", [matches, txt]);

    // Extract the base table and join tables if any
    let baseTable = matches[1];
    let joinParts = matches[2] ? matches[2].split('LEFT JOIN').slice(1) : [];

    console.log("Base Table", baseTable);
    console.log("Join Parts", joinParts);

    // Check if the base table exists in the storage
    let baseTableData = await this.storage.get(baseTable);
    if (!baseTableData || !Array.isArray(baseTableData)) {
      console.error(`Base table data is not available or not an array: ${baseTable}`);
      resolve([]);
      return;
    }

    // Check if the join tables exist in the storage or handle special case for MOB_TURMAS_ALUNOS
    let joinTableDatas = [];
    for (let part of joinParts) {
      let joinTable = part.trim().split(' ')[0];
      let joinTableData;
      if (joinTable === 'MOB_TURMAS_ALUNOS') {
        joinTableData = [];
        const escolas = await StorageUtils.getItem("escolas");
        try {
          for (const escola of escolas['escolas']) {
            for (const turma of escola.turmas) {
              for (const aluno of turma.alunos) {
                joinTableData.push({
                  id: aluno.id,
                  nome: aluno.nome,
                  idTurma: turma.id,
                  nomeEscola: escola.nome
                });
              }
            }
          }
        }
        catch(e) {
          
      }
      } else {
        joinTableData = await this.storage.get(joinTable);
      }

      if (!joinTableData || !Array.isArray(joinTableData)) {
        console.error(`Join table data is not available or not an array: ${joinTable}`);
        resolve([]);
        return;
      }
      joinTableDatas.push(joinTableData);
    }

    // Perform the join operation
    let result = baseTableData;
    for (let i = 0; i < joinParts.length; i++) {
      let joinTableData = joinTableDatas[i];
      let newResult = [];
      for (let item1 of result) {
        for (let item2 of joinTableData) {
          // Assuming that 'id' is the join key; this should be adjusted according to your actual join condition
          if (item1.id === item2.id) {
            newResult.push({ ...item1, ...item2 });
          }
        }
      }
      result = newResult;
    }

    resolve(result);
  });
}


  del(tbl: string, id: any, idf?: string) {
    return new Promise((resolve, reject) => {
      // Get the current data from storage
      let data = StorageUtils.getItem("data");
  
      // Check if the table exists in the data, if not, reject the promise
      if (!data[tbl]) {
        reject(new Error(`Table ${tbl} does not exist`));
        return;
      }
  
      // Find the index of the item to delete
      let idField = idf || 'id';
      let index = data[tbl].findIndex(item => item[idField] === id);
  
      // If the item was not found, reject the promise
      if (index === -1) {
        reject(new Error(`Item with ${idField} ${id} not found`));
        return;
      }
  
      // Remove the item from the table
      data[tbl].splice(index, 1);
  
      // Update the data in storage
      StorageUtils.setItem("data", data);
  
      resolve(true);
    });
  }
  truncate(tbl:any):Promise<any> {

    let query:any;

    if (!this.platform.is('cordova')) {
        if(Array.isArray(tbl)) {
          let aux:any = [];

            for (var i = tbl.length - 1; i >= 0; i--) {
               aux.push(`DELETE FROM ${tbl[i]}; `);
            }

            aux.push("VACUUM;");
            query = aux;
        }
        else {
          query = "DELETE FROM "+tbl+";"
        }
          
              console.log("Iniciando limpeza");
              let db = window.openDatabase(DB_NAME, '1.0', 'DEV', 5 * 1024 * 1024);
              this.db = browserDBInstance(db);
              return this.db.sqlBatch(query);
    }
    else {

        if(Array.isArray(tbl)) {
          let aux:any = [];

            for (var i = tbl.length - 1; i >= 0; i--) {
               aux.push(`DELETE FROM ${tbl[i]}; `);
            }

            aux.push("VACUUM;");

            query = aux.join(" ");
        }
        else {
          query = "DELETE FROM "+tbl+"; VACUUM;"
        }
          
        return new Promise((resolve, reject) => {
            this.sqlite.create({
              name: DB_NAME,
              location: 'default'
            })
              .then((db: SQLiteObject) => {
                db.executeSql(query, [])
                  .then(() => {
                    resolve(true);
                  })
                  .catch(e => {console.log(e); reject(e);});
              })
              .catch(e => {console.log(e); reject(e)});
          });
        }

  }
  update(tbl:any, dados:any, id:any = null) {
    var query = "UPDATE "+tbl+ " SET ",
        pos = 0;

        for(let key of (Object.keys(dados))) {
          if((Object.keys(dados).length - 1) > pos)
            query += key + " = '" + dados[key] + "', ";
          else
            query += key + " = '" + dados[key] + "' ";

          pos++;
        }
        if(id != null)
          query += " WHERE "+id + " = " + dados[id];

    if (!this.platform.is('cordova')) {
              let db = window.openDatabase(DB_NAME, '1.0', 'DEV', 5 * 1024 * 1024);
              this.db = browserDBInstance(db);
            return this.db.executeSql(query);
    }
    else {
    return this.sqlite.create({
      name: DB_NAME,
      location: 'default'
    })
      .then((db: SQLiteObject) => { 
          db.executeSql(query,[] )
            .then(() => {
              console.log("Dados atualizados");
            })
            .catch(e => console.log(e)); 
      })
      .catch(e => console.log(e));
    }

  }
}
