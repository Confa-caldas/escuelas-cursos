import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { PreguntasUser, Questions, Token, User, ValidateQuestion, validateResponse } from "src/app/interfaces/user.interface";
import { AttentionService } from "src/app/services/attention.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { QuestionsService } from "src/app/services/questions.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { CardRegisterFormComponent } from "../../card-register-form/card-register-form.component";
import { ValidationService } from "../../../services/validation.service";
import {HeaderComponent} from '../../shared/header/header.component';
import {FooterComponent} from '../../shared/footer/footer.component';
import {WelcomeComponent} from '../../welcome/welcome.component';
import {CardLoginComponent} from '../../card-login/card-login.component';
import {CardForgotPasswordComponent} from '../../card-forgot-password/card-forgot-password.component';
import {CardRegisterComponent} from '../../card-register/card-register.component';
import {CardChangePasswordComponent} from '../../card-change-password/card-change-password.component';
import {CardQuestionsComponent} from '../../card-questions/card-questions.component';
import { ValidacionIdentidadComponent } from '../../validacion-identidad/validacion-identidad.component';


import {CommonModule } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';

declare var $;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  standalone: true,
  imports:[
    CardRegisterFormComponent,
    HeaderComponent,
    FooterComponent,
    WelcomeComponent,
    CardLoginComponent,
    CardForgotPasswordComponent,
    CardRegisterComponent,
    CardChangePasswordComponent,
    CardQuestionsComponent,
    CommonModule,
    ReactiveFormsModule,
    ValidacionIdentidadComponent
  ]
})
export class LoginComponent implements OnInit {
  @ViewChild(CardRegisterFormComponent, { static: false })
  childComponent: CardRegisterFormComponent;
  user: User;
  respuesta: Boolean = false;
  token: Token;
  preguntas: PreguntasUser;
  respuestasList: any = [];
  intentosValidos: number = 3;
  public tieneCamara: boolean = false;
  otrosIngresos: boolean = false;

  constructor(
    public attentionService: AttentionService,
    private authenticationService: AuthenticationService,
    private validationService: ValidationService,
    public utilitiesService: UtilitiesService,
    public questionsService: QuestionsService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.confirmUser();
  }

  async ngOnInit() {
    this.loadvalidated();
    this.tieneCamara = await this.validationService.hasWebcam();
  }

  loadvalidated() {
    $(".btn-forgot-password").click(function (event) {
      $("#background-home").addClass("background-forgot-password");
    });
    $(".btn-back").click(function (event) {
      $("#background-home").removeClass("background-forgot-password");
      $("#background-home").removeClass("background-signup");
    });
    $(".btn-signup").click(function (event) {
      $("#background-home").addClass("background-signup");
    });

    // Limpia los campos input con la clase .clean-input de las card
    $(".btn").click(function (event) {
      $(".clean-input").val("");
    });
  }

  processUser(user: User) {
    this.user = user;
    console.log("Event emitter user", user);
    this.childComponent.fullNameDisabled();
  }

  processRespuesta(res: Boolean) {
    this.respuesta = res;
    console.log("Event emitter respuesta", res);
  }

  processPreguntas(preguntas: PreguntasUser) {
    this.preguntas = preguntas;
    console.log("Event emitter preguntas", preguntas);
  }

  processRespuestas(res: any) {
    this.respuestasList = [];
    this.respuestasList = res;
    console.log("Event emitter respuesta List", res);
    this.guardarRespuestas(res);
  }

  guardarRespuestas(respuestas: any) {
    this.utilitiesService.messageLoading = "Cargando, por favor espera";
    this.utilitiesService.loading = true;
    this.authenticationService
      .validateQuestion(this.user.documento, respuestas, "R")
      .pipe(first())
      .subscribe((res: ValidateQuestion) => {
        if (res.estado == 0) {
          this.utilitiesService.messageTitleModal = "¡Intentalo nuevamente!";
          this.utilitiesService.messageModal = "Ha ocurrido un error";
          this.utilitiesService.backLogin = false;
          setTimeout(() => {
            $(".modalNuevoError").click();
            this.utilitiesService.loading = false;
          }, 1000);
        } else if (res.estado == 1) {
          if (res.respuesta == true) {
            this.respuesta = res.respuesta;
            this.utilitiesService.loading = false;
            $(".btn-close-form-questions").click();
            setTimeout(() => {
              $(".btn-form-register").click();
            }, 500);
          } else if (res.respuesta == false) {
            if (res.bloqueo == true) {
              this.utilitiesService.messageTitleModal = "¡No puedes continuar!";
              this.utilitiesService.messageModal =
                "No pudimos realizar la validación de tus datos, por favor realiza la revisión de tus datos y comunicate al siguiente correo: pqrsf@confa.co (Anexando copia de tu documento de identidad)";
              this.utilitiesService.backLogin = true;

              setTimeout(() => {
                $(".btn-close-form-questions").click();
                $(".modalNuevoError").click();
                this.utilitiesService.loading = false;
              }, 1000);
            } else if (res.bloqueo == false) {
              let cuantosintentosQuedan: number =
                this.intentosValidos - res.intentos;
              let intentotext =
                cuantosintentosQuedan == 1 ? "intento " : "intentos ";
              this.utilitiesService.messageTitleModal = "¡Ten cuidado!";
              this.utilitiesService.messageModal =
                "Los datos ingresados no son correctos, tienes " +
                cuantosintentosQuedan +
                " " +
                intentotext +
                " más para  validar tus datos";
              this.utilitiesService.backLogin = false;
              setTimeout(() => {
                $(".btn-close-form-questions").click();
                $(".btn-modal-error-questions-register").click();
                this.utilitiesService.loading = false;
              }, 1000);
            }
          }
        }
      });
    /* }); */
  }

  confirmUser() {

    let confirmUser =
      this.activatedRoute.snapshot.queryParams[
        "34240997a16763c011134c570fcc149e"
      ];

      console.log(confirmUser)
    if (confirmUser) {
      this.utilitiesService.loading = true;
      this.authenticationService
        .confirmUserRegistrationConfa(confirmUser)
        .pipe(first())
        .subscribe((response: User) => {
          console.log(response)
          if (response.documento !== "") {
            // console.log(response);
            this.utilitiesService.messageTitleModal = "Registro exitoso";
            this.utilitiesService.messageModal =
              "Confirmación de registro exitoso.";
            this.utilitiesService.backLogin = true;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".modalNuevoSuccess").click();
            }, 1000);
          } else {
            this.utilitiesService.messageTitleModal = "Registro fallido";
            this.utilitiesService.messageModal =
              "La confirmación de registro no fue exitosa o ya ha sido confirmada.";
            this.utilitiesService.backLogin = false;

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".modalNuevoError").click();
            }, 1000);
          }
        });
    }
  }
  getDownloadUrl(fileId: string): string {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  mostrarOtrasAlternativas(){
    //this.otrosIngresos = true;
    $(".btn-TpDocYdoc-login").click();
  }

  activarCredenciales(){
    this.utilitiesService.loading = true;
    this.utilitiesService.showWebcam = false;
    this.otrosIngresos = true;
    setTimeout(() => {
      this.utilitiesService.loading = false;
      $(".btn-modal-login").click();
    }, 500);
  }

  activarFacial() {
    this.utilitiesService.loading = true;
    if (this.tieneCamara) {
      this.utilitiesService.loading = false;
      this.utilitiesService.desdelogin = true;
      this.utilitiesService.showWebcam = true;
      $(".btn-camara-validacion").click();
    } else {
      this.utilitiesService.loading = false;
      this.utilitiesService.messageTitleModal = "¡Error!";
      this.utilitiesService.messageModal =
        "No se detectó cámara en el dispositivo";
      this.utilitiesService.backLogin = false;
      setTimeout(() => {
        $(".btn-modal-error-validation").click();
      }, 500);
      setTimeout(() => {
        $(".btnLogin").click();
      }, 2000);
    }
  }


  regresarFacial(){
    this.utilitiesService.otrosIngresos = false;
    this.otrosIngresos = false;
  }
}
