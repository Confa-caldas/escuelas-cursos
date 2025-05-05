import { Injectable } from "@angular/core";
import { HttpClient , HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";

import { environment } from "../../environments/environment";
import {
  User,
  Token,
  UserRegister,
  RememberPassword,
  ValidateQuestion,
  Session,
  MiPerfilConfa,
  GrupoFamiliar,
  GruposFamiliaresList,
} from "../interfaces/user.interface";

import { Md5 } from "ts-md5/dist/md5";
import { UtilitiesService } from "./utilities.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  private genericTokenSubject: BehaviorSubject<Token>;
  public genericToken: Observable<Token>;
  private currentTokenSubject: BehaviorSubject<Token>;
  public currentToken: Observable<Token>;
  private circularTokenSubject: BehaviorSubject<Token>;
  public circularToken: Observable<Token>;

  constructor(
    private http: HttpClient,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {
    let gtoken =
      this.cookieService.get("gtoken") !== ""
        ? JSON.parse(this.cookieService.get("gtoken"))
        : "";
    this.genericTokenSubject = new BehaviorSubject<Token>(gtoken);
    this.genericToken = this.genericTokenSubject.asObservable();

    let ptoken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : "";
    this.currentTokenSubject = new BehaviorSubject<Token>(ptoken);
    this.currentToken = this.currentTokenSubject.asObservable();

    let ctoken =
      this.cookieService.get("ctoken") !== ""
        ? JSON.parse(this.cookieService.get("ctoken"))
        : "";
    this.circularTokenSubject = new BehaviorSubject<Token>(ctoken);
    this.circularToken = this.circularTokenSubject.asObservable();
  }

  public get genericTokenValue(): Token {
    return this.genericTokenSubject.value;
  }

  public get currentTokenValue(): Token {
    return this.currentTokenSubject.value;
  }

  public get circularTokenValue(): Token {
    return this.circularTokenSubject.value;
  }

  private getQuery(query: string, bodyContent: any) {
    const url = `${environment.apiIngresoConfa}${query}`;
    const body = bodyContent;
    return this.http.post(url, body);
  }

  private getQueryToken(query: string, bodyContent: any,token:string) {
    const url = `${environment.apiIngresoConfa}${query}`;
    const body = bodyContent;

    let reqHeader  = new HttpHeaders({
      'Authorization': token
    });

    return this.http.post(url, body, { headers: reqHeader });
  }
  

  getToken(document: string, password: string) {
    let bodyToken = {
      parametro1: "" + Md5.hashStr(document.toString()),
      parametro2: "" + password,
      parametro3: "Web",
    };

    return (
      this.getQuery("auth", bodyToken)
        // return this.http.get('assets/data/token.json')
        .pipe(
          map((response: Token) => {
            if (response.token) {
              this.cookieService.set(
                "ptoken",
                JSON.stringify(response),
                1,
                "/",
                undefined,
                false,
                "Strict"
              );
              this.currentTokenSubject.next(response);
            }
            return response;
          })
        )
    );
  }

  getTokenBoletines(document: string, password: string) {
    let bodyToken = {
      parametro1: "" + Md5.hashStr(document),
      parametro2: "" + password,
      parametro3: "Web",
    };

    return (
      this.getQuery("auth", bodyToken)
        // return this.http.get('assets/data/token.json')
        .pipe(
          map((response: Token) => {
            if (response.token) {
              this.cookieService.set(
                "gtoken",
                JSON.stringify(response),
                1,
                "/",
                undefined,
                false,
                "Strict"
              );
              this.genericTokenSubject.next(response);
              /* 	this.currentTokenSubject.next(response); */
            }
            return response;
          })
        )
    );
  }

  getGenericToken() {
    let genericToken = {
      parametro1: environment.parametro1,
      parametro2: environment.parametro2,
      parametro3: "Web",
    };

    return this.getQuery("auth", genericToken).pipe(
      map((response: Token) => {
        if (response.token) {
          this.cookieService.set(
            "gtoken",
            JSON.stringify(response),
            1,
            "/",
            undefined, 
            false,
            "Strict"
          );
          this.genericTokenSubject.next(response);
        }
        return response;
      })
    );
  }

  private getQueryPOST(query: string, bodyContent: any) {
    const url = `${environment.apiCircular}${query}`;
    const body = bodyContent;

    return this.http.post(url, body);
  }

  getGenericTokenC() {
    let genericToken = {
      parametro1: environment.param1,
      parametro2: environment.param2,
    };

    return this.getQueryPOST("auth", genericToken).pipe(
      map((response: Token) => {
        if (response.token) {
          this.cookieService.set(
            "ctoken",
            JSON.stringify(response),
            1,
            "/",
            undefined,
            false,
            "Strict"
          );
          this.circularTokenSubject.next(response);
        }
        return response;
      })
    );
  }

  loginCredenciales(document: number, password: string) {
    let bodyValidate = {
      documento: document.toString(),
      clave: password.toString(),
    };

    return (
      this.getQuery("confa/metodo132", bodyValidate)
        /*  return this.http.get('assets/data/user.json') */
        .pipe(
          map((response: Session) => {
            return response;
          })
        )
    );
  }

  login(token: string) {
    let bodyValidate = {
      token: token.toString(),
    };

    return (
      this.getQuery("confa/metodo23", bodyValidate)
        // return this.http.get('assets/data/user.json')
        .pipe(
          map((response: User) => {
            // console.log(response)
            return response;
          })
        )
    );
  }

  loginNew(token: string) {
    let bodyValidate = {
      token: token.toString(),
    };

    return (
      this.getQuery("confa/metodo28", bodyValidate)
        // return this.http.get('assets/data/user.json')
        .pipe(
          map((response: Session) => {
            // console.log(response)
            return response;
          })
        )
    );
  }

  
  miPerfil(token: string) {
    let bodyValidate = {
      token: token.toString(),
    };

    return (
      this.getQuery("confa/metodo30", bodyValidate)
        // return this.http.get('assets/data/user.json')
        .pipe(
          map((response: MiPerfilConfa) => {
            // console.log(response)
            return response;
          })
        )
    );
  }

  logout() {
    // remove user from local storage to log user out
    // eliminar el usuario del almacenamiento local para cerrar la sesión del usuario

    this.cookieService.delete("gtoken");
    this.cookieService.delete("ptoken");
    this.cookieService.delete("ctoken");
    this.cookieService.deleteAll();
    localStorage.removeItem("gtoken");
    localStorage.removeItem("ptoken");
    localStorage.removeItem("ctoken");
    localStorage.removeItem("user");
    localStorage.removeItem("preguntas");
    localStorage.removeItem("userOrCompany");
    localStorage.removeItem("login");
    localStorage.removeItem("cc");
    localStorage.clear();
    this.currentTokenSubject.next(null);
    this.genericTokenSubject.next(null);
    this.circularTokenSubject.next(null);
    this.utilitiesService.currentUser = null;
    console.log("ENTRO A LOGOUT");
  }

  consultUserInformationNASFANew(document: number, token: string) {
    let bodyUser = {
      documento: document.toString(),
    };

    return this.getQueryToken("confa/metodo33", bodyUser, token ).pipe(
      map((response) => {
        return response["usuario"];
      })
    );
  }



  consultUserInformationINCONFA(document: number) {
    let bodyUser = {
      documento: document.toString(),
    };

    return this.getQuery("confa/metodo2", bodyUser).pipe(
      map((response) => {
        return response;
      })
    );
  }

  saveUser(userRegister: UserRegister) {
    return this.getQuery("confa/metodo12", userRegister).pipe(
      map((response) => {
        return response["respuesta"];
      })
    );
  }

  saveUserRegister(userRegister: UserRegister, token: string) {
    return this.getQueryToken("confa/metodo129", userRegister,token).pipe(
      map((response) => {
        return response["respuesta"];
      })
    );
  }

  confirmUserRegistration(parametro: string) {
    let body = {
      parametro: parametro.toString(),
      correoMd5: "",
    };

    return this.getQuery("confa/metodo13", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  confirmUserRegistrationConfa(parametro: string) {
    let body = {
      parametro: parametro.toString(),
      correoMd5: "",
    };

    return this.getQuery("confa/metodo131", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  actualizarDatos(body: any) {
    return this.getQuery("confa/metodo22", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  rememberPasswordDocumentUser(body: RememberPassword) {
    return this.getQuery("confa/metodo14", body).pipe(
      map((response) => {
        return response["respuesta"];
      })
    );
  }

  changePasswordNewUser(parametro: string, clave: string) {
    let body = {
      parametro: parametro.toString(),
      clave: clave.toString(),
      sistema: "Mi perfil",
    };

    return this.getQuery("confa/metodo116", body).pipe(
      map((response) => {
        return response["respuesta"];
      })
    );
  }

  changePasswordOldUser(documento: string, clave: string, clave1: string) {
    /*  console.log("Entró change 2"); */
    let body = {
      documento: documento.toString(),
      clave: clave.toString(),
      clave1: clave1.toString(),
      sistema: "Mi perfil",
    };

    return this.getQuery("confa/metodo115", body).pipe(
      map((response) => {
        /*  console.log("respuesta", response) */
        return response["respuesta"];
      })
    );
  }

  validateToken(token: string) {
    let bodyValidateToken = {
      token: token.toString(),
    };

    return this.getQuery("validarToken", bodyValidateToken).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /* Metodo que valida la respuesta de validacion, cuantos intentos lleva, bloquea usuario si son mas 3 intentos */
  validateQuestion(documento: string, validacion: boolean, momento: string) {
    let bodyValidateQuestion = {
      documento: documento.toString(),
      respuestas: validacion,
      momento: momento,
    };

    /* 	console.log(bodyValidateQuestion) */

    return this.getQuery("confa/metodo24", bodyValidateQuestion).pipe(
      map((response: ValidateQuestion) => {
        return response;
      })
    );
  }

  /* Metodo que consulta la informacion de usuario para el perfil */
  consultarInformacionMiPerfilConfa(documento: string) {
    let bodyValidateQuestion = {
      documento: Md5.hashStr(documento.toString()),
    };

    return this.getQuery("confa/metodo201", bodyValidateQuestion).pipe(
    //return this.getQuery("confa/metodo26", bodyValidateQuestion).pipe(
      map((response) => {
        return response;
      })
    );
  }
  /* Metodo que consulta si el usuario tiene permiso para ingresar al servicio. Se tienen restricciones de edad para algunos servicios */
  validarPermisoPorEdad(doc: string) {
    let bodyValidate = {
      documento: doc.toString(),
      servicio: `${environment.servicio}`,
    };
    return this.getQuery("confa/metodo27", bodyValidate).pipe(
      map((response: any) => {
        // console.log(response)
        return response["respuesta"];
      })
    );
  }


  // Metodo para validar la disponivilidad del aplicativo
  validarAplicativo() {
    let body = {
      portal: "escuelasCursos",
      //portal: "miPerfil",
    };

    return this.getQuery("confa/metodo200", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //cartas de vivienda
  // private scriptUrl =
  //   "https://script.google.com/a/macros/confamiliares.com/s/AKfycbzkWijPS78A3zoFPgEyoYKjczV_PlNAaY122QeAzNAentoexX9pfbLj3SUpbS-N2XIhqw/exec"; // Reemplaza con la URL de tu script
  private scriptUrl =
    "https://script.google.com/macros/s/AKfycbxmrkbj0rBUWqAByhTD5xs1S0RTln3WcqYuTAcTOY6dEsTt0qSp-FOln6iaywGe6NAD/exec";
  searchPDFs(
    folderId: string,
    searchId: string
  ): Observable<{ name: string; id: string }[]> {
    const url = `${this.scriptUrl}?folderId=${folderId}&searchId=${searchId}`;
    return this.http.get<{ name: string; id: string }[]>(url);
  }


  /* EJEMPLO DEL CONSUMO EN PASADIA  */


  verifyTransactionNoPyzen(body) {
    const url = environment.dispoCentros + "/metodo89";
    let response = this.http.post(url, body);
    return response;
  }
}
