import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { PreguntasUser, Token, User } from 'src/app/interfaces/user.interface';
import { AttentionService } from 'src/app/services/attention.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { QuestionsService } from 'src/app/services/questions.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

import {HeaderComponent} from '../../shared/header/header.component';
import {FooterComponent} from '../../shared/footer/footer.component';

declare var $;
@Component({
  selector: 'app-confirm-registro-services',
  templateUrl: './confirm-registro-services.component.html',
  styleUrls: ['./confirm-registro-services.component.css'],
  standalone: true,
  imports:[
    FooterComponent,
    HeaderComponent
  ]
})
export class ConfirmRegistroServicesComponent implements OnInit {

  user: User;
  respuesta: Boolean=false;
  token:Token;
  preguntas:PreguntasUser;

  constructor(
    public attentionService: AttentionService,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,  
    public questionsService: QuestionsService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.confirmUser();
  }

  ngOnInit(): void {
  }

  confirmUser() {
    let confirmUser = this.activatedRoute.snapshot.queryParams['34240997a16763c011134c570fcc149e'];
    if (confirmUser) {
      this.utilitiesService.loading = true;
      this.authenticationService.confirmUserRegistrationConfa(confirmUser)
        .pipe(first())
        .subscribe((response: User) => {
          if (response.documento !== '') {
            // console.log(response);
            this.utilitiesService.messageTitleModal = 'Registro exitoso'
            this.utilitiesService.messageModal = 'Confirmación de registro exitoso.';
            /* this.utilitiesService.backLogin = true; */

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-success-confirm").click();
            }, 1000);
          }
          else {
            this.utilitiesService.messageTitleModal = 'Registro fallido'
            this.utilitiesService.messageModal = 'La confirmación de registro no fue exitosa o ya ha sido confirmada.';
           /*  this.utilitiesService.backLogin = false; */

            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".btn-modal-error-confirm").click();
            }, 1000);
          }
        });
    }
  }

}
