import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { UtilitiesService } from "../../services/utilities.service";
import { ActivatedRoute, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { User } from "../../interfaces/user.interface";
import { ValidatorsService } from "../../services/validators.service";
import { CookieService } from "ngx-cookie-service";
import * as CryptoJS from "crypto-js";
import * as Md5 from "crypto-js/md5";
import { CommonModule } from '@angular/common';
declare var $;

@Component({
  selector: "app-card-change-password",
  templateUrl: "./card-change-password.component.html",
  styleUrls: ["./card-change-password.component.css"],
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule]
})
export class CardChangePasswordComponent implements OnInit {
  formChangePassword: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private validatorsService: ValidatorsService,
    public activatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.showChangePassword();
  }

  createForm() {
    this.formChangePassword = this.formBuilder.group(
      {
        password: [
          "",
          [Validators.required, Validators.minLength(6), this.validarPassword],
        ],
        confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: this.validatorsService.passwordsEquals(
          "password",
          "confirmPassword"
        ),
      }
    );
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
    return this.formChangePassword.controls;
  }

  get getPassword() {
    return (
      this.formChangePassword.get("password").invalid &&
      this.formChangePassword.get("password").touched
    );
  }

  get getConfirmPassword() {
    const password1 = this.formChangePassword.get("password").value;
    const password2 = this.formChangePassword.get("confirmPassword").value;
    return password1 === password2 ? false : true;
  }

  changePassword() {
    // console.log("password", this.f.password.value.toString());
    // console.log("confirmPassword", this.f.confirmPassword.value.toString());

    if (this.formChangePassword.invalid) {
      Object.values(this.f).forEach((control) => {
        control.markAllAsTouched();
      });
      return;
    } else {
      this.utilitiesService.loading = true;
      if (this.f.password.value === this.f.confirmPassword.value) {
        let newPassword = this.encriptar(this.f.password.value);

        let changePassword =
          this.activatedRoute.snapshot.queryParams[
            "e541f24f0b06368c9cfb418174699da5"
          ];
        if (changePassword) {
          this.authenticationService
            .changePasswordNewUser(changePassword, newPassword)
            .pipe(first())
            .subscribe((response: User) => {
              if (response) {
                // console.log("Cambio de contraseña éxitoso");
                this.utilitiesService.messageTitleModal = "Cambio exitoso";
                this.utilitiesService.messageModal =
                  "Su contraseña ha cambiado con éxito.";
                this.utilitiesService.backLogin = true;

                $(".btn-close-popup-change-password").click();
                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $(".modalNuevoSuccess").click();
                }, 1000);
              } else {
                // console.log("Cambio de contraseña fallido");
                this.utilitiesService.messageTitleModal =
                  "Cambio de contraseña fallido";
                this.utilitiesService.messageModal =
                  "Su cambio de contraseña ha fallado.";
                this.utilitiesService.backLogin = false;

                $(".btn-close-popup-change-password").click();
                setTimeout(() => {
                  this.utilitiesService.loading = false;
                  $("modalNuevoError").click();
                }, 1000);
              }
            });
        } else {
          this.utilitiesService.messageTitleModal =
            "El cambio de contraseña ha fallado";
          this.utilitiesService.messageModal =
            "Las contraseñas no pudo ser cambiada.";
          this.utilitiesService.backLogin = false;

          setTimeout(() => {
            this.utilitiesService.loading = false;
            $(".modalNuevoError").click();
          }, 1000);
        }
      } else {
        // console.log("Contraseñas no coinciden");
        this.utilitiesService.messageTitleModal =
          "El cambio de contraseña ha fallado";
        this.utilitiesService.messageModal = "Las contraseñas no coinciden.";
        this.utilitiesService.backLogin = false;

        setTimeout(() => {
          this.utilitiesService.loading = false;
          $(".modalNuevoError").click();
        }, 1000);
      }

      this.formChangePassword.reset({
        password: "",
        confirmPassword: "",
      });
    }
  }

  showChangePassword() {
    let changePassword =
      this.activatedRoute.snapshot.queryParams[
        "e541f24f0b06368c9cfb418174699da5"
      ];
    if (changePassword) {
      this.cookieService.delete("gtoken");
      this.router.navigate(["/login"], {
        queryParams: { e541f24f0b06368c9cfb418174699da5: changePassword },
      });
      $(".btn-change-password").click();
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
}
