import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { first } from 'rxjs/operators';
import { ValidateToken, Token } from '../interfaces/user.interface';
import { CookieService } from 'ngx-cookie-service';
import { UtilitiesService } from '../services/utilities.service';

declare var $;

@Injectable({ providedIn: 'root' })
export class AuthGuard  {

  validateToken: boolean = false;
  message: string;
  type: string;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private cookieService: CookieService,
    public utilitiesService: UtilitiesService,
  ) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // const currentToken = this.authenticationService.currentTokenValue;
    let currentToken = (this.cookieService.get('ptoken') !== '') ? JSON.parse(this.cookieService.get('ptoken')) : null;
    let token = currentToken ? currentToken.token : null
    let user = (localStorage.getItem('user') !== '') ? JSON.parse(localStorage.getItem('user')) : null;
    let cc = (localStorage.getItem('cc') !== '') ? JSON.parse(localStorage.getItem('cc')) : null;
    //localStorage.setItem("ptokenn", token)

    console.log(currentToken)

    if (currentToken) {
      return this.validate(currentToken).then(() => {
        if (this.validateToken) {

          if (this.utilitiesService.bloqueo == true) {

            return false;
          } else {

            return true;
          }

          //Esta validacion ua se esta implementando en home.component para almacenar la variable cc.
          // if(user == null || cc == null){
          // console.log("Entramos porque es nulo");
          // //Validamos si no tiene la informacion almacenada dentro del local Storage cuando la sesion fue iniciada desde otro portal 
          // this.authenticationService.login(token)
          //       .pipe(first())
          //       .subscribe((response: User) => {
          //         // console.log("entra aca", response);
          //         this.utilitiesService.currentUser = response;
          //         // console.log('3',response);
          //         if (response.existeUsuario) {
          //           console.log("se guardo la informacion del usuario desde auth guard");
          //           localStorage.setItem('user', JSON.stringify(response));
          //           localStorage.setItem('cc', response.documento);
          //         }
          //       });
          //   }
          //logged in so return true
          //conectado para que el retorno sea verdadero
          //console.log("validateToken", this.validateToken);
          return true;
        }
        else {
          this.modalTokenExpired();

          // not logged in so redirect to login page with the return url
          // no está conectado, así que redirecciona a la página de acceso con la url de retorno
          // this.router.navigate(['/login']); // , { queryParams: { returnUrl: state.url } }
          // console.log("validateToken", this.validateToken);
          return false;
        }
      });
    }



    // not logged in so redirect to login page with the return url
    // no está conectado, así que redirecciona a la página de acceso con la url de retorno
    this.utilitiesService.currentUser = null;
    console.log('1');
    this.router.navigate(['/login']); // , { queryParams: { returnUrl: state.url } }
    // console.log("validateToken", this.validateToken);


    return false;
  }

  private validate(currentToken: Token) {
    return new Promise<void>((resolve, reject) => {
      this.authenticationService.validateToken(currentToken.token)
        .pipe(first())
        .subscribe((response: ValidateToken) => {
          // console.log("la respuesta: ",response);

          if (response.valido && response.tipo == 'E') {
            this.validateToken = true;
            resolve();
          }
          else {
            this.utilitiesService.currentUser = null;
            console.log('2');
            this.validateToken = false;
            this.message = response.mensaje;
            this.type = response.tipo;

            resolve();
          }
        });
      // TODO: Organizar la vuelta al login cuando esta logeado
    });
  }

  modalTokenExpired() {
    if (!this.validateToken && this.message === '02--El Token Expiró') {
      this.utilitiesService.loading = true;

      this.utilitiesService.messageTitleModal = 'Su sesión ha expirado';
      this.utilitiesService.messageModal = 'Su sesión ha llegado al tiempo de caducidad, inicie sesión nuevamente';
      this.utilitiesService.backLogin = true;

      setTimeout(() => {
        this.utilitiesService.loading = false;
        this.router.navigate(['/login']);
        $(".btn-modal-token-expired").click();
      }, 1000);
    }
  }

  

}