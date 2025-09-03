import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UtilitiesService } from "../../services/utilities.service";
import { AuthenticationService } from "../../services/authentication.service";
import { DataServiciosCursos } from "../../services/data-cursos.service";
import { first } from "rxjs/operators";
import { TransactionStatus, TransactionPayzen } from "../../interfaces/cursos.interface";

import { CommonModule } from '@angular/common';

//Componentes
import { LoadingComponent } from "../shared/loading/loading.component"
import { CardInfoPayDuesComponent } from "../card-info-pay-dues/card-info-pay-dues.component"
import { CardPayDuesFormComponent } from "../card-pay-dues-form/card-pay-dues-form.component"
declare var $: any;

@Component({
  selector: "app-modal-pay",
  templateUrl: "./modal-pay.component.html",
  styleUrls: ["./modal-pay.component.css"],
  standalone: true,
  imports: [
    LoadingComponent,
    CardInfoPayDuesComponent,
    CardPayDuesFormComponent,
    CommonModule
  ]
})
export class ModalPayComponent implements OnInit {
  path: string;
  loading: boolean = false;
  parametro: string;
  ruta: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    private authenticationService: AuthenticationService,
    private dataServiciosCursos: DataServiciosCursos
  ) {
    this.captureParameters();
  }

  ngOnInit() {
  }



  captureParameters() {
    this.path = this.activatedRoute.snapshot.routeConfig?.path || null;

    // console.log("entro por capturar parametros  "+this.path)
    let confirmUser =
      this.activatedRoute.snapshot.queryParams[
      "34240997a16763c011134c570fcc149e"
      ];
    let changePassword =
      this.activatedRoute.snapshot.queryParams[
      "e541f24f0b06368c9cfb418174699da5"
      ];

    if (confirmUser || changePassword) {
      if (confirmUser) {
        this.router.navigate(["/login"], {
          queryParams: { "34240997a16763c011134c570fcc149e": confirmUser },
        });
      }
      if (changePassword) {
        this.router.navigate(["/login"], {
          queryParams: { e541f24f0b06368c9cfb418174699da5: changePassword },
        });
      }
    } else {
      this.verifyTransaction();
    }
  }

  verifyTransaction() {
    // Identifica si hay alguno de los tokens activos para permitirle acceso
    if (
      this.authenticationService.currentTokenValue ||
      this.authenticationService.genericTokenValue
    ) {
      // Captura parametros de créditos cuando regresa de pasarela
      //let productoId = this.activatedRoute.snapshot.queryParams["7dc7dc58cdcadaea"];

      if (this.ruta) {
        const key = this.ruta.split('=')[1]; // Extrae la clave antes del '='

        this.parametro = key
        //console.log('Clave extraída:', key);
      }

      let productoId = this.parametro;
      //console.log("productoId " + productoId)

      if (productoId) {
        this.loading = true;

        this.dataServiciosCursos
          .verifyTransaction(productoId)
          .pipe(first())
          .subscribe((response: TransactionPayzen) => {
            //console.log(response)
            this.utilitiesService.transactionPayzen = response;

            this.utilitiesService.setCodeTransactionStatus(
              response.paymentOrderStatusId
            );
            if (response.paymentOrderStatusId === "PAID") {
              this.loading = false;

              this.utilitiesService.messageTitleModal = "Transacción exitosa";
              this.utilitiesService.colorTransaction = "green";
              this.utilitiesService.backLogin = false;

              this.router.navigate(["/" + this.path], {
                queryParams: {
                  productoId: productoId,
                },
              });

              $(".btn-info-pay-dues").click();
            } /* else { */
            if (response.paymentOrderStatusId === "REFUSED") {

              this.loading = false;

              // this.utilitiesService.messageTitleModal = 'Transacción fallida';
              this.utilitiesService.messageTitleModal =
                "Transacción pendiente de pago";
              this.utilitiesService.messageModal =
                "Tu pago no fue finalizado satisfactoriamente, estamos a la espera de la aprobación de la entidad financiera.";
              this.utilitiesService.colorTransaction = "red";
              this.utilitiesService.backLogin = false;

              $(".modalNuevoError").click();
            }
          });
      }
    } else {
      // Elimina los parametros en la Url para enviar al path actual
      this.router.navigate(["/" + this.path]);
      //this.router.navigate(["/home"]);
    }
  }
}
