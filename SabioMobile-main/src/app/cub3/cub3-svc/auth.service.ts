import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StorageUtils } from "@cub3/utils/storage.utils";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, switchMap } from 'rxjs/operators';
import { NODE_URL } from '@cub3/cub3-config';
import { Cub3SvcProvider } from './cub3-svc';
// -----------------------------------------------------------------------------------------------------
// @ AUTH UTILITIES
//
// Methods are derivations of the Auth0 Angular-JWT helper service methods
// https://github.com/auth0/angular2-jwt
// -----------------------------------------------------------------------------------------------------

export class AuthUtils
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Is token expired?
     *
     * @param token
     * @param offsetSeconds
     */
    static isTokenExpired(token: string, offsetSeconds?: number): boolean
    {
        // Return if there is no token
        if ( !token || token === '' )
        {
            return true;
        }

        // Get the expiration date
        const date = this._getTokenExpirationDate(token);

        offsetSeconds = offsetSeconds || 0;

        if ( date === null )
        {
            return true;
        }

        // Check if the token is expired
        return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Base64 decoder
     * Credits: https://github.com/atk
     *
     * @param str
     * @private
     */
    private static _b64decode(str: string): string
    {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let output = '';

        str = String(str).replace(/=+$/, '');

        if ( str.length % 4 === 1 )
        {
            throw new Error(
                '\'atob\' failed: The string to be decoded is not correctly encoded.'
            );
        }

        /* eslint-disable */
        for (
            // initialize result and counters
            let bc = 0, bs: any, buffer: any, idx = 0;
            // get next character
            (buffer = str.charAt(idx++));
            // character found in table? initialize bit storage and add its ascii value;
            ~buffer &&
            (
                (bs = bc % 4 ? bs * 64 + buffer : buffer),
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                bc++ % 4
            )
                ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
                : 0
        )
        {
            // try to find character in table (0-63, not found => -1)
            buffer = chars.indexOf(buffer);
        }
        /* eslint-enable */

        return output;
    }

    /**
     * Base64 unicode decoder
     *
     * @param str
     * @private
     */
    private static _b64DecodeUnicode(str: any): string
    {
        return decodeURIComponent(
            Array.prototype.map
                 .call(this._b64decode(str), (c: any) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                 .join('')
        );
    }

    /**
     * URL Base 64 decoder
     *
     * @param str
     * @private
     */
    private static _urlBase64Decode(str: string): string
    {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch ( output.length % 4 )
        {
            case 0:
            {
                break;
            }
            case 2:
            {
                output += '==';
                break;
            }
            case 3:
            {
                output += '=';
                break;
            }
            default:
            {
                throw Error('Illegal base64url string!');
            }
        }
        return this._b64DecodeUnicode(output);
    }

    /**
     * Decode token
     *
     * @param token
     * @private
     */
    private static _decodeToken(token: string): any
    {
        // Return if there is no token
        if ( !token )
        {
            return null;
        }

        // Split the token
        const parts = token.split('.');

        if ( parts.length !== 3 )
        {
            throw new Error('The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
        }

        // Decode the token using the Base64 decoder
        const decoded = this._urlBase64Decode(parts[1]);

        if ( !decoded )
        {
            throw new Error('Cannot decode the token.');
        }

        return JSON.parse(decoded);
    }

    /**
     * Get token expiration date
     *
     * @param token
     * @private
     */
    private static _getTokenExpirationDate(token: string): Date | null
    {
        // Get the decoded token
        const decodedToken = this._decodeToken(token);

        // Return if the decodedToken doesn't have an 'exp' field
        if ( !decodedToken.hasOwnProperty('exp') )
        {
            return null;
        }

        // Convert the expiration date
        const date = new Date(0);
        date.setUTCSeconds(decodedToken.exp);

        return date;
    }
}

@Injectable({
  providedIn: 'root'
})
export class Cub3AuthService {

  authState = new BehaviorSubject(false);
  private _authenticated: boolean = false;

  constructor(
    private router: Router,
    private storage: Storage,
    private _httpClient: HttpClient, 
    private injector:Injector, 
    private platform: Platform,
    public toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  set accessToken(token: string)
  {
      localStorage.setItem('accessToken', token);
  }

  get accessToken(): string
  {
      return localStorage.getItem('accessToken') ?? '';
  }
  async ifLoggedIn() {
    let acc:any = StorageUtils.getAccount(); 

      if (acc && acc.id != null) {
        this.authState.next(true);
      }
      else {
        this.router.navigate(['login']);        
      }
  }

 
  logout() {
    this.storage.remove('USER_INFO').then(() => {
      this.router.navigate(['login']);
      this.authState.next(false);
    });
  }

  signInUsingToken(): Observable<any>
  {
      let token: any = StorageUtils.getToken();
      console.log("Token", token);
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'q=0.8;application/json;q=0.9',
          'Authorization': token
      }); 
      const options = {
          headers: headers
      };
      return this._httpClient.get(NODE_URL+'verificarSessao', options).pipe(
          catchError((err) =>{ 
              return of(false);
          }
          ),
          switchMap((response: any) => {
              if(response && response.result) {
                  this.accessToken = token;
                  this._authenticated = true;
                  // this._userService.user = StorageUtils.getAccount();

                  return of(true);
              }
              else
                  return of(false);
          })
      );
  }

  isAuthenticated(): Observable<boolean> {
 
    console.log("Auth State", this._authenticated);
    // if(StorageUtils.getToken() == null || StorageUtils.getToken() == undefined) {
    //     // Check if the user is logged in
    //     if ( this._authenticated )
    //     {
    //         return of(true);
    //     }

    //     // Check the access token availability
    //     if ( !this.accessToken )
    //     {
    //         return of(false);
    //     }
      

        // Check the access token expire date
        
        // if ( AuthUtils.isTokenExpired(this.accessToken) )
        // {
        //     return of(false);
        // }
      // }

        // If the access token exists and it didn't expire, sign in using it
        // try {
        //     return this.signInUsingToken();
        // }
        // catch(err) {
        //     return of(false);
        // }
        if(StorageUtils.getToken() == null || StorageUtils.getToken() == undefined) {
            return of(false);
        }
        else
            return of(true);
 
  }



}