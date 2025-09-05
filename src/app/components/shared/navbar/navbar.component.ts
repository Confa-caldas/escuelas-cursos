import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { ValidationService } from "src/app/services/validation.service";
import { UtilitiesService } from '../../../services/utilities.service';
import { environment } from 'src/environments/environment';

declare var $;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class NavbarComponent implements OnInit {

  public environment = environment;
  public tieneCamara: boolean = false;
  public isCollapsed = false;
 
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public utilitiesService: UtilitiesService,
    private activatedRoute: ActivatedRoute,
    private validationService: ValidationService
  ) { 
    }

  async ngOnInit() {
    this.tieneCamara = await this.validationService.hasWebcam();
  }

 logout() {
    this.utilitiesService.loading = true;
    this.utilitiesService.messageLoading = null;
    this.utilitiesService.mostrarModalSugerencia = true;
    setTimeout(() => {
      this.authenticationService.logout();
      this.utilitiesService.currentUser = null;
      this.utilitiesService.nasfaUser = null;
      this.router.navigate(["/login"]);
      this.utilitiesService.loading = false;
      this.utilitiesService.actualizarEstadoFacialIC = false;
      this.utilitiesService.botnesEstadoFacial = false;
      this.utilitiesService.otrosIngresos = false;
    }, 500);
  }

  activarFacial() {
    this.utilitiesService.loading = true;
    if (this.tieneCamara) {
      this.utilitiesService.loading = false;
      this.utilitiesService.desdelogin = true;
      this.utilitiesService.showWebcam = true;
      $(".btn-camara-validacion").click();
    } else {
      this.utilitiesService.loading = false;
      this.utilitiesService.messageTitleModal = "¡Error!";
      this.utilitiesService.messageModal =
        "No se detectó cámara en el dispositivo";
      this.utilitiesService.backLogin = false;
      setTimeout(() => {
        $(".modalNuevoError").click();
      }, 500);
      setTimeout(() => {
        $(".btnLogin").click();
      }, 2000);
    }
  }

}
