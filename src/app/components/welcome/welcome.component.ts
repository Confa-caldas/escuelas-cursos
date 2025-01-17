import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User, Session } from '../../interfaces/user.interface';
import { AuthenticationService } from '../../services/authentication.service';
import { UtilitiesService } from '../../services/utilities.service';
import { first } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Location,CommonModule } from '@angular/common';
declare var $;

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class WelcomeComponent implements OnInit {

  login: boolean = false;

  fullName: string = '';
  document: string;
  showButtons: boolean = false;
  showButtonsModify: boolean = false;

  tipoConsulta: string;

  path: string;

  auxLoading = false;
  permiso: Boolean;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService,
    private location: Location
  ) {
    

    this.path = this.activatedRoute.snapshot.routeConfig.path;
   /*  console.log("path",this.path); */

    if (
      this.path.includes('modify') ||
      this.path.includes('questions')||
      this.path.includes('perfilConfaEmbed')||
      this.path.includes('home')
    ) {
     
      this.auxLoading = true;
      this.chargeCurrentUser();
      this.showButtons = true;

    }
  }

  ngOnInit() {

  }

  backPage() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.authenticationService.logout();
      this.utilitiesService.currentUser = null;
      this.router.navigate(['/login']);
      this.utilitiesService.loading = false;
      console.log('4');
    }, 500);
  }


  chargeCurrentUser() {

    //let ptoken = localStorage.getItem("ptokenn")
    let currentToken = (this.cookieService.get('ptoken') !== '') ? JSON.parse(this.cookieService.get('ptoken')) : null;
    let ptoken = currentToken ? currentToken.token : null
    this.validateLogin(ptoken).then(() => {
      let currentUser = this.utilitiesService.currentUser;
      if (currentUser) {
        // console.log("login true");
        this.login = true;
        this.fullName = currentUser.primerNombre + " " + currentUser.segundoNombre + " " + currentUser.primerApellido + " " + currentUser.segundoApellido;
        this.document = currentUser.documento;
      }
      else {
        // console.log("login false");
        this.login = false;
      }
    });
  }

 
  private validateLogin(token) {

    // console.log(this.utilitiesService.yearQuery)
    

      this.utilitiesService.loading = true;

      return new Promise<void>((resolve, reject) => {
        this.authenticationService.loginNew(token)
          .pipe(first())
          .subscribe((response: Session) => {
            // console.log("validando login",response);
            this.utilitiesService.currentUser = response.usuario;
            this.utilitiesService.puedeIngresar = response.puedeIngresar;
            this.utilitiesService.debeActualizarDatos = response.debeActualizarDatos;
            this.utilitiesService.debeRealizarValidacion = response.debeRealizarValidacion;

            if (this.path.includes('miPerfilConfa') || this.path.includes('home')) {
              console.log("puede ingresar? " + this.utilitiesService.puedeIngresar)

              if (!this.utilitiesService.puedeIngresar) {
                this.utilitiesService.messageTitleModal = "Intenta nuevamente o comunícate a confa@confa.co";
                this.utilitiesService.messageModal = "";
                this.utilitiesService.backLogin = true;

                setTimeout(() => {
                  $(".modalNuevoError").click();
                  this.utilitiesService.loading = false;
                }, 1000);

              }


            }
            if (!this.auxLoading) {
              this.utilitiesService.loading = false;
            }
            resolve();
          });
      });
    
  }
}