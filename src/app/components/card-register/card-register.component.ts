import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormControl, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import {
  User,
  Token,
  Questions,
  PreguntasUser, TipoDoc
} from "../../interfaces/user.interface";
import { UtilitiesService } from "../../services/utilities.service";
import { CookieService } from "ngx-cookie-service";
import { QuestionsService } from "src/app/services/questions.service";
import { CommonModule } from '@angular/common';
import { ValidationService } from "src/app/services/validation.service";
declare var $;

@Component({
  selector: "app-card-register",
  templateUrl: "./card-register.component.html",
  styleUrls: ["./card-register.component.css"],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class CardRegisterComponent implements OnInit {
  documentoInput: any;
  formValidate: UntypedFormGroup;
  submitted: boolean = false;
  preguntar: boolean = false;
  @Output() userEmitter: EventEmitter<User> = new EventEmitter();
  @Output() preguntasEmitter: EventEmitter<PreguntasUser> = new EventEmitter();

  tpDoc: string = "";
  dataTpDoc: TipoDoc[];
  tieneCamara: boolean = false;

  constructor(
    private autheticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    public questionsService: QuestionsService,
    private cookieService: CookieService,
    private validationService: ValidationService
  ) { }

  async ngOnInit() {
    this.getTipoDoc(); // hace el llamdo a la consulta de tipos de documentos
    this.formValidate = new UntypedFormGroup({
      tpDoc: new UntypedFormControl("", [Validators.required]),
      document: new UntypedFormControl("", [
        Validators.required,
        Validators.min(99999),
        Validators.max(999999999999999),
        Validators.pattern("^[0-9]+"),
      ]),
    });
    this.tieneCamara = await this.validationService.hasWebcam();
  }

  get f() {
    return this.formValidate.controls;
  }

  get getTpDoc() {
    return (
      this.formValidate.get("tpDoc").invalid &&
      this.formValidate.get("tpDoc").touched
    );
  }

  getTipoDoc() {
    this.autheticationService
      .getGenericToken()
      .pipe(first())
      .subscribe((tokenDoc: Token) => {
        if (tokenDoc.token) {
          this.autheticationService
            .tipoDoc(tokenDoc.token)
            .pipe(first())
            .subscribe((res: TipoDoc[]) => {
              if (res?.length && res[0].id != "0") {
                this.dataTpDoc = res;
              } else {
                this.utilitiesService.messageTitleModal = "Espera";
                this.utilitiesService.messageModal =
                  "Error consultando los tipos de documentos";
                this.utilitiesService.backLogin = true;

                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $("..modalNuevowarning").click();
                }, 500);
              }
            });
        }
      });
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
      let tpDoc = this.f.tpDoc.value;

      if (document !== "" && tpDoc !== "") {
        this.utilitiesService.loading = true;

        this.autheticationService.getGenericToken()
          .pipe(first())
          .subscribe((response: Token) => {
            console.log("Token generico", response);

            if (response.token) {
              this.autheticationService.consultUserInformationNASFANew(document, response.token, tpDoc)
                .pipe(first())
                .subscribe((response: User) => {

                  this.utilitiesService.existUser = response.existeUsuario || response.usuarioNasfa;
                  // console.log("this.utilitiesService.existUser", this.utilitiesService.existUser);

                  if (response.bloqueo) {
                    this.utilitiesService.messageTitleModal =
                      "Su usuario ha sido bloqueado";

                    switch (response.tipoBloqueo) {
                      case "OTP_TEMP":
                        this.utilitiesService.messageModal =
                          "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, intenta nuevamente en 24 horas.";
                        break;

                      case "FACIAL":
                        this.utilitiesService.messageTitleModal =
                          "No se pudo generar el código validación. Intenta nuevamente en 24 horas.";
                        this.utilitiesService.messageModal =
                          "No puedes ingresar debido a que excediste los intentos permitidos para ingreso con facial.  Por favor, realiza la revisión de tus datos, escríbenos al siguiente correo: pqrsf@confa.co (Anexando copia de tu documento de identidad)";
                        break;

                      case "PREGUNTAS":
                        this.utilitiesService.messageModal =
                          "No puedes ingresar debido a que excediste los intentos permitidos para responder las preguntas.  Por favor, realiza la revisión de tus datos, escríbenos al siguiente correo: pqrsf@confa.co (Anexando copia de tu documento de identidad)";
                        break;

                      case "CONTRASENA":
                        this.utilitiesService.messageModal =
                          "No puedes ingresar debido a que excediste los intentos permitidos para autenticarte.  Por favor, realiza la revisión de tus datos, escríbenos al siguiente correo: pqrsf@confa.co (Anexando copia de tu documento de identidad)";
                        break;

                      default:
                        this.utilitiesService.messageModal =
                          "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, realiza la revisión de tus datos, escríbenos al siguiente correo: pqrsf@confa.co (Anexando copia de tu documento de identidad)";
                    }
                    /* "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, realiza la revisión de tus datos comunicándote al siguiente correo: pqrsf@confa.co"; */
                    this.utilitiesService.backLogin = false;

                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $('modalNuevoError').click();
                    }, 500);
                    this.formValidate.reset();
                    this.formValidate.get("tpDoc").setValue("");
                  } else if (response.registroPendiente) {
                    this.utilitiesService.loading = false;
                    this.utilitiesService.messageTitleModal = "Documento pendiente de validación";
                    this.utilitiesService.messageModal = response.mensaje;
                    this.utilitiesService.backLogin = false;
                    
                    $(".btn-close-popup-login").click();
                    setTimeout(() => {
                      $('.modalNuevoError').click();
                    }, 500);
                    this.formValidate.reset();
                    this.formValidate.get("tpDoc").setValue("");
                  } else if (!response.existeUsuario &&
                    !response.registroPendiente) {

                      this.utilitiesService.existUser =
                      response.existeUsuario || response.usuarioNasfa;
                    this.utilitiesService.documentUser = response.documento;
                    this.utilitiesService.tipoDoc = response.tipoDocumento;
                    this.utilitiesService.emailUser = response.correo;
                    this.utilitiesService.phoneUser = response.celular;
                    this.utilitiesService.estadoRegistraduria =
                      response.registraduria;
                    this.utilitiesService.fechaNacimiento =
                      response.fechaNacimiento;
                    this.utilitiesService.usuarioNasfa = response.usuarioNasfa;
                    this.utilitiesService.currentUser = response;

                    console.log("Va el celular: " + response.celular);
                    this.ocultarConIndicios(response.celular, response.correo);

                    if (!this.getMenorDeEdad(response.fechaNacimiento)) {
                      if (response.facial && response.registraduria) {
                        if (this.tieneCamara) {
                          this.utilitiesService.botnesEstadoFacial = false;
                          this.utilitiesService.desdelogin = false;
                          if (response.preguntas != null) {
                            this.preguntasEmitter.emit(response.preguntas);
                            this.utilitiesService.tienePreguntas = true;
                            this.activarFacial();
                            this.formValidate.reset();
                            this.formValidate.get("tpDoc").setValue("");
                            this.utilitiesService.loading = false;
                          } else {
                            this.activarFacial();
                            this.formValidate.reset();
                            this.formValidate.get("tpDoc").setValue("");
                            this.utilitiesService.loading = false;
                          }
                        } else {
                          if (response.preguntas != null) {
                            this.utilitiesService.messageTitleModal =
                              "No se detectó cámara en el dispositivo";
                            this.utilitiesService.messageModal =
                              "No se detectó cámara en el dispositivo";
                            this.utilitiesService.backLogin = false;
                            this.preguntasEmitter.emit(response.preguntas);
                            setTimeout(() => {
                              this.utilitiesService.loading = false;
                              $("..modalNuevowarning").click();
                            }, 500);
                            $(".btn-close-popup-login").click();
                            setTimeout(() => {
                              $(".btn-form-questions").click();
                            }, 2000);
                            this.formValidate.reset();
                            this.formValidate.get("tpDoc").setValue("");
                          } else {
                            this.utilitiesService.messageTitleModal =
                              "No cuentas con validación biométrica";
                            this.utilitiesService.messageModal =
                              "Te invitamos a acercarte a la sede más cercana de Confa para realizar tu proceso de enrolamiento despues de que completes el registro.";
                            this.utilitiesService.backLogin = false;
                            setTimeout(() => {
                              this.utilitiesService.loading = false;
                              $(".btn-form-register").click();
                            }, 1000);
                          }
                        }
                      } else {
                        if (response.preguntas != null) {
                          this.preguntasEmitter.emit(response.preguntas);
                          $(".btn-close-popup-login").click();
                          setTimeout(() => {
                            $(".btn-form-questions").click();
                          }, 2000);
                          this.formValidate.reset();
                          this.formValidate.get("tpDoc").setValue("");
                          this.utilitiesService.loading = false;
                        } else {
                          this.utilitiesService.messageTitleModal =
                            "No cuentas con validación biométrica.";
                          this.utilitiesService.messageModal =
                            "Te invitamos a acercarte a la sede más cercana de Confa para realizar tu proceso de enrolamiento despues de que completes el registro.";
                          this.utilitiesService.backLogin = false;
                          $(".btn-close-popup-login").click();
                          setTimeout(() => {
                            this.utilitiesService.loading = false;
                            $("..modalNuevowarning-registro").click();
                            //$("..modalNuevowarning").click();
                          }, 500);
                          /* setTimeout(() => {
                            $(".btn-form-register").click();
                          }, 1000); */
                        }
                      }
                    } else {
                      if (this.getMayorDeCatorce(response.fechaNacimiento)) {
                        this.utilitiesService.loading = false;
                        $(".btn-close-popup-login").click();
                        setTimeout(() => {
                          $(".btn-form-register").click();
                        }, 500);
                        this.formValidate.reset();
                        this.formValidate.get("tpDoc").setValue("");
                      } else {
                        this.utilitiesService.loading = false;
                        this.utilitiesService.messageTitleModal =
                          "Ten en cuenta";
                        this.utilitiesService.messageModal =
                          "Como menor de edad, te informamos que envíaremos una notificación a tu padre, madre o tutor legal para notificar tu registro.";
                        this.utilitiesService.backLogin = false;
                        setTimeout(() => {
                          $(".btn-modal-information-validation").click();
                          console.log("Notifica al padre");
                        }, 500);
                        $(".btn-close-popup-login").click();
                        setTimeout(() => {
                          $(".btn-form-register").click();
                        }, 1000);
                        this.formValidate.reset();
                        this.formValidate.get("tpDoc").setValue("");
                      }
                    }
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

  
  capturar(value) {
    this.formValidate.get("tpDoc").setValue(value);
    this.tpDoc = value;
    console.log(value);
  }

  activarFacial() {
    this.utilitiesService.showWebcam = true;
    $(".btn-camara-validacion").click();
  }

  private getMenorDeEdad(fechaNacimiento: string): boolean {
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const fechaActual = new Date();
    const edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
    if (edad < 18) {
      return true;
    }
    return false;
  }


  private getMayorDeCatorce(fechaNacimiento: string): boolean {
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const fechaActual = new Date();
    const edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
    if (edad < 14) {
      return false;
    }
    return true;
  }

  private ocultarConIndicios(phone: string, email: string) {
    //Si el correo o celuar vine indefinido, lo pone vacío.
    email = email || "";
    phone = phone || "";

    this.utilitiesService.indiciocel = phone.replace(/\d(?=\d{4})/g, "*");

    this.utilitiesService.indiciocorreo = email.replace(
      /(^.{2})(.*)(@.*)/,
      (match, firstTwo, hiddenPart, domain) => {
        return firstTwo + "*".repeat(hiddenPart.length) + domain;
      }
    );
  }
}
