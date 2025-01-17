import { Component, OnInit } from "@angular/core";
import { User, UserOrCompany } from "src/app/interfaces/user.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilitiesService } from "src/app/services/utilities.service";
import { AuthenticationService } from "../../services/authentication.service";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/header/header.component'
import { FooterComponent } from '../shared/footer/footer.component'
import { DataServiciosCursos } from 'src/app/services/data-cursos.service'
import { first } from 'rxjs/operators';
import * as moment from 'moment';
declare var $;

@Component({
  selector: "app-historico-pagos",
  templateUrl: "./historico-pagos.component.html",
  styleUrls: ["./historico-pagos.component.css"],
  standalone:true,
  imports:[
    CommonModule,
    HeaderComponent,
    FooterComponent
  ]
})
export class HistoricoPagosComponent implements OnInit {
  mostrarDetalles = false;
  listaTransferencias = [];
  productoId: string;
  usuario: User;
  banco: string;
  celular: string;
  correo: string;
  direccion: string;
  documento: string;
  estado: string;
  estadoMensaje: string;
  fechaHoraTransaccion: string;
  identificadorReserva: string;
  CUS: string;
  titular: string;
  valor: string;
  sinPagos = false;
  nombre: string;
  doc: number;
  title: string;
  elementType: string;
  value: string;
  qr: boolean = false;
  hp: boolean = true;
  detallesSeleccionados: any = null;


  constructor(
    private activatedRoute: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private dataServiciosCursos: DataServiciosCursos
  ) {
  }

  ngOnInit() {
    this.historialPagos();
  }

  atras(){
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.utilitiesService.loading = false;
      this.utilitiesService.changePass = false;
      this.utilitiesService.updateInfo = false;
      this.utilitiesService.miPerfil = true;
      this.router.navigate(["/home"]);
    }, 500);
  }

  verDetalles(compras: any): void {
    this.detallesSeleccionados = compras;
  }

  historialPagos(){
    const documento = this.utilitiesService.documentUser;
    console.log(documento)

    this.dataServiciosCursos.getHistorialPagos(documento).pipe(first())
      .subscribe((response: any) => {
        console.log(response)
        if(response.pagos.length != 0){
          this.listaTransferencias = response.pagos;
          //cambia el valor de la hora para ser mostrada
        this.listaTransferencias.forEach(historico => {
          // Convertimos la hora de 24 horas a 12 horas con AM/PM
          historico.horaCreacion = moment(historico.horaCreacion, "HH:mm:ss").format("h:mm A");
      });
        }
        else{
          this.utilitiesService.messageTitleModal = "Atención"
              this.utilitiesService.messageModal = 'No existen registros.'
              this.utilitiesService.backLogin = false;
              $(".modalNuevowarning").click();
              setTimeout(() => {
                this.utilitiesService.loading = false;
                this.router.navigate(["/home"]);
              }, 1000);
        }

        
        
      },
      error => {
        console.error('Error al consultar El historial de pagos:', error);
        this.utilitiesService.loading = false;
      }
    );
  }

}
