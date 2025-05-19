import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";
import { first } from "rxjs/operators";
import { User, Token, PreguntasUser, Questions, Session, EstadoAplicativo } from "../../interfaces/user.interface";
import { UtilitiesService } from "../../services/utilities.service";
import { QuestionsService } from "src/app/services/questions.service";
import { DataServiciosCursos } from 'src/app/services/data-cursos.service'
import { CookieService } from "ngx-cookie-service";
import * as CryptoJS from "crypto-js";
import * as Md5 from "crypto-js/md5";

declare var $;

@Component({
  selector: "app-card-login",
  templateUrl: "./card-login.component.html",
  styleUrls: ["./card-login.component.css"],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class CardLoginComponent implements OnInit {
  formLogin: UntypedFormGroup;
  showPassword: boolean = false;
  submitted: boolean = false;
  returnUrl: string;
  preguntar: Boolean = false;
  pass: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    public questionsService: QuestionsService,
    private cookieService: CookieService,
    private dataServiciosCursos: DataServiciosCursos
  ) { }

  ngOnInit() {
    this.formLogin = new UntypedFormGroup({
      document: new UntypedFormControl("", [
        Validators.required,
        Validators.min(99999),
        Validators.max(999999999999999),
        Validators.pattern("^[0-9]+"),
      ]),
      password: new UntypedFormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

    // redirect to home if already logged in
    // redireccionar a home si ya esta conectado
    if (this.authenticationService.currentTokenValue) {
      this.router.navigate(["/home"]);
    }

    // get return url from route parameters or default to '/'
    // obtener retorno de los parametros route de la url o por defecto a '/'
    this.returnUrl =
      this.activatedRoute.snapshot.queryParams["returnUrl"] || `/home`;
    // console.log('returnUrl', this.returnUrl);
  }
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
  // convenience getter for easy access to form fields
  // un práctico buscador para facilitar el acceso a los campos de los formularios
  get f() {
    return this.formLogin.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.utilitiesService.messageLoading = "";

    // Validación del formulario
    if (this.formLogin.invalid) {
      return;
    }

    const document = this.f.document.value;
    const rawPassword = this.f.password.value;

    if (!document || !rawPassword) {
      return;
    }

    const password = this.encriptar(rawPassword); // Encriptar la contraseña
    this.utilitiesService.loading = true;

    this.authenticationService.validarAplicativo()
      .pipe(first())
      .subscribe({
        next: (res: EstadoAplicativo) => {
          if (res.estado !== "A") {
            this.showModalMessage(res.titulo, res.mensaje, true);
            return;
          }

          this.authenticationService.loginCredenciales(document, password)
            .pipe(first())
            .subscribe({
              next: (response: Session) => {
                if (!response.exitoso) {
                  this.showModalMessage("Inténtalo nuevamente", this.utilitiesService.errorInfoLogin, false);
                  return;
                }

                const usuario = response.usuario;
                if (!usuario.existeUsuario) {
                  this.showModalMessage("Inténtalo nuevamente", this.utilitiesService.errorInfoLogin, false);
                  this.authenticationService.logout();
                  return;
                }

                if (usuario.bloqueo) {
                  this.showModalMessage(
                    "¡Usuario Bloqueado!",
                    "No puedes ingresar debido a que excediste los intentos permitidos para validarte. Escríbenos a pqrsf@confa.co con copia de tu documento.",
                    true
                  );
                   this.authenticationService.logout();
                  return;
                }

                // Calcular la edad del usuario
                const edad = this.dataServiciosCursos.calcularEdad(usuario.fechaNacimiento);
                this.utilitiesService.edad = edad;
                this.utilitiesService.fechaNaciemintoResponsable = usuario.fechaNacimiento;

                if (edad < 14) {
                  this.showModalMessage(
                    "No puedes continuar",
                    "Para adquirir un curso deportivo debe ingresar el titular responsable.",
                    false
                  );
                  return;
                }

                if (edad >= 14 && edad <= 17) {
                  this.dataServiciosCursos.getHabeasData(usuario.documento)
                    .pipe(first())
                    .subscribe({
                      next: (res: any) => {
                        if (!res.aceptacionTratamiento) {
                          this.showModalMessage(
                            "No tienes autorización",
                            "Debe tener autorización de habeas data proporcionada por los padres.",
                            false
                          );
                          return;
                        }
                        this.continuarLogin(response, document, password);
                      },
                      error: () => {
                        this.showModalMessage(
                          "No puedes continuar",
                          "No se pudo verificar el permiso de habeas data.",
                          false
                        );
                      }
                    });
                } else {
                  this.continuarLogin(response, document, password);
                }
              },
              error: () => {
                this.showModalMessage("No puedes continuar", "No se pudo iniciar sesión. Inténtalo nuevamente.", false);
              }
            });
        },
        error: () => {
          this.showModalMessage("No puedes continuar", "No se pudo validar el aplicativo.", false);
        }
      });
  }

  // Métodos auxiliares

  private continuarLogin(response: Session, document: string, password: string) {
    this.authenticationService.getToken(document, password)
      .pipe(first())
      .subscribe({
        next: (token: Token) => {
          if (!token.token) {
            this.showModalMessage("No puedes continuar", "No se pudo obtener el token.", false);
             this.authenticationService.logout();
            return;
          }

          localStorage.setItem("user", JSON.stringify(response.usuario));
          localStorage.setItem("cc", response.usuario.documento);

          if (response.debeRealizarValidacion) {
            localStorage.setItem("preguntas", JSON.stringify(response.usuario.preguntas));
            this.navigateTo("/questions");
          } else if (response.debeActualizarDatos) {
            this.navigateTo("/modify");
          } else if (response.puedeIngresar) {
            this.consultarGrupoFamiliar(document)
            this.verificarServicios();
          } else {
            this.showModalMessage("Inténtalo nuevamente", this.utilitiesService.errorInfoLogin, false);
             this.authenticationService.logout();
          }
        },
        error: () => {
          this.showModalMessage("No puedes continuar", "No se pudo completar la autenticación.", false);
           this.authenticationService.logout();
        }
      });
  }

  private verificarServicios() {
    this.dataServiciosCursos.getServicios()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          const servicios = response.servicios || [];
          if (servicios.length === 0) {
            this.showModalMessage("No puedes continuar", "No hay cursos activos.", false);
             this.authenticationService.logout();
            return;
          }

          this.utilitiesService.servicios = servicios;

          if (servicios.length === 1) {
            localStorage.setItem("idServicio", servicios[0].id);
            this.navigateTo("/cursos");
          } else {
            this.navigateTo("/home");
          }
        },
        error: () => {
          this.showModalMessage("No puedes continuar", "No hay servicios disponibles.", false);
          //this.authenticationService.logout();
        }
      });
  }

  private showModalMessage(title: string, message: string, backToLogin: boolean) {


    this.utilitiesService.messageTitleModal = title;
    this.utilitiesService.messageModal = message;
    this.utilitiesService.backLogin = backToLogin;
    this.utilitiesService.loading = false;

    setTimeout(() => {
      $(".modalNuevowarning").click();
    }, 500);
  }

  private navigateTo(route: string) {
    $(".btn-close-popup-login").click();
    setTimeout(() => {
      this.utilitiesService.loading = false;
      this.router.navigate([route]);
    }, 500);
  }

  consultarPreguntas(documento: string) {
    this.authenticationService
      .getGenericTokenC()
      .pipe(first())
      .subscribe((tokenC: Token) => {
        if (tokenC) {
          this.questionsService
            .getQuestions(documento)
            .pipe(first())
            .subscribe((respons: Questions) => {
              if (respons.ConsultaPreguntasResponse.mensaje == "") {
                this.preguntar = true;
              }
            });
        }
      });
  }

  validarInfoFaltante(
    tipoDocumento: string,
    celular: string,
    fechaNacimiento: string,
    direccion: string
  ) {
    if (
      tipoDocumento == "" ||
      celular == "" ||
      fechaNacimiento == "" ||
      direccion == ""
    ) {
      $(".btn-close-popup-login").click();
      setTimeout(() => {
        this.utilitiesService.loading = false;
        this.router.navigate(["modify"]);
      }, 500);
    } else if (
      tipoDocumento != "" ||
      celular != "" ||
      fechaNacimiento != "" ||
      direccion != ""
    ) {
      $(".btn-close-popup-login").click();
      setTimeout(() => {
        this.utilitiesService.loading = false;
        this.router.navigate([this.returnUrl]);
      }, 500);
    }
  }

  //Metodos encargados de encriptar la contraseña
  encriptar(pas: string) {
    try {
      const claveMD5 = this.hashMD5(pas);
      const claveSHA256 = this.hashSHA256(claveMD5);
      const claveconfa = this.encriptarConfa(claveSHA256);
      return claveconfa;
      console.log("Nueva contraseña: " + claveconfa);
    } catch (error) {
      console.error("Error al encriptar la contraseña:", error);
    }
  }

  hashMD5(pas: string): string {
    try {
      const md5Hash = Md5(pas).toString();
      return md5Hash;
    } catch (error) {
      console.error("Error al calcular el hash MD5:", error);
      throw error;
    }
  }

  hashSHA256(clave: string): string {
    try {
      // Calcular el hash
      const hash = CryptoJS.SHA256(clave).toString(CryptoJS.enc.Hex);
      return hash;
    } catch (error) {
      console.error("Error al calcular el hash SHA256:", error);
      throw error;
    }
  }

  encriptarConfa(valor: string): string {
    try {
      let respuesta = valor
        .replace(/1/g, "Fb")
        .replace(/2/g, "at")
        .replace(/4/g, "VI")
        .replace(/6/g, "pZ")
        .replace(/7/g, "sH")
        .replace(/9/g, "Dx")
        .replace(/3/g, "Mo")
        .replace(/0/g, "rQ");
      return respuesta;
    } catch (error) {
      console.error("Error al encriptar con Confa:", error);
      throw error;
    }
  }

  consultarGrupoFamiliar(documento: string){

    this.authenticationService.consultarInformacionMiPerfilConfa(documento).pipe(first())
      .subscribe((response: any) => {
        const gf = response.grupoFamiliar;
        const lgf = response.listadoGruposFamiliares;
        console.log('gf',gf)
        console.log('lgf',lgf)
      })
  }
}
