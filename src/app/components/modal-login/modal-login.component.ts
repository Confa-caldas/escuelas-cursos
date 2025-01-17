import { Component, OnInit } from '@angular/core';

import { ReactiveFormsModule,UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.css'],
  standalone: true,
  imports:[ReactiveFormsModule]
})
export class ModalLoginComponent implements OnInit {

  formLoginEmitter: UntypedFormGroup;
  formForgotPasswordEmitter: UntypedFormGroup;
  formValidateEmitter: UntypedFormGroup;

  constructor() { }

  ngOnInit() {
  }

  processFormLogin(formLogin: UntypedFormGroup) {
    this.formLoginEmitter = formLogin;
    formLogin.reset({
      document: '',
      password: ''
    });
  }

  processFormForgotPassword(formForgotPassword: UntypedFormGroup) {
    this.formForgotPasswordEmitter = formForgotPassword;
    formForgotPassword.reset({
      document: ''
    });
  }

  processFormValidate(formValidate: UntypedFormGroup) {
    this.formValidateEmitter = formValidate;
    formValidate.reset({
      document: ''
    });
  }

  cleanForm() {
    this.processFormLogin(this.formLoginEmitter);
    this.processFormForgotPassword(this.formForgotPasswordEmitter);
    this.processFormValidate(this.formValidateEmitter);
  }

}
