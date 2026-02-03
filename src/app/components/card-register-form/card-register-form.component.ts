import { Component, OnInit, Input,OnChanges,SimpleChanges } from "@angular/core";
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { first } from "rxjs/operators";
import { Token, User, Departamento,Municipio } from "../../interfaces/user.interface";
import * as CryptoJS from "crypto-js";
import * as Md5 from "crypto-js/md5";
import { UtilitiesService } from "../../services/utilities.service";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationService } from "src/app/services/validation.service";
declare var $;

@Component({
  selector: "app-card-register-form",
  templateUrl: "./card-register-form.component.html",
  styleUrls: ["./card-register-form.component.css"],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule]
})
export class CardRegisterFormComponent implements OnInit, OnChanges {
  formRegister: UntypedFormGroup;
  submitted: boolean = false;
  showPassword: boolean = false;
  isComercialCheched: boolean = false;
  @Input() user: User;
  @Input() respuesta: boolean;
  departamento: string;
  dataDepartamentos: Departamento[];
  dataMunicipios: Municipio[];
  municipio: string;

  constructor(
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private validationService: ValidationService,
    private cookieService: CookieService
    
  ) {}
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
  ngOnInit() {
    this.getDepartamentos();
    this.formRegister = new UntypedFormGroup({
      typeDocument: new UntypedFormControl("", [Validators.required]),
      firstName: new UntypedFormControl("", [
        Validators.required,
        Validators.pattern("[A-Za-zá-úÁ-Ú ]*"),
      ]),
      secondName: new UntypedFormControl(
        "",
        Validators.pattern("[A-Za-zá-úÁ-Ú ]*")
      ),
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
      confirmPhone: new UntypedFormControl("", Validators.required),
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
      checkComercial: new UntypedFormControl(false, Validators.required),
      departamento: new UntypedFormControl("", Validators.required),
      municipio: new UntypedFormControl("", Validators.required),
    });

    this.formRegister.controls["confirmEmail"].setValidators([
      Validators.required,
      this.equalsEmail.bind(this.formRegister),
    ]);

    this.formRegister.controls["confirmPassword"].setValidators([
      Validators.required,
      this.equalsPassword.bind(this.formRegister),
    ]);

    this.formRegister.controls["confirmPhone"].setValidators([
      Validators.required,
      this.equalsPhone.bind(this.formRegister),
    ]);

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && changes['user'].currentValue) {
      console.log('Usuario cambiado:', this.user);
      // Lógica cuando llega o cambia el `user`
        this.formRegister?.get('email')?.setValue(this.user.correo || '');
        this.formRegister?.get("phone")?.setValue(this.user.celular  || '');
 
    
    }
  }


 /*  onEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formRegister.get("email").setValue(input.value); 
  } */

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
    return this.formRegister.controls;
  }

  fullNameDisabled() {
    let existUser = this.utilitiesService.existUser;
    // console.log("existUser", existUser);
    if (existUser) {
      this.formRegister.get("firstName").setValue(this.user.primerNombre);
      this.formRegister.get("secondName").setValue(this.user.segundoNombre);
      this.formRegister.get("firstLastName").setValue(this.user.primerApellido);
      this.formRegister
        .get("secondLastName")
        .setValue(this.user.segundoApellido);
      this.formRegister.get("birthDate").setValue(this.user.fechaNacimiento);
      this.formRegister
        .get("typeDocument")
        .setValue(this.utilitiesService.tipoDoc);

      if (this.user.correo) {
        //this.formRegister.get("email").setValue(this.user.correo);
      //  this.formRegister.get("confirmEmail").setValue(this.user.correo);
      }
      if (this.user.celular) {
        this.formRegister.get("phone").setValue(this.user.celular);
        this.formRegister.get("confirmPhone").setValue(this.user.celular);
      }
    }
  }

  close() {
    // location.reload()
    this.cookieService.delete("gtoken");
    this.formRegister.get("firstName").setValue("");
    this.formRegister.get("secondName").setValue("");
    this.formRegister.get("firstLastName").setValue("");
    this.formRegister.get("secondLastName").setValue("");
    this.formRegister.get("birthDate").setValue("");
    this.formRegister.get("typeDocument").setValue("");
    this.formRegister.get("phone").setValue("");
    this.formRegister.get("email").setValue("");
    this.formRegister.get("confirmEmail").setValue("");
    this.formRegister.get("password").setValue("");
    this.formRegister.get("confirmPassword").setValue("");
     window.location.reload();
  }

  onSubmit() {
    this.submitted = true;
    this.formRegister.get("document").setValue(this.user.documento);
    this.formRegister.get("typeDocument").setValue(this.user.tipoDocumento);
    this.fullNameDisabled();

    if (this.formRegister.invalid) {
      return;
    } else {
      let userRegister = this.generateUser(this.f, this.user);
      /*  console.log("Envio a registro ", userRegister); */

      if (
        this.formRegister.controls["document"].value !== "" &&
        userRegister.usuario.aceptaHabeas
      ) {
        this.utilitiesService.loading = true;
        this.authenticationService
          .getGenericToken()
          .pipe(first())
          .subscribe((responseTING: Token) => {
            if (responseTING.token) {
              this.authenticationService
                .saveUserRegister(userRegister,responseTING.token)
                .pipe(first())
                .subscribe((response: any) => {
                  console.log(response);
                  if (response == "") {
                    this.utilitiesService.messageTitleModal =
                      "Registro en proceso";
                    this.utilitiesService.messageModal =
                      "Te hemos enviado un correo de confirmación. Debes confirmar para poder ingresar, si no ves el correo en tu bandeja principal por favor revisa tu carpeta de SPAM, Gracias!.";
                    this.utilitiesService.backLogin = false;

                    $(".btn-close-form-register").click();
                    this.cookieService.delete("gtoken");
                    this.infoCheckComercial();

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
                      checkComercial: false,
                      documento: "",
                      municipio: "",
                      departamento: "",
                      typeDocument: "",
                      confirmPhone: "",
                    });

                    setTimeout(() => {
                      this.utilitiesService.loading = false;
                      $(".btn-modal-exclaim-validation-confirmacion-registro").click();
                    }, 1000);
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

  equalsPhone(control: UntypedFormControl): { [s: string]: boolean } {
    let formRegister: any = this;
    if (control.value !== formRegister.controls["phone"].value) {
      return {
        equalspassword: true,
      };
    }
    return null;
  }

  private generateUser(f: any, user: User) {

    let url = `${environment.apiUrl}` + "confirm";
    let fechaRegistroPreguntas = null;
    let habeasData;
    if (
      this.utilitiesService.calculateAge(user.fechaNacimiento) < 18 ||
      !user.usuarioNasfa
    ) {
      habeasData = true;
    } else {
      habeasData = f.aceptHabeasData.value;
    }

    if (this.respuesta) {
      fechaRegistroPreguntas = new Date();
    } else {
      fechaRegistroPreguntas = null;
    }
    this.isComercialCheched = f.checkComercial.value;
    let userRegister = {
      sistema: "Mi perfil",
      linkMensaje: url,
      parametro: "34240997a16763c011134c570fcc149e",
      remitente: "Mi perfil",
      asunto: "Confirmación de registro",
      facialOtp: this.utilitiesService.facialOtp,
      preguntasOtp: this.utilitiesService.preguntasOtp,
      idTransaccion: this.utilitiesService.transaccionId
        ? this.utilitiesService.transaccionId.toString()
        : "",
      checkComercial: f.checkComercial.value,
      departamento: f.departamento.value,
      municipio: f.municipio.value,
      usuario: {
        documento: user.documento,
        direccion: f.address.value,
        telefono: f.phone.value,
        sexo: user.sexo,
        categoria: user.categoria,
        celular: f.phone.value,
        correo: f.email.value,
        clave: this.hashMD5(f.password.value),
        clave1: this.encriptar(f.password.value),
        codBeneficiario: user.codBeneficiario,
        nombreBeneficiario: user.nombreBeneficiario,
        fechaNacimiento: f.birthDate.value,
        fechaRegistro: user.fechaRegistro,
        documentoTrabajador: user.documentoTrabajador,
        primerNombre: f.firstName.value,
        segundoNombre: f.secondName.value,
        primerApellido: f.firstLastName.value,
        segundoApellido: f.secondLastName.value,
        link: url,
        existeUsuario: user.existeUsuario,
        usuarioNasfa: user.usuarioNasfa,
        sistemaActualizacion: user.sistemaActualizacion,
        correoMd5: "" + this.hashMD5(f.email.value),
        aceptaHabeas: habeasData,
        tipoDocumento: f.typeDocument.value,
        preguntasValidacion: this.respuesta,
        fechaRespuestasValidacion: fechaRegistroPreguntas
          ? fechaRegistroPreguntas
          : "",
        bloqueoUser: false,
        estadoUser: user.estadoUser,
        contUser: 0,
        bloqueo: user.bloqueo,
        preguntas: user.preguntas,
        mensaje: "",
        registroPendiente: false,
      },
    };

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

  getDepartamentos() {
    this.authenticationService
      .getGenericToken()
      .pipe(first())
      .subscribe((responseTING: Token) => {
        if (responseTING.token) {
          this.authenticationService
            .getGenericToken()
            .pipe(first())
            .subscribe((responseTING: Token) => {
              if (responseTING.token) {
                this.authenticationService
                  .getDepartamentos(responseTING.token)
                  .subscribe((response: Departamento[]) => {
                    if (response?.length > 0) {
                     
                      this.dataDepartamentos = response;
                      this.dataDepartamentos =  this.ordenarDepartamentosYMunicipios( this.dataDepartamentos);

                    } else {
                      this.utilitiesService.messageTitleModal = "Espera";
                      this.utilitiesService.messageModal =
                        "Error consultando los tipos de documentos.";
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
      });
  }


  ordenarDepartamentosYMunicipios(departamentos: Departamento[]): Departamento[] {
    // Primero ordenamos los municipios de cada departamento
    departamentos.forEach(depto => {
      depto.municipios.sort((a, b) =>
        a.nombre_municipio.localeCompare(b.nombre_municipio)
      );
    });
  
    // Luego ordenamos los departamentos dejando Caldas de primero
    departamentos.sort((a, b) => {
      if (a.nombre_departamento === 'CALDAS') return -1;
      if (b.nombre_departamento === 'CALDAS') return 1;
      return a.nombre_departamento.localeCompare(b.nombre_departamento);
    });
  
    return departamentos;
  }



  captureDepartamento(value: string) {
    this.formRegister.controls["departamento"].setValue(value);
    this.departamento = value;

    const departamento = this.dataDepartamentos.find(
      (d) => d.nombre_departamento === this.departamento
    );
    this.dataMunicipios = departamento.municipios;
  }

  captureMunicipio(value: string) {
    this.formRegister.controls["municipio"].setValue(value);
    this.municipio = value;
  }

  private getInfoCheck() {
    const infoCheckComercial = {
      tipoDocumentoTitular: this.utilitiesService.tipoDoc,
      numeroDocumentoTitular: this.user.documento,
      tipoDocumentoAutorizado: this.utilitiesService.tipoDoc,
      numeroDocumentoAutorizado: this.user.documento,
      autorizacionHabeas: true,
      autorizacionComercial: this.isComercialCheched,
      SMS: this.isComercialCheched,
      correo: this.isComercialCheched,
      llamada: this.isComercialCheched,
      whatsApp: this.isComercialCheched,
      transaccionId: this.utilitiesService.transaccionId.toString(),
    };

    return infoCheckComercial;
  }

  infoCheckComercial() {
    this.authenticationService
      .getGenericToken()
      .pipe(first())
      .subscribe((responseTING: Token) => {
        if (responseTING.token) {
          this.validationService
            .postInfoCheckComercial(responseTING.token, this.getInfoCheck())
            .subscribe((response: any) => {
              if (response) {
                console.log(
                  "Respuesta de la autorización comercial:",
                  response
                );
              } else {
                console.error("Error al enviar la autorización comercial");
              }
            });
        }
      });
  }

  onCheckboxChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.formRegister.get("checkComercial")?.setValue(checked);
    console.log(
      "Estado de checkComercial:",
      this.formRegister.get("checkComercial")?.value
    );
  }

}