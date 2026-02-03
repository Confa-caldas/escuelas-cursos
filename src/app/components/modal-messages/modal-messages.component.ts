import { Component, OnInit } from "@angular/core";

import { UtilitiesService } from "../../services/utilities.service";
import { Router, ActivatedRoute, RouterLink, NavigationEnd} from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { AttentionService } from "../../services/attention.service";
import { FormBuilder, FormControl, UntypedFormGroup, Validators,ReactiveFormsModule } from "@angular/forms";
import { first } from "rxjs/operators";
import { User } from "src/app/interfaces/user.interface";
import { environment } from "src/environments/environment";
import { CommonModule } from '@angular/common';
import { DataServiciosCursos } from "src/app/services/data-cursos.service";
declare var $;
@Component({
  selector: "app-modal-messages",
  templateUrl: "./modal-messages.component.html",
  styleUrls: ["./modal-messages.component.css"],
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule]
})
export class ModalMessagesComponent implements OnInit {
  formUpdate: UntypedFormGroup;

  public environment = environment;

  constructor(
    public attentionService: AttentionService,
    public utilitiesService: UtilitiesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public dataServiciosCursos: DataServiciosCursos,
  ) {
    /* this.confirmUser(); */
  }

  ngOnInit() {}

  confirmUser() {
    let confirmUser =
      this.activatedRoute.snapshot.queryParams[
        "34240997a16763c011134c570fcc149e"
      ];
    if (confirmUser) {
      this.utilitiesService.loading = true;
      this.authenticationService
        .confirmUserRegistrationConfa(confirmUser)
        .pipe(first())
        .subscribe((response: User) => {
          if (response.documento !== "") {
            // console.log(response);
            this.utilitiesService.messageTitleModal = "Registro exitoso";
            this.utilitiesService.messageModal =
              "Confirmación de registro exitoso.";
            this.utilitiesService.backLogin = true;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-success").click();
            }, 1000);
          } else {
            this.utilitiesService.messageTitleModal = "Registro fallido";
            this.utilitiesService.messageModal =
              "La confirmación de registro no fue exitosa o ya ha sido confirmada.";
            this.utilitiesService.backLogin = true;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-error").click();
            }, 1000);
          }
        });
    }
  }

  backLogin(success: boolean) {
    let confirmUser =
      this.activatedRoute.snapshot.queryParams[
        "34240997a16763c011134c570fcc149e"
      ];
    if (confirmUser && success) {
      this.router.navigate(["/login"]);
    }

    let changePassword =
      this.activatedRoute.snapshot.queryParams[
        "e541f24f0b06368c9cfb418174699da5"
      ];
    if (changePassword && success) {
      this.router.navigate(["/login"]);
    }

    if (success) {
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    }
    this.utilitiesService.recoveryEmail = null;
    //window.location.reload();
  }

  redirigirPayzen(){

    window.location.href = this.utilitiesService.urlRedireccionPayzen;
  }

  confirmNoPyzen(success: boolean){
    $(".btn_reservenopyzen").click();
   let confirmUser =
   this.activatedRoute.snapshot.queryParams[
     "34240997a16763c011134c570fccyohn"
   ];
  if (confirmUser && success) {
   this.router.navigate(["/login"]);
  }
  
  let changePassword =
   this.activatedRoute.snapshot.queryParams[
     "e541f24f0b06368c9cfb41817469yohn"
   ];
  if (changePassword && success) {
   this.router.navigate(["/login"]);
  }
  
  if (success) {
   this.authenticationService.logout();
   this.router.navigate(["/login"]);
  }
  this.utilitiesService.recoveryEmail = null;
  }

  backLogin2(success: boolean) {
    if (success) {
      this.authenticationService.logout();
      this.router.navigate(["/login"]);
    }
    setTimeout(() => {
      $(".btn-form-questions").click();
    }, 500);

    this.utilitiesService.recoveryEmail = null;
  }

  backHome(success: boolean) {
    if (success) {
      this.router.navigate(["/home"]);
    }
  }
  navigatecreditsimulador() {
    this.router.navigate(["/home"]);
  }

  continue(home: boolean, modify: boolean) {
    console.log(" ---", home);
    console.log(" ---", modify);
    if (home) {
      this.utilitiesService.backHome = false;
      this.router.navigate(["/"]);
    } else if (modify) {
      this.utilitiesService.backModify = false;
      console.log("entra a Modify");
      setTimeout(() => {
        this.utilitiesService.loading = false;
        this.router.navigate(["/modify"]);
      }, 500);
    }
  }
  
  regresar() {
    console.log("MODAL DE REGRESAR")
    this.utilitiesService.messageTitleModal = '¡Atención!';
    this.utilitiesService.messageModal = 'Si confirmas, perderás los cupos que has reservado. ¿Deseas continuar?';

    this.utilitiesService.loading = false;
    //$(".btn-modal-warning-regresar").click();
    $(".modalNuevoInfoCancelReserva").click();

  }
  
  confirmarRegistro() {
    location.reload();
  }

  limpiarCupos(){ 
    const programacionId =  this.utilitiesService.programacionId;
    const  paymentOrderId = this.utilitiesService.paymentOrderId

    this.dataServiciosCursos.LimpiarCupos(programacionId,paymentOrderId).pipe(first())
      .subscribe((response: any) => {
        console.log(response)
        this.router.navigate(["/cursos"]);
      },
        error => {
          console.error('Error al consultar los cursos:', error);
        });
  }
}


