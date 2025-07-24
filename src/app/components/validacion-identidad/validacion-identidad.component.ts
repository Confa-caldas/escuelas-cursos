//Dependecias
import { ReactiveFormsModule,UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { Component, HostListener, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { first } from "rxjs/operators";
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';

//services
import { AuthenticationService } from "src/app/services/authentication.service";
import { ValidationService } from "src/app/services/validation.service";
import { UtilitiesService } from "src/app/services/utilities.service";
import { DataServiciosCursos } from 'src/app/services/data-cursos.service'

//interface
import {
  RespuestaEnvioSMS,
  RespuestaValidacionFacial,
  RespuestaValidacionOTP,
  Token,
  TipoDoc,
  EstadoAplicativo,
  Session,
} from "src/app/interfaces/user.interface";

//declaraciones
declare var $;

@Component({
  selector: "app-validacion-identidad",
  templateUrl: "./validacion-identidad.component.html",
  styleUrls: ["./validacion-identidad.component.css"],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,WebcamModule]
})
export class ValidacionIdentidadComponent implements OnInit {
  /* VARIABLES REGISTRO */
  //Camara
  public width: number;
  public height: number;
  public imgValida: boolean = false;

  public codigoEnviado: boolean = false;
  public celularIndicio: string = "";
  public correoIndicio: string = "";
  public selectedOptionIndicio: string = "";
  public selectedOptionOTP: string = "";

  public timer: number;
  public interval: any;

  formValidate: UntypedFormGroup;
  formValidateOTP: UntypedFormGroup;
  submitted: boolean = false;
  pictureTaken: WebcamImage;

  // toggle webcam on/off
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public errors: WebcamInitError[] = [];
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };

  /* VARIABLES LOGIN */
  formCredenciales: UntypedFormGroup;
  returnUrl: string;
  tipoDocXotp: string;
  documentoXotp: string;

  // Imagen capturada
  public capturedImage: WebcamImage | null = null;
  dataTpDoc: TipoDoc[];
  tpDoc: string = "";
  contituarInicio: boolean = false;
  opcionEnvio: boolean = false;

  public indicioEnvioSeleccionado: string = "";
   isMobile: boolean;

  /* VARIABLES ACTUALIZACION */

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public utilitiesService: UtilitiesService,
    private validationService: ValidationService,
    private autenticacionService: AuthenticationService,
    private dataServiciosCursos: DataServiciosCursos
  ) {
    this.onResize();
  }

  ngOnInit() {
    this.getTipoDoc();
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );
    this.formValidate = new UntypedFormGroup({
      opcionOTP: new UntypedFormControl("", [Validators.required]),
    });

    this.formCredenciales = new UntypedFormGroup({
      tpDoc: new UntypedFormControl("", [Validators.required]),
      document: new UntypedFormControl("", [
        Validators.required,
        Validators.min(99999),
        Validators.max(999999999999999),
        Validators.pattern("^[0-9]+"),
      ]),
    });

    this.formValidateOTP = new UntypedFormGroup({
      numberOTP_uno: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]$"),
      ]),
      numberOTP_dos: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]$"),
      ]),
      numberOTP_tres: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]$"),
      ]),
      numberOTP_cuatro: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]$"),
      ]),
      numberOTP_cinco: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]$"),
      ]),
      numberOTP_seis: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("^[0-9]$"),
      ]),
    });

    this.returnUrl =
      this.activatedRoute.snapshot.queryParams["returnUrl"] || `/home`;
  }

  /* METODOS REGISTRO */
  @HostListener("window:resize", ["$event"])
  onResize(event?: Event) {
    const win = !!event ? (event.target as Window) : window;
    if (win.innerWidth < 768) {
      this.width = win.innerWidth - 50;
      this.height = win.innerHeight - 50;
    }
    if (win.innerWidth < 668) {
      this.width = win.innerWidth - 100;
      this.height = win.innerHeight - 20;
    } else {
      this.width = win.innerWidth / 3;
      this.height = win.innerHeight / 2;
    }
  }

  get f() {
    return this.formValidate.controls;
  }

  get fCredenciales() {
    return this.formCredenciales.controls;
  }

  get fOTP() {
    return this.formValidateOTP.controls;
  }

  get getTpDoc() {
    return (
      this.formCredenciales.get("tpDoc").invalid &&
      this.formCredenciales.get("tpDoc").touched
    );
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }
  public toggleWebcam(): void {
    this.utilitiesService.showWebcam = !this.utilitiesService.showWebcam;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);

    /* if (this.errors.length > 0) {
      this.closeModalFacial();
      this.utilitiesService.messageTitleModal = "Cámara desactivada";
      this.utilitiesService.messageModal = "Se debe dar permisos al navegador para utilizar la cámara y poder continuar";
                  

      setTimeout(() => {
        this.utilitiesService.loading = false;
        $(".modalNuevowarning").click();
      }, 500);

    } */
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public handleImage(webcamImage: WebcamImage): void {
    this.pictureTaken = webcamImage;

    if (this.utilitiesService.desdelogin) {
      this.validarFacial();
    } else {
      this.validateFaceMiPerfil();
    }
  }
  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  getTipoDoc() {
    this.autenticacionService
      .getGenericToken()
      .pipe(first())
      .subscribe((tokenDoc: Token) => {
        if (tokenDoc.token) {
          this.autenticacionService
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
                  $(".modalNuevowarning").click();
                }, 500);
              }
            });
        }
      });
  }

  // Manejo del evento de captura
  onImageCapture(image: WebcamImage): void {
    this.capturedImage = image;
  }

  closeModalFacial() {
    this.opcionEnvio = false;
    this.codigoEnviado = false;
    this.utilitiesService.showWebcam = false;
    this.formValidate.reset();
    this.formValidateOTP.reset();
    $(".btn-close-camara-validar").click();
  }

  closeModalOTP() {
    this.codigoEnviado = false;
    this.formValidate.reset();
    this.formValidateOTP.reset();
    $(".btn-close-otp").click();
  }

  validateFaceMiPerfil() {
    this.utilitiesService.loading = true;
    this.autenticacionService
      .getGenericToken()
      .pipe(first())
      .subscribe((token: Token) => {
        if (token.token) {
          this.validationService
            .getPOSTFacialService(
              this.utilitiesService.tipoDoc,
              this.utilitiesService.documentUser,
              this.pictureTaken.imageAsBase64,
              token.token
            )
            .pipe(first())
            .subscribe((response: RespuestaValidacionFacial) => {
              if (response.bloqueo) {
                this.utilitiesService.messageTitleModal = "¡Usuario Bloqueado!";

                //swich de tipo bloqueo
                switch (response.tipoBloqueo) {
                  case "OTP_TEMP":
                    this.utilitiesService.messageModal =
                      "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, intenta nuevamente en 24 horas.";
                    break;

                  case "FACIAL":
                    console.log(response.tipoBloqueo, "case facial");
                    this.utilitiesService.messageModal =
                      "Tu usuario ha sido bloqueado por validación biométrica. Visita la sede más cercana de Confa para desbloquearlo.";
                    break;

                  case "PREGUNTAS":
                    this.utilitiesService.messageTitleModal =
                      "Tu usuario ha sido bloqueado por preguntas de validación";
                    this.utilitiesService.messageModal =
                      "Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                    break;

                  case "CONTRASENA":
                    this.utilitiesService.messageModal =
                      "Por seguridad, tu acceso ha sido bloqueado.Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                    break;

                  default:
                    this.utilitiesService.messageModal =
                      "Tu usuario ha sido bloqueado. Acércate a la sede más cercana de Confa para generar tu desbloqueo.";
                }
                this.utilitiesService.backLogin = true;

                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $(".modalNuevoError").click();
                }, 500);
              } else if (response.error === 0) {
                // if (true) {
                this.closeModalFacial();
                this.ocultarConIndicios();
                console.log(
                  "Estas ",
                  this.utilitiesService.phoneUser,
                  this.utilitiesService.emailUser
                );
                this.utilitiesService.transaccionId = response.transaccionId;
                this.utilitiesService.facialOtp = true;
                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $(".btn-envio-otp").click();
                }, 1000);
              } else if (response.error === 1) {
                this.closeModalFacial();

                this.utilitiesService.messageTitleModal = "Atención";
                this.utilitiesService.messageModal =
                  "Tu usuario presenta problemas con el facial, por favor acércate a confa." ||
                  response.mensaje;
                this.utilitiesService.backLogin = false;
                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $(".modalNuevowarning").click();
                }, 500);
              } else {
                if (response.estadoValFacial === false) {
                  this.utilitiesService.messageTitleModal =
                    "Validación facial fallida";
                  this.utilitiesService.messageModal =
                    response.observacionMallaValidacion;
                  this.utilitiesService.backLogin = false;
                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevowarning").click();
                  }, 500);
                } else {
                  if (response.numeroIntentosActual < 3) {
                    this.utilitiesService.messageTitleModal =
                      "Validación facial fallida";
                    this.utilitiesService.messageModal =
                      "No se pudo validar tu identidad, te quedan " +
                      (3 - response.numeroIntentosActual) +
                      " intentos.";
                    this.utilitiesService.backLogin = false;
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".modalNuevowarning").click();
                      this.closeModalFacial();
                    }, 500);
                  } else {
                    this.utilitiesService.messageTitleModal =
                      "A ocurrido un error";
                    this.utilitiesService.messageModal =
                      "porfavor intentalo de nuevo mas tarde.";
                    this.utilitiesService.backLogin = false;
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".modalNuevowarning").click();
                    }, 500);
                  }
                }
              }
              this.utilitiesService.loading = false;
            });
        }
      });
  }

  saltarFacialLogin() {
    this.utilitiesService.loading = true;
    this.utilitiesService.showWebcam = false;
    this.closeModalFacial();
    this.utilitiesService.otrosIngresos = true;
    setTimeout(() => {
      this.utilitiesService.loading = false;
      $(".btn-close-camara-validar").click();
    }, 500);
  }

  saltarFacial() {
    this.utilitiesService.loading = true;
    this.utilitiesService.showWebcam = false;
    $(".btn-close-camara-validar").click();
    this.closeModalFacial();
    if (this.utilitiesService.tienePreguntas) {
      setTimeout(() => {
        this.utilitiesService.loading = false;
        $(".btn-form-questions").click();
      }, 500);
    } else {
      setTimeout(() => {
        this.utilitiesService.loading = false;
        $(".btn-form-register").click();
      }, 500);
    }
  }
  //aca se envia transaccion
  enviarCodigoOTP() {
    console.log("desdelogin" + this.utilitiesService.desdelogin);
    this.submitted = true;
    if (this.formValidate.invalid) {
      this.opcionEnvio = true;
      return;
    } else if (this.formValidate.value.opcionOTP == "noTengo") {
      this.utilitiesService.loading = true;
      this.noTengoAcceso();
    } else {
      this.utilitiesService.loading = true;
      this.autenticacionService
        .getGenericToken()
        .pipe(first())
        .subscribe((token: Token) => {
          if (token.token) {
            this.validationService
              .getOTPGenerarService(
                this.utilitiesService.tipoDoc,
                this.utilitiesService.documentUser,
                this.formValidate.value.opcionOTP,
                this.utilitiesService.transaccionId,
                token.token
              )
              .pipe(first())
              .subscribe((response: RespuestaEnvioSMS) => {
                this.startTimer();
                if (this.formValidate.value.opcionOTP == "correo") {
                  this.indicioEnvioSeleccionado =
                    this.correoIndicio || this.utilitiesService.indiciocorreo;
                } else {
                  this.indicioEnvioSeleccionado =
                    this.celularIndicio || this.utilitiesService.indiciocel;
                }

                if (response.error === 0) {
                  this.utilitiesService.loading = false;
                  this.codigoEnviado = true;
                  this.selectedOptionOTP = this.formValidate.value.opcionOTP;
                  console.log(this.selectedOptionOTP);
                } else if (response.error === 3) {
                  this.utilitiesService.messageTitleModal = 'Su usuario ha sido bloqueado';
                  this.utilitiesService.messageModal =
                    response.respuesta.detalle;
                  this.utilitiesService.backLogin = false;
                  setTimeout(() => {
                    this.startTimer();
                    this.utilitiesService.loading = false;
                    $(".modalNuevowarning").click();
                  }, 500);
                } else {
                  this.utilitiesService.messageTitleModal =
                    "Tu mensaje no llegó";
                  this.utilitiesService.messageModal = response.mensaje;
                  this.utilitiesService.backLogin = false;
                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevowarning").click();
                  }, 500);
                }
              });
          }
        });
    }
  }

  reenviarCodigoOTP() {
    this.utilitiesService.loading = true;
    this.autenticacionService
      .getGenericToken()
      .pipe(first())
      .subscribe((token: Token) => {
        if (token.token) {
          this.validationService
            .getOTPGenerarService(
              this.utilitiesService.tipoDoc,
              this.utilitiesService.documentUser,
              this.formValidate.value.opcionOTP,
              this.utilitiesService.transaccionId,
              token.token
            )
            .pipe(first())
            .subscribe((response: RespuestaEnvioSMS) => {
              this.formValidateOTP.reset();

              if (response.error === 0 && response.tipoBloqueo === "") {
                this.utilitiesService.loading = false;
                this.startTimer();
              } else {
                this.utilitiesService.messageTitleModal = "Tu mensaje no llegó";
                this.utilitiesService.messageModal =
                  "No se pudo generar el código OTP, intenta nuevamente en 24 horas.";
                this.utilitiesService.backLogin = false;
                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $(".modalNuevowarning").click();
                  this.closeModalOTP();
                }, 500);
              }
            });
        }
      });
  }

  validarCodigoOTP() {
    this.submitted = true;
    if (this.formValidateOTP.invalid) {
      return;
    } else {
      this.utilitiesService.loading = true;
      let numberOtp = this.capturarNumeroOTP();
      this.autenticacionService
        .getGenericToken()
        .pipe(first())
        .subscribe((token: Token) => {
          if (token.token) {
            this.validationService
              .getValidarOTPService(
                this.utilitiesService.transaccionId,
                numberOtp,
                token.token
              )
              .pipe(first())
              .subscribe((response: RespuestaValidacionOTP) => {
                if (response.error === 1) {
                  this.closeModalOTP();

                  if (this.utilitiesService.actualizarEstadoFacialIC) {
                    //actualizar facial metodo 5
                    this.actualizarEstadoFacial();
                  }

                  if (
                    !this.utilitiesService.desdelogin &&
                    !this.utilitiesService.actualizarEstadoFacialIC
                  ) {
                    this.utilitiesService.messageTitleModal =
                      "¡Código validado correctamente!";
                    this.utilitiesService.messageModal = response.mensaje;

                    setTimeout(() => {
                      $(".modalNuevoSuccess").click();
                      this.utilitiesService.backLogin = false;
                    }, 700);

                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".btn-form-register").click();
                    }, 900);
                  }

                  if (this.utilitiesService.desdelogin) {
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      /* aca va el inicio iniciar sesion y redirigir al home */
                      this.iniciarSesion();
                    }, 500);
                  }
                } else {
                  if (response.numeroIntentos < 3) {
                    this.utilitiesService.messageTitleModal =
                      "Código de validación fallido";
                    this.utilitiesService.messageModal =
                      "El código ingresado no es válido, quedan " +
                      (3 - response.numeroIntentos) +
                      " intentos.";
                    this.utilitiesService.backLogin = false;
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      this.startTimer();
                      $(".modalNuevowarning").click();
                    }, 500);
                  } else {
                    this.utilitiesService.messageTitleModal =
                      "Bloqueo por código de validación";

                    switch (response.tipoBloqueo) {
                      case "OTP_TEMP":
                        this.utilitiesService.messageModal =
                          "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, intenta nuevamente en 24 horas.";
                        break;

                      case "FACIAL":
                        console.log(response.tipoBloqueo, "case facial");
                        this.utilitiesService.messageModal =
                          "Tu usuario ha sido bloqueado por validación biométrica. Visita la sede más cercana de Confa para desbloquearlo.";
                        break;

                      case "PREGUNTAS":
                        this.utilitiesService.messageTitleModal =
                          "Tu usuario ha sido bloqueado por preguntas de validación";
                        this.utilitiesService.messageModal =
                          "Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                        break;

                      case "CONTRASENA":
                        this.utilitiesService.messageModal =
                          "Por seguridad, tu acceso ha sido bloqueado.Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                        break;

                      default:
                        this.utilitiesService.messageModal =
                          "Tu usuario ha sido bloqueado. Acércate a la sede más cercana de Confa para generar tu desbloqueo.";
                    }
                    this.utilitiesService.backLogin = false;
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".modalNuevowarning").click();
                      this.closeModalOTP();
                    }, 500);
                  }
                }
              });
          }
        });
    }
  }

  startTimer() {
    // Limpiar intervalos previos antes de iniciar uno nuevo
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.timer = 60; // 60 segundos
    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.interval);
        this.interval = null; // Asegurar que la variable se limpie
      }
    }, 1000);
  }

  private ocultarConIndicios() {
    this.celularIndicio = this.utilitiesService.indiciocel;
    this.correoIndicio = this.utilitiesService.indiciocorreo;
    console.log(
      "Indicio2",
      this.utilitiesService.indiciocel,
      this.utilitiesService.indiciocorreo
    );

    this.celularIndicio = this.utilitiesService.phoneUser.replace(
      /\d(?=\d{4})/g,
      "*"
    );

    this.correoIndicio = this.utilitiesService.emailUser.replace(
      /(^.{2})(.*)(@.*)/,
      (match, firstTwo, hiddenPart, domain) => {
        return firstTwo + "*".repeat(hiddenPart.length) + domain;
      }
    );

    console.log("Indicio Ajustado", this.celularIndicio, this.correoIndicio);

    /* this.correoIndicio = this.utilitiesService.emailUser.replace(
      /(.{1})(.*)(.{1})(?=@)(.*)/,
      function (match, gp1, gp2, gp3, gp4) {
        const dominio = gp4.replace(
          /(.)(.*)(\..*)$/,
          function (domMatch, domGp1, domGp2, domGp3) {
            return domGp1 + domGp2[0] + "****" + domGp3;
          }
        );
        return gp1 + gp2.replace(/./g, "*") + gp3 + dominio;
      }
    );

    this.celularIndicio = this.utilitiesService.phoneUser.replace(
      /(\d{3})(\d+)(\d{3})/,
      function (match, gp1, gp2, gp3) {
        return gp1 + gp2.replace(/./g, "*") + gp3;
      }
    ); */
  }

  private capturarNumeroOTP(): number {
    let numberOtp =
      this.formValidateOTP.value.numberOTP_uno +
      this.formValidateOTP.value.numberOTP_dos +
      this.formValidateOTP.value.numberOTP_tres +
      this.formValidateOTP.value.numberOTP_cuatro +
      this.formValidateOTP.value.numberOTP_cinco +
      this.formValidateOTP.value.numberOTP_seis;
    return parseInt(numberOtp);
  }

  moverSiguiente(evento: Event, siguienteName: string): void {
    const input = evento.target as HTMLInputElement;
    if (input.value.length === 1) {
      const siguiente = document.querySelector(
        `input[formControlName="${siguienteName}"]`
      ) as HTMLInputElement;
      if (siguiente) {
        siguiente.focus();
      }
    }
  }

  moverAnterior(evento: KeyboardEvent, anteriorName: string): void {
    const input = evento.target as HTMLInputElement;
    if (input.value.length === 0 && evento.key === "Backspace") {
      const anterior = document.querySelector(
        `input[formControlName="${anteriorName}"]`
      ) as HTMLInputElement;
      if (anterior) {
        anterior.focus();
      }
    }
  }

  prevenirNoNumerico(evento: KeyboardEvent): void {
    if (isNaN(parseInt(evento.key))) {
      evento.preventDefault();
    }
  }

  clearInput(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  /* METODOS LOGIN */

  validarFacial() {
    this.utilitiesService.loading = true;
    this.autenticacionService
      .getGenericToken()
      .pipe(first())
      .subscribe((responseTING: Token) => {
        if (responseTING.token) {
          this.autenticacionService
            .validarFacial(this.pictureTaken.imageAsBase64,responseTING.token)
            .pipe(first())
            .subscribe((response: any) => {
              console.log(response.bloqueo);
              //valida si el usuario trae bloqueo
              if (response.bloqueo == true) {
                console.log("entro al bloqueo");

                this.utilitiesService.messageTitleModal = "Usuario Bloqueado";
                //swich de tipo bloqueo
                switch (response.tipoBloqueo) {
                  case "OTP_TEMP":
                    this.utilitiesService.messageModal =
                      "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, intenta nuevamente en 24 horas.";
                    break;

                  case "FACIAL":
                    console.log(response.tipoBloqueo, "case facial");
                    this.utilitiesService.messageModal =
                      "Tu usuario ha sido bloqueado por validación biométrica. Visita la sede más cercana de Confa para desbloquearlo.";
                    break;

                  case "PREGUNTAS":
                    this.utilitiesService.messageTitleModal =
                      "Tu usuario ha sido bloqueado por preguntas de validación";
                    this.utilitiesService.messageModal =
                      "Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                    break;

                  case "CONTRASENA":
                    this.utilitiesService.messageModal =
                      "Por seguridad, tu acceso ha sido bloqueado.Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                    break;

                  default:
                    this.utilitiesService.messageModal =
                      "Tu usuario ha sido bloqueado. Acércate a la sede más cercana de Confa para generar tu desbloqueo.";
                }
                this.utilitiesService.backLogin = false;

                this.closeModalFacial();

                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $(".modalNuevowarning").click();
                }, 500);
              } else if (response.registroPendiente) {
                //valida que el usuario no tenga un registro pendiente de validar

                this.utilitiesService.messageTitleModal =
                  "Documento pendiente de validación";
                this.utilitiesService.messageModal = "Ya tienes un registro pendiente de validación con este número de documento, por favor revisa el correo";
                this.utilitiesService.backLogin = false;

                $(".btn-close-popup-login").click();

                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $(".modalNuevoError").click();
                }, 500);
              } else if (!response.registrado) {
                this.utilitiesService.messageTitleModal =
                  "Usuario no encontrado";
                this.utilitiesService.messageModal =
                  "El usuario no está registrado.";

                this.utilitiesService.backLogin = false;

                this.closeModalFacial();

                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $(".modalNuevowarning").click();
                }, 500);
              } else if (!response.facial) {
                let mensajeFinal = "";

                const regexDocumento = /documento\s*:?\s*(\d+)-?/i;
                const regexError = /pero se presento un error:\s*(.+)/i;

                const matchDocumento = response.mensaje.match(regexDocumento);
                const matchError = response.mensaje.match(regexError);

                if (matchError != null) {
                  mensajeFinal = matchError[1];
                } else {
                  mensajeFinal = response.mensaje;
                }

                if (matchDocumento != null) {
                  this.utilitiesService.messageTitleModal = "Atención.";
                  this.utilitiesService.messageModal = mensajeFinal;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    //inicio de sesion con tipo de documento, documento y otp
                    $(".modalNuevowarning").click();
                  }, 500);
                } else {
                  this.utilitiesService.messageTitleModal = "Atención.";
                  this.utilitiesService.messageModal = mensajeFinal;

                  this.closeModalFacial();
                  this.utilitiesService.otrosIngresos = true;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    //inicio de sesion con tipo de documento, documento y otp
                    $(".modalNuevowarning").click();
                  }, 500);
                }
              } else if (response.facial && response.registrado) {
                //valida si tiene facial

                //si entra aca es por que el usuario tiene registraduria
                if (response.registraduria) {
                  // valida si trae los indicios y los asigna a las variables correspondientes
                  // si los indicion vienen vacios debe mostrar un modal con el mensaje de actualizacion de datos y le activa las otras opciones de inicio de sesion
                  if (!response.celular && !response.correo) {
                    //this.utilitiesService.otrosIngresos = true;

                    this.utilitiesService.messageTitleModal =
                      "Actualización de datos requerida";
                    this.utilitiesService.messageModal =
                      "Es necesario actualizar tus datos para continuar disfrutando de nuestros servicios. Por favor, acércate a la sede más cercana de Confa para actualizar tu informacion o inicia con tus credenciales.";
                    this.utilitiesService.backLogin = false;

                    this.closeModalFacial();
                    this.imgValida = true;

                    setTimeout(() => {
                      $(".modalNuevowarning-facial").click();
                    }, 500);
                  } // este es el caso en que si tenga los indicios, acá se le asinan a las variables correspondientes
                  else {
                    this.celularIndicio = response.celular;
                    this.correoIndicio = response.correo;

                    //capturar clave, tipo de documento y documento para el incio de sesion si es afirmativo el OTP
                    this.utilitiesService.credencialesLogin = {
                      tipoDocumento: response.tipoDoc || "", // Valor por defecto si está vacío
                      id: response.id,
                      documento: response.documento,
                    };

                    this.utilitiesService.tipoDoc = response.tipoDoc;
                    this.utilitiesService.documentUser = response.documento;
                    this.utilitiesService.transaccionId =
                      response.transaccionId;
                    this.utilitiesService.foto =
                      this.pictureTaken.imageAsBase64;

                    $(".btn-close-camara-validar").click();
                    this.closeModalFacial();
                    this.imgValida = true;

                    // inicia el contador
                    this.startTimer();

                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".btn-envio-otp").click();
                    }, 1000);
                  }
                } else {
                  this.utilitiesService.otrosIngresos = true;
                  this.utilitiesService.messageTitleModal =
                    "Actualización de datos requerida";
                  this.utilitiesService.messageModal =
                    "Es necesario actualizar tus datos para continuar disfrutando de nuestros servicios. Por favor, acércate a la sede más cercana de Confa para actualizar tu informacion o inicia con tus credenciales.";
                  this.utilitiesService.backLogin = false;

                  this.closeModalFacial();
                  this.imgValida = true;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevowarning").click();
                  }, 500);
                }
              } else {
                this.utilitiesService.messageTitleModal = "Atención.";
                this.utilitiesService.messageModal = response.mensaje;
                this.utilitiesService.backLogin = false;

                setTimeout(() => {
                  $(".modalNuevowarning").click();
                }, 200);
              }
            });
        }
      });
  }

  capturar(value) {
    this.formCredenciales.get("tpDoc").setValue(value);
    this.tipoDocXotp = value;
    console.log(value);
  }

  iniciarSesion() {
    let documentoXform = this.formCredenciales.get("document")?.value;
    let tpDocXform = this.tipoDocXotp;

    let document =
      Number(this.utilitiesService.credencialesLogin.documento) ||
      documentoXform;
    let documento = this.utilitiesService.credencialesLogin.documento;
    let password = this.utilitiesService.credencialesLogin.id;
    let tpDoc =
      this.utilitiesService.credencialesLogin.tipoDocumento || tpDocXform;

    this.utilitiesService.loading = true;
    this.autenticacionService
      .validarAplicativo()
      .pipe(first())
      .subscribe((res: EstadoAplicativo) => {
        if (res.estado == "A") {
          this.autenticacionService
            .loginCredenciales(document, password, tpDoc)
            .pipe(first())
            .subscribe((response: Session) => {
              console.log(response);
              if (response.exitoso) {
                if (response.usuario.existeUsuario) {
                  if (response.usuario.bloqueo) {
                    this.utilitiesService.messageTitleModal =
                      "¡Usuario Bloqueado!";

                    //swich de tipo bloqueo
                    switch (response.tipoBloqueo) {
                      case "OTP_TEMP":
                        this.utilitiesService.messageModal =
                          "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, intenta nuevamente en 24 horas.";
                        break;

                      case "FACIAL":
                        console.log(response.tipoBloqueo, "case facial");
                        this.utilitiesService.messageModal =
                          "Tu usuario ha sido bloqueado por validación biométrica. Visita la sede más cercana de Confa para desbloquearlo.";
                        break;

                      case "PREGUNTAS":
                        this.utilitiesService.messageTitleModal =
                          "Tu usuario ha sido bloqueado por preguntas de validación";
                        this.utilitiesService.messageModal =
                          "Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                        break;

                      case "CONTRASENA":
                        this.utilitiesService.messageModal =
                          "Por seguridad, tu acceso ha sido bloqueado.Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                        break;

                      default:
                        this.utilitiesService.messageModal =
                          "Tu usuario ha sido bloqueado. Acércate a la sede más cercana de Confa para generar tu desbloqueo.";
                    }
                    this.utilitiesService.backLogin = true;

                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".modalNuevoError").click();
                    }, 500);
                  } else {
                    this.utilitiesService.messageLoading = `Bienvenido ${response.usuario.primerNombre} ${response.usuario.segundoNombre} ${response.usuario.primerApellido} ${response.usuario.segundoApellido}`;
                    this.utilitiesService.mostrarModalSugerencia = false;
                    this.autenticacionService
                      .getToken(documento, password)
                      .pipe(first())
                      .subscribe((token: Token) => {
                        if (token.token) {
                          console.log(response.usuario);
                          localStorage.setItem(
                            "user",
                            JSON.stringify(response.usuario)
                          );
                          localStorage.setItem(
                            "cc",
                            response.usuario.documento
                          );
                          console.log("NO TIENE BLOQUEO");
                          this.utilitiesService.currentUser = response.usuario;
                          this.utilitiesService.puedeIngresar =
                            response.puedeIngresar;
                          this.utilitiesService.debeActualizarDatos =
                            response.debeActualizarDatos;
                          this.utilitiesService.debeRealizarValidacion =
                            response.debeRealizarValidacion;
                          if (response.debeRealizarValidacion) {
                            localStorage.setItem(
                              "preguntas",
                              JSON.stringify(response.usuario.preguntas)
                            );
                            /*  localStorage.setItem("respuesta", "V"); */
                            $(".btn-close-popup-login").click();
                            setTimeout(() => {
                              this.utilitiesService.loading = false;
                              this.router.navigate(["/home"]);
                            }, 500);
                          } else if (response.debeActualizarDatos) {
                            /*  localStorage.setItem("respuesta", "A"); */
                            $(".btn-close-popup-login").click();
                            setTimeout(() => {
                              this.utilitiesService.loading = false;
                              this.router.navigate(["/modify"]);
                            }, 500);
                          } else if (response.puedeIngresar) {
                            /*  localStorage.setItem("respuesta", "I"); */
                            this.consultarGrupoFamiliar(documento)
                            this.utilitiesService.estadoFacial =
                              response.facial_otp;
                            this.utilitiesService.estadoRegistraduria =
                              response.registraduria;
                            this.utilitiesService.desdelogin = false; 
                            $(".btn-close-popup-login").click();
                            if (response.registraduria == false) {
                              this.utilitiesService.messageTitleModal = "Aún no cuentas con validación biométrica."
                              this.utilitiesService.messageModal = "Te invitamos a acercarte a la sede más cercana de Confa para realizar tu proceso de enrolamiento despues de que completes el registro."
                              $(".btn-modal-exclaim-validation").click();
                            }

                            setTimeout(() => {
                              this.utilitiesService.loading = false;
                              this.router.navigate([this.returnUrl]);
                            }, 700);
                          }
                        } else {
                          this.utilitiesService.messageTitleModal =
                            "Inténtalo nuevamente";
                          this.utilitiesService.messageModal =
                            this.utilitiesService.errorInfoLogin;
                          this.utilitiesService.backLogin = false;

                          setTimeout(() => {
                            this.utilitiesService.loading = false;
                            $(".modalNuevoError").click();
                          }, 500);
                        }
                      });
                  }
                }
              } else {
                if (response.error == "4") {
                  this.utilitiesService.messageTitleModal =
                    "Actualización de datos requerida";
                  this.utilitiesService.messageModal =
                    "Ya has alcanzado la mayoría de edad. Es necesario actualizar tus datos para continuar disfrutando de nuestros servicios. Por favor, acércate a la sede más cercana de Confa para realizar el proceso de enrolamiento.";
                  this.utilitiesService.backLogin = false;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevowarning").click();
                  }, 500);
                } else if (response.registrado) {
                  this.utilitiesService.messageTitleModal = "Datos incorrectos";
                  this.utilitiesService.messageModal =
                    "Los datos ingresados son incorrectos. Intenta nuevamente.";
                  this.utilitiesService.backLogin = false;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevoError").click();
                  }, 500);
                } else {
                  this.utilitiesService.messageTitleModal =
                    "Usuario no encontrado";
                  this.utilitiesService.messageModal =
                    "El usuario no está registrado.";
                  this.utilitiesService.backLogin = false;

                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevoError").click();
                  }, 500);
                }
              }
            });
        } else {
          this.utilitiesService.messageTitleModal = res.titulo;
          this.utilitiesService.messageModal = res.mensaje;
          this.utilitiesService.backLogin = true;

          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".modalNuevowarning").click();
          }, 500);
        }
      });
  }

  inicioDocOtp() {
    let document = this.formCredenciales.get("document")?.value;
    let tpDoc = this.tipoDocXotp;
    this.documentoXotp = document;
    this.submitted = true;

    if (this.formCredenciales.invalid) {
      return;
    } else {
      this.utilitiesService.loading = true;
      console.log("desdelogin" + this.utilitiesService.desdelogin);
      this.autenticacionService
        .getGenericToken()
        .pipe(first())
        .subscribe((responseTING: Token) => {
          if (responseTING.token) {
            this.autenticacionService
              .consultUserInformationNASFANew(document.toString(),responseTING.token, tpDoc)
              .pipe(first())
              .subscribe((response: any) => {
                this.utilitiesService.otrosIngresos = false;
                this.utilitiesService.desdelogin = true;

                if (response.bloqueo) {
                  this.utilitiesService.messageTitleModal = "Usuario Bloqueado";

                  //swich de tipo bloqueo
                  switch (response.tipoBloqueo) {
                    case "OTP_TEMP":
                      this.utilitiesService.messageModal =
                        "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, intenta nuevamente en 24 horas.";
                      break;

                    case "FACIAL":
                      console.log(response.tipoBloqueo, "case facial");
                      this.utilitiesService.messageModal =
                        "Tu usuario ha sido bloqueado por validación biométrica. Visita la sede más cercana de Confa para desbloquearlo.";
                      break;

                    case "PREGUNTAS":
                      this.utilitiesService.messageTitleModal =
                        "Tu usuario ha sido bloqueado por preguntas de validación";
                      this.utilitiesService.messageModal =
                        "Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                      break;

                    case "CONTRASENA":
                      this.utilitiesService.messageModal =
                        "Por seguridad, tu acceso ha sido bloqueado.Visita la sede más cercana de Confa para realizar el proceso de desbloqueo.";
                      break;

                    default:
                      this.utilitiesService.messageModal =
                        "Tu usuario ha sido bloqueado. Acércate a la sede más cercana de Confa para generar tu desbloqueo.";
                  }

                  /* "No puedes ingresar debido a que excediste los intentos permitidos para validarte.  Por favor, realiza la revisión de tus datos comunicándote al siguiente correo: pqrsf@confa.co"; */
                  this.utilitiesService.backLogin = false;
                  $(".modalNuevowarning").click();

                  setTimeout(() => {
                    console.log("entro 1");

                    this.utilitiesService.loading = false;
                    $(".btn-cerra-tpDcYdoc").click();
                  }, 500);
                  this.formValidate.reset();
                } else if (response.registroPendiente) {
                  this.utilitiesService.messageTitleModal =
                    "Documento pendiente de validación";
                  this.utilitiesService.messageModal = response.mensaje;
                  this.utilitiesService.backLogin = false;
                  $(".btn-cerra-tpDcYdoc").click();
                  $(".btn-close-popup-login").click();
                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevoError").click();
                  }, 500);
                  this.formValidate.reset();
                } else if (response.registraduria && response.registrado) {
                  this.utilitiesService.loading = false;

                  console.log("enviaOTP", response);
                  this.startTimer();
                  this.utilitiesService.mostrarModalSugerencia = false;

                  this.celularIndicio = response.celular;
                  this.correoIndicio = response.correo;
                  this.utilitiesService.indiciocel = response.celular;
                  this.utilitiesService.indiciocorreo = response.correo;

                  this.utilitiesService.credencialesLogin = {
                    tipoDocumento: response.tipoDocumento || "C", // Valor por defecto si está vacío
                    id: response.id,
                    documento: response.documento,
                  };
                  this.utilitiesService.estadoFacial = response.facial_otp;

                  this.utilitiesService.tipoDoc = this.tipoDocXotp;
                  this.utilitiesService.documentUser = this.documentoXotp;
                  $(".btn-cerra-tpDcYdoc").click();

                  if (!response.celular && !response.correo) {
                    this.utilitiesService.otrosIngresos = true;
                    this.utilitiesService.messageTitleModal =
                      "Actualización de datos requerida";
                    this.utilitiesService.messageModal =
                      "Es necesario actualizar tus datos para continuar disfrutando de nuestros servicios. Por favor, acércate a la sede más cercana de Confa para actualizar tu informacion o inicia con tus credenciales.";
                    this.utilitiesService.backLogin = false;
                    setTimeout(() => {
                      $(".modalNuevowarning").click();
                    }, 500);
                  } else {
                    setTimeout(() => {
                      //this.utilitiesService.desdelogin = false;
                      this.utilitiesService.loading = false;
                      $(".btn-envio-otp").click();
                      this.contituarInicio = true;
                    }, 1500);
                  }
                } else if (!response.registrado) {
                  this.utilitiesService.messageTitleModal =
                    "Usuario no encontrado";
                  this.utilitiesService.messageModal =
                    "El usuario no está registrado.";
                  this.utilitiesService.backLogin = false;
                  setTimeout(() => {
                    $(".btn-cerra-tpDcYdoc").click();
                    this.utilitiesService.loading = false;
                    $(".modalNuevoError").click();
                  }, 500);
                } else {
                  this.utilitiesService.otrosIngresos = true;

                  this.utilitiesService.messageTitleModal =
                    "Actualización de datos requerida";
                  this.utilitiesService.messageModal =
                    "Es necesario actualizar tus datos para continuar disfrutando de nuestros servicios. Por favor, acércate a la sede más cercana de Confa para actualizar tu informacion o inicia con tus credenciales.";
                  this.utilitiesService.backLogin = false;

                  $(".btn-cerra-tpDcYdoc").click();
                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevowarning").click();
                  }, 500);
                }
              });
          }
        });
    }
  }

  enviarOtpXdocTipodoc() {
    console.log(
      "desdelogin noTengoAcceso enviarOtpXdocTipodoc" +
        this.utilitiesService.desdelogin
    );

    this.utilitiesService.loading = true;
    this.submitted = true;
    if (this.formValidate.value.opcionOTP == "") {
      this.opcionEnvio = true;
      return;
    } else if (this.formValidate.value.opcionOTP == "noTengo") {
      this.noTengoAcceso();
    } else {
      this.autenticacionService
        .getGenericToken()
        .pipe(first())
        .subscribe((responseTING: Token) => {
          if (responseTING.token) {
            this.validationService
              .ObtenerTrasaccionId(
                this.utilitiesService.tipoDoc,
                this.utilitiesService.documentUser.toString(),
                this.formValidate.value.opcionOTP,
                responseTING.token
              )
              .pipe(first())
              .subscribe((response: any) => {
                this.startTimer();
                this.utilitiesService.loading = false;
                this.utilitiesService.desdelogin = true;
                this.selectedOptionOTP = this.formValidate.value.opcionOTP;
                this.utilitiesService.transaccionId = response.transaccionId;
                this.contituarInicio = false;
                this.codigoEnviado = true;

                if (this.formValidate.value.opcionOTP == "correo") {
                  this.indicioEnvioSeleccionado =
                    this.correoIndicio || this.utilitiesService.indiciocorreo;
                } else {
                  this.indicioEnvioSeleccionado =
                    this.celularIndicio || this.utilitiesService.indiciocel;
                }
              });
          }
        });
    }
  }

  actualizarEstadoFacial() {
    this.utilitiesService.desdelogin = false;
    this.autenticacionService
      .getGenericToken()
      .pipe(first())
      .subscribe((responseTING: Token) => {
        if (responseTING.token) {
          this.autenticacionService
            .actualizarCampoFacial(
              this.utilitiesService.documentUser.toString(),
              this.utilitiesService.tipoDoc,
              this.utilitiesService.transaccionId.toString()
            )
            .pipe(first())
            .subscribe((response: any) => {
              console.log(response);

              this.utilitiesService.messageTitleModal =
                "Validacion de identidad exitosa ";
              this.utilitiesService.messageModal =
                "Tu identidad ha sido validada con éxito. Ahora puedes acceder mediante reconocimiento facial.";
              this.utilitiesService.backLogin = false;
              setTimeout(() => {
                this.utilitiesService.loading = false;
                $(".modalNuevoSuccess").click();
              }, 500);
            });
        }
      });
    this.utilitiesService.loading = false;
  }

  noTengoAcceso() {
    console.log("desdelogin noTengoAcceso" + this.utilitiesService.desdelogin);
    $(".btn-flecha-otp").click();
    this.utilitiesService.otrosIngresos = true;
    this.utilitiesService.messageTitleModal =
      "Actualización de datos requerida";
    this.utilitiesService.messageModal =
      "Es necesario actualizar tus datos para continuar disfrutando de nuestros servicios. Por favor, acércate a la sede más cercana de Confa para actualizar tu informacion.";
    this.utilitiesService.backLogin = false;

    this.utilitiesService.loading = false;
    setTimeout(() => {
      this.utilitiesService.loading = false;
      $(".modalNuevowarning").click();
    }, 500);

    setTimeout(() => {
      if (!this.utilitiesService.desdelogin) {
        $(".btn-form-register").click();
      } else {
        $(".btnLogin").click();
      }
    }, 450);
  }

    consultarGrupoFamiliar(documento: string) {
    this.autenticacionService.consultarInformacionMiPerfilConfa(documento).pipe(first())
      .subscribe((response: any) => {
        localStorage.setItem('InformacionMiPerfil', JSON.stringify(response));

        const gf = response.grupoFamiliar;
        const lgf = response.listadoGruposFamiliares;

        const personasACargo = [];

        // Extraer todas las personasACargo
        lgf.forEach(grupo => {
          if (grupo.personasACargo && Array.isArray(grupo.personasACargo)) {
            grupo.personasACargo.forEach(persona => {
              const datosGF = gf.find(miembro => miembro.documento === persona.documento);

              const personaFusionada = {
                ...persona,
                ...datosGF,
                nombreCompleto: datosGF
                  ? `${datosGF.nombre1 || ''} ${datosGF.nombre2 || ''} ${datosGF.apellido1 || ''} ${datosGF.apellido2 || ''}`.replace(/\s+/g, ' ').trim()
                  : persona.nombre
              };

              personasACargo.push(personaFusionada);
            });
          }
        });

        const edad = this.dataServiciosCursos.calcularEdad(response.fechaNacimiento)

        // Agregar al titular (la persona que consulta)
        const titularFusionado = {
          nombre: `${response.primerApellido || ''} ${response.segundoApellido || ''} ${response.primerNombre || ''} ${response.segundoNombre || ''}`.replace(/\s+/g, ' ').trim(),
          documento: response.documento,
          tipoDoc: response.tipoDocumento || '', // o response.tipo_docu_text si aplica
          parentesco: 'TITULAR',
          edad: edad,
          fechaNacimiento: response.fechaNacimiento || '',
          valorSubsidio: 0,
          estadoEscolaridad: 'NO APLICA',
          fechaVencimientoEscolaridad: '',
          estadoSupervivencia: 'VIGENTE',
          custodia: '',
          docBeneficiarioPago: response.documento,
          nombreBeneficiarioPago: response.nombreCompleto || '',
          estadoBeneficiario: response.estado || 'A',
          otroPadre: '',
          salarioOtroPadre: 0,
          discapacidad: 'N',
          docOtroPadre: '',
          salario: 0,
          numeroCuotas: 0,
          sexo: response.sexo || '',
          nombre1: response.primerNombre || '',
          nombre2: response.segundoNombre || '',
          apellido1: response.primerApellido || '',
          apellido2: response.segundoApellido || '',
          categoria: response.categoria || '',
          nombreCompleto: response.nombreCompleto || `${response.primerNombre || ''} ${response.segundoNombre || ''} ${response.primerApellido || ''} ${response.segundoApellido || ''}`.replace(/\s+/g, ' ').trim()
        };


        personasACargo.push(titularFusionado);

        // Guardar en localStorage
        localStorage.setItem('grupoFamiliarFusionado', JSON.stringify(personasACargo));
      });
  }
}
