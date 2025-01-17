import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ReactiveFormsModule, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from "@angular/forms";
import { AuthenticationService } from '../../services/authentication.service';
import { UtilitiesService } from '../../services/utilities.service';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../../interfaces/user.interface';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
declare var $;

@Component({
  selector: 'app-card-forgot-password',
  templateUrl: './card-forgot-password.component.html',
  styleUrls: ['./card-forgot-password.component.css'],
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule]
})
export class CardForgotPasswordComponent implements OnInit {

  formForgotPassword: UntypedFormGroup;
  @Output() formForgotPasswordEmitter: EventEmitter<UntypedFormGroup> = new EventEmitter();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private autheticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.formForgotPasswordEmitter.emit(this.formForgotPassword);
  }

  createForm() {
    this.formForgotPassword = this.formBuilder.group({
      document: ['', [
        Validators.required,
        Validators.min(99999),
        Validators.max(999999999999999),
        Validators.pattern("^[0-9]+")
      ]],
    });
  }

  get f() {
    return this.formForgotPassword.controls;
  }

  get getDocument() {
    return this.formForgotPassword.get('document').invalid && this.formForgotPassword.get('document').touched;
  }

  forgotPassword() {
    if (this.formForgotPassword.invalid) {
      Object.values(this.f)
        .forEach(control => {
          control.markAllAsTouched();
        });
    }
    else {
      let document = this.f.document.value;
      // console.log(document);

      if (document !== '') {
        this.utilitiesService.loading = true;
        let bodyPassword = this.generateRememberPassword(document);

        this.autheticationService.consultUserInformationINCONFA(document)
          .pipe(first())
          .subscribe((response: User) => {
            this.utilitiesService.recoveryEmail = response.correo;
          });

        this.autheticationService.rememberPasswordDocumentUser(bodyPassword)
          .pipe(first())
          .subscribe(response => {
            if (response === '') {
              this.utilitiesService.messageTitleModal = 'Recuperación exitosa';
              this.utilitiesService.messageModal = 'Buen trabajo, se han enviado los datos de recuperación al correo electrónico, si no ves el correo en tu bandeja principal por favor revisa tu carpeta de SPAM, Gracias!.';
              this.utilitiesService.backLogin = false;

              $('.btn-close-popup-login').click();
              setTimeout(() => {
                this.utilitiesService.loading = false;
                $('.modalNuevoSuccess').click();
              }, 1000);
            }
            else {
              this.utilitiesService.messageTitleModal = 'Usuario no encontrado';
              this.utilitiesService.messageModal = response + '.';
              this.utilitiesService.backLogin = false;
              // console.log("Recuperación de contraseña invalido:", response);

              setTimeout(() => {
                this.utilitiesService.loading = false;
                $('.modalNuevoError').click();
              }, 1000);
            }
          });
      }

      this.formForgotPassword.reset({
        document: ''
      });

    }
  }

  generateRememberPassword(document: string) {
    // let path = this.activatedRoute.snapshot.routeConfig.path;
    let url = `${ environment.apiUrl }` + 'recover';

    let bodyPassword = {
      "documento": document.toString(),
      "sistema": 'Mi perfil',
      "linkMensaje": url,
      "parametro": 'e541f24f0b06368c9cfb418174699da5',
      "remitente": 'Mi perfil',
      "asunto": 'Recuperación de contraseña',
    }
    return bodyPassword;
  }

}
