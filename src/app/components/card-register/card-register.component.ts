import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import {
  User,
  Token,
  Questions,
  PreguntasUser,
} from "../../interfaces/user.interface";
import { UtilitiesService } from "../../services/utilities.service";
import { CookieService } from "ngx-cookie-service";
import { QuestionsService } from "src/app/services/questions.service";
import { CommonModule } from '@angular/common';

declare var $;

@Component({
  selector: "app-card-register",
  templateUrl: "./card-register.component.html",
  styleUrls: ["./card-register.component.css"],
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule]
})
export class CardRegisterComponent implements OnInit {
  documentoInput: any;
  formValidate: UntypedFormGroup;
  submitted: boolean = false;
  preguntar: boolean = false;
  @Output() userEmitter: EventEmitter<User> = new EventEmitter();
  @Output() preguntasEmitter: EventEmitter<PreguntasUser> = new EventEmitter();

  constructor(
    private autheticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    public questionsService: QuestionsService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.formValidate = new UntypedFormGroup({
      document: new UntypedFormControl("", [
        Validators.required,
        Validators.min(99999),
        Validators.max(999999999999999),
        Validators.pattern("^[0-9]+"),
      ]),
    });
  }

  get f() {
    return this.formValidate.controls;
  }

  validateDocument() {
    this.utilitiesService.messageLoading = "Cargando, por favor espera";
    /* this.cookieService.delete('gtoken'); */
    this.submitted = true;

    if (this.formValidate.invalid) {
      Object.values(this.f)
      .forEach(control => {
        control.markAllAsTouched();
      });
    return;
    } else {
      this.utilitiesService.loading = true;
      let document = this.f.document.value;
      console.log(document);


      if (document !== "") {
        this.utilitiesService.loading = true;

        this.autheticationService.getGenericToken()
        .pipe(first())
        .subscribe((response: Token) => {
          console.log("Token generico", response);

          if (response.token) {
            this.autheticationService.consultUserInformationNASFANew(document, response.token)
              .pipe(first())
              .subscribe((response: User) => {
               
                this.utilitiesService.existUser = response.existeUsuario || response.usuarioNasfa;
                // console.log("this.utilitiesService.existUser", this.utilitiesService.existUser);

                if (response.bloqueo) {
                  this.utilitiesService.messageTitleModal = "¡Documento bloqueado!";
                  this.utilitiesService.messageModal =response.mensaje
                    /* "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, realiza la revisión de tus datos comunicándote al siguiente correo: pqrsf@confa.co"; */
                  this.utilitiesService.backLogin = false;

                  $('modalNuevoError').click();

                } else if (response.registroPendiente) {
                  this.utilitiesService.loading = false;
                  this.utilitiesService.messageTitleModal = "Documento pendiente de validación";
                  this.utilitiesService.messageModal = response.mensaje;
                  this.utilitiesService.backLogin = false;
                  
                  $('.modalNuevoError').click();

                } else if (!response.existeUsuario) {
                  this.utilitiesService.loading = false;
                  // console.log('Usuario no encontrado');

                  $('.btn-close-popup-login').click();
                  setTimeout(() => {
                    this.utilitiesService.registerUser = response;
                    console.log(this.utilitiesService.registerUser)
                    $('.btn-form-register').click();
                  }, 500);
                }
                else {
                  this.utilitiesService.loading = false;

                  // console.log('Usuario encontrado');
                  this.cookieService.delete('gtoken');
                  this.utilitiesService.messageTitleModal = 'Documento registrado';
                  this.utilitiesService.messageModal = 'Este usuario ya se encuentra registrado.';
                  this.utilitiesService.backLogin = false;

                  $('.modalNuevoError').click();
                }
              });
          }
        });
    }
    }
  }

  consultarPreguntas(documento: string) {
    console.log(documento)
    let existeUsuarioC: boolean = false;
    let ctoken =
      this.cookieService.get("ctoken") !== ""
        ? JSON.parse(this.cookieService.get("ctoken"))
        : "";
    /*  console.log("---", ctoken) */
    if (ctoken != "") {
      /*   console.log("----if"); */
      this.questionsService
        .getQuestions(documento)
        .pipe(first())
        .subscribe((respons: Questions) => {
          /*    console.log("aqui questions", respons); */
          this.preguntasEmitter.emit(
            respons.ConsultaPreguntasResponse.preguntas
          );
          if (respons.ConsultaPreguntasResponse.mensaje == "") {
            existeUsuarioC = true;
            this.preguntar = true;

            /*  console.log("B", this.preguntar) */
          }
        });
    } else {
      /* console.log("----else"); */
      this.autheticationService
        .getGenericTokenC()
        .pipe(first())
        .subscribe((tokenC: Token) => {
          if (tokenC.token) {
            this.questionsService
              .getQuestions(documento)
              .pipe(first())
              .subscribe((respons: Questions) => {
                /* console.log("aqui questions", respons); */
                this.preguntasEmitter.emit(
                  respons.ConsultaPreguntasResponse.preguntas
                );
                if (respons.ConsultaPreguntasResponse.mensaje == "") {
                  existeUsuarioC = true;
                  this.preguntar = true;

                  /*  console.log("B", this.preguntar) */
                }
              });
          }
        });
    }
  }
}
