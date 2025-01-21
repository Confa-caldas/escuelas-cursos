import { Component, OnInit, Input } from "@angular/core";
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { first } from "rxjs/operators";
import { Token, User, UserRegister } from "../../interfaces/user.interface";
import * as CryptoJS from "crypto-js";
import * as Md5 from "crypto-js/md5";
import { UtilitiesService } from "../../services/utilities.service";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var $;

@Component({
  selector: "app-card-register-form",
  templateUrl: "./card-register-form.component.html",
  styleUrls: ["./card-register-form.component.css"],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class CardRegisterFormComponent implements OnInit {
  formRegister: UntypedFormGroup;
  submitted: boolean = false;
  showPassword: boolean = false;
  datosUsuario:any;
  @Input() user: User;
  @Input() respuesta: boolean;
  constructor(
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService
  ) {this.user = this.utilitiesService.registerUser;
    console.log(this.user)
   }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    console.log('entro al componente register-form')
    this.formRegister = new UntypedFormGroup({
      typeDocument: new UntypedFormControl("", [Validators.required]),
      firstName: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("[A-Za-zá-úÁ-Ú ]*"),
      ]),
      secondName: new UntypedFormControl("", Validators.pattern("[A-Za-zá-úÁ-Ú ]*")),
      firstLastName: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("[A-Za-zá-úÁ-Ú ]*"),
      ]),
      secondLastName: new UntypedFormControl(
        "",
        Validators.pattern("[A-Za-zá-úÁ-Ú ]*")
      ),
      document: new UntypedFormControl({ value: "", disabled: true }, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
        Validators.pattern("^[0-9]+"),
      ]),
      birthDate: new UntypedFormControl("", Validators.required),
      address: new UntypedFormControl("", Validators.required),
      phone: new UntypedFormControl("", Validators.required),
      email: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern(
          "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
          "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
        ),
        Validators.email,
      ]),
      confirmEmail: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern(
          "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
          "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
        ),
        Validators.email,
      ]),
      password: new UntypedFormControl("", [
        Validators.required,
        Validators.minLength(6),
        this.validarPassword,
      ]),
      confirmPassword: new UntypedFormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
      aceptHabeasData: new UntypedFormControl(false, Validators.required),
    });

    this.formRegister.controls["confirmEmail"].setValidators([
      Validators.required,
      this.equalsEmail.bind(this.formRegister),
    ]);

    this.formRegister.controls["confirmPassword"].setValidators([
      Validators.required,
      this.equalsPassword.bind(this.formRegister),
    ]);


  }
  validarPassword(control: UntypedFormControl) {
    const valor = control.value;
    const tieneMayuscula = /[A-Z]/.test(valor);
    const tieneMinuscula = /[a-z]/.test(valor);
    const tieneNumero = /[0-9]/.test(valor);
    const tieneCaracterEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      valor
    );

    const esValido =
      tieneMayuscula && tieneMinuscula && tieneNumero && tieneCaracterEspecial;

    return esValido ? null : { passwordInvalida: true };
  }
  get f() {
    return this.formRegister?.controls || {};
  }

  fullNameDisabled() {

    let existUser = this.utilitiesService.existUser;
    if (existUser) {
      this.formRegister.get("firstName").setValue(this.user.primerNombre);
      this.formRegister.get("secondName").setValue(this.user.segundoNombre);
      this.formRegister.get("firstLastName").setValue(this.user.primerApellido);
      this.formRegister
        .get("secondLastName")
        .setValue(this.user.segundoApellido);
      this.formRegister.get("birthDate").setValue(this.user.fechaNacimiento);
    }
  }

  close() {
    this.cookieService.delete("gtoken");
    this.formRegister.get("firstName").setValue("");
    this.formRegister.get("secondName").setValue("");
    this.formRegister.get("firstLastName").setValue("");
    this.formRegister.get("secondLastName").setValue("");
    this.formRegister.get("birthDate").setValue("");
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.user)
    //this.formRegister.get("document").setValue(this.user.documento);

    console.log(this.formRegister)
    this.fullNameDisabled();

    

    if (this.formRegister.invalid) {
      return;
    } else {
      const document = this.utilitiesService.registerUser.documento;
      let userRegister = this.generateUser(this.f, this.user);

      if (
        /* this.formRegister.controls["document"].value !== || */ document !== "" || document !== null &&
        this.formRegister.controls["aceptHabeasData"].value
      ) {
        this.utilitiesService.loading = true; //1022254874

        this.authenticationService
          .getGenericToken()
          .pipe(first())
          .subscribe((responseTING: Token) => {
            if (responseTING.token) {
              this.authenticationService
                .saveUserRegister(userRegister,responseTING.token)
                .pipe(first())
                .subscribe((response: any) => {
                  if (response === "") {
                    this.utilitiesService.messageTitleModal =
                      "Registro en proceso";
                    this.utilitiesService.messageModal =
                      "Te hemos enviado un correo de confirmación. Debes confirmar para poder ingresar, si no ves el correo en tu bandeja principal por favor revisa tu carpeta de SPAM, Gracias!.";
                    this.utilitiesService.backLogin = false;

                    $(".btn-close-form-register").click();
                    this.cookieService.delete("gtoken");

                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".modalNuevowarning").click();
                    }, 1000);

                    this.formRegister.reset({
                      firstName: "",
                      secondName: "",
                      firstLastName: "",
                      secondLastName: "",
                      email: "",
                      confirmEmail: "",
                      password: "",
                      confirmPassword: "",
                      aceptHabeasData: false,
                    });
                  } else {
                    this.utilitiesService.messageTitleModal =
                      "Tu registro ha fallado";
                    this.utilitiesService.messageModal = response;
                    this.utilitiesService.backLogin = false;

                    // console.log("Registro invalido:", response);
                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".modalNuevoError").click();
                    }, 1000);
                  }
                });
            }
          });
      } else {
        this.utilitiesService.loading = false;
      }
    }
  }

  equalsEmail(control: UntypedFormControl): { [s: string]: boolean } {
    let formRegister: any = this;
    if (control.value !== formRegister.controls["email"].value) {
      return {
        equalsemail: true,
      };
    }
    return null;
  }

  equalsPassword(control: UntypedFormControl): { [s: string]: boolean } {
    let formRegister: any = this;
    if (control.value !== formRegister.controls["password"].value) {
      return {
        equalspassword: true,
      };
    }
    return null;
  }

  private generateUser(f: any, user: User) {
    let url = `${environment.apiUrl}` + "confirm";
    let fechaRegistroPreguntas = null;
    if (this.respuesta) {
      fechaRegistroPreguntas = new Date();
    } else {
      fechaRegistroPreguntas = null;
    }
    console.log(user)
    let userRegister = {
      sistema: "Escuela y cursos",
      linkMensaje: url,
      parametro: "34240997a16763c011134c570fcc149e",
      remitente: "Escuela y cursos",
      asunto: "Confirmación de registro",
      usuario: {
        documento: user && user.documento && user.documento.trim() ? user.documento : this.utilitiesService.registerUser.documento,
        direccion: f.address.value,
        telefono: f.phone.value,
        sexo: user && user.sexo && user.sexo.trim() ? user.sexo : "",
        categoria: user && user.categoria && user.categoria.trim() ? user.categoria : "D",
        celular: f.phone.value,
        correo: f.email.value,
        clave: this.hashMD5(f.password.value),
        clave1: this.encriptar(f.password.value),
        codBeneficiario: user && user.codBeneficiario && user.codBeneficiario.trim() ? user.codBeneficiario : "",
        nombreBeneficiario: user && user.nombreBeneficiario && user.nombreBeneficiario.trim() ? user.nombreBeneficiario : "",
        fechaNacimiento: f.birthDate.value,
        fechaRegistro: user && user.fechaRegistro && user.fechaRegistro.trim() ? user.fechaRegistro : "",
        documentoTrabajador: user && user.documento && user.documento.trim() ? user.documento : this.utilitiesService.registerUser.documento,
        primerNombre: f.firstName.value,
        segundoNombre: f.secondName.value,
        primerApellido: f.firstLastName.value,
        segundoApellido: f.secondLastName.value,
        link: url,
        existeUsuario: user && user.existeUsuario ? user.existeUsuario : false,
        usuarioNasfa: user && user.usuarioNasfa ? user.existeUsuario : false,
        sistemaActualizacion: user && user.sistemaActualizacion && user.sistemaActualizacion.trim() ? user.sistemaActualizacion : "",
        correoMd5: "" + this.hashMD5(f.email.value),
        aceptaHabeas: f.aceptHabeasData.value,
        tipoDocumento: f.typeDocument.value,
        preguntasValidacion: this.respuesta,
        fechaRespuestasValidacion: fechaRegistroPreguntas,
        bloqueoUser: false,
        estadoUser: user && user.estadoUser ? user.estadoUser : "",
        contUser: 0,
        bloqueo: user && user.bloqueo ? user.bloqueo : false,
        /* preguntas: user.preguntas,  */
        mensaje: '',
        registroPendiente: false
      },
    };
    console.log(userRegister)
    return userRegister;
  }

  generarTokenIngreso() {
    this.authenticationService
      .getGenericToken()
      .pipe(first())
      .subscribe((responseTING: Token) => {
        if (responseTING.token) {
        }
      });
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    let month: string | number = today.getMonth() + 1;
    let day: string | number = today.getDate();

    // Ajustar el formato de mes y día si es necesario (agregar un 0 al principio si es menor a 10)
    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return `${year}-${month}-${day}`;
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
}
