import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { first } from "rxjs/operators";

//interfaces
import { Asistente, Transaction, TransactionPayzen, Pago, InitiateTransaction } from 'src/app/interfaces/cursos.interface'

//servicios
import { UtilitiesService } from "src/app/services/utilities.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DataServiciosCursos } from "src/app/services/data-cursos.service";

//Componentes
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { TopMenuComponentComponent } from '../../shared/top-menu-component/top-menu-component.component';

declare var $: any;
@Component({
  selector: 'app-resumen-compra',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    TopMenuComponentComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './resumen-compra.component.html',
  styleUrl: './resumen-compra.component.css'
})
export class ResumenCompraComponent {

  listaAsistentes: Asistente[] = [];
  // variables para confirmar el no pago de colaboradores
  documentNopyzen: string;
  identifierProductNopyzen: string;
  cantPersonas: number;
  precioAsignado: number;
  total: number;
  cursoSeleccionado: any;
  valorTotal: number;
  cuposDispo: boolean = false;
  horarios: any[] = [];

  constructor(
    public utilitiesService: UtilitiesService,
    public authenticationService: AuthenticationService,
    public dataServiciosCursos: DataServiciosCursos,

    private router: Router
  ) {

  }

  ngOnInit() {
 
    this.listaAsistentes = this.utilitiesService.listadoAsistentes;
    this.cantPersonas = this.listaAsistentes.length;
    this.cargarInfoCurso()
    this.total = this.calcularPrecio()
  }

  isMenuVisible(): boolean {
    const routesWithMenu = ['/home', '/cursos', '/asistente', '/resumen'];
    return routesWithMenu.includes(this.router.url);
  }

  cuposDisonibles() {
    const programacionId = this.cursoSeleccionado.programacion.programacionId
    this.utilitiesService.programacionId = this.cursoSeleccionado.programacion.programacionId

    this.dataServiciosCursos.getCurposDispo(programacionId).pipe(first())
      .subscribe((response: any) => {
        console.log(response,this.cantPersonas)
        const cantCupos = response;

        if (cantCupos == 0) {
          this.cuposDispo = false
          this.utilitiesService.messageTitleModal = 'No puedes continuar';
          this.utilitiesService.messageModal = 'Este curso no tiene cupos disponible';
         $(".modalNuevowarning").click();
          setTimeout(() => {
            this.utilitiesService.loading = false;
            this.router.navigate(["/cursos"]);
          }, 3000);

        } else if (cantCupos < this.cantPersonas) {
          this.cuposDispo = false

          this.utilitiesService.messageTitleModal = 'No puedes continuar';
          this.utilitiesService.messageModal = 'No hay suficiente cupos disponibles para este curso, debes eliminar asistes de la lista o seleccionar otro curso';

          setTimeout(() => {
            this.utilitiesService.loading = false;
           $(".modalNuevowarning").click();
          }, 500);
        } else {
          this.cuposDispo = true
        }
      },
        error => {
          console.error('Error al consultar los cursos:', error);
        });
  }

  cargarInfoCurso() {
    if (!this.utilitiesService.actividadCurso) {
      this.router.navigate(["/home"]);
      return; // Detenemos la ejecución si no hay actividad
    }
    this.horarios =this.utilitiesService.horarioCurso;

    console.log(this.utilitiesService.curso,this.horarios)
    this.cursoSeleccionado = this.utilitiesService.curso

    console.log(this.listaAsistentes)

    this.cuposDisonibles();
  }

  atras() {
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.utilitiesService.loading = false;
      this.router.navigate(["/asistente"]);
    }, 500);
  }

  navigate() {
    this.router.navigate(["/historico"]);
  }

  pago() {
    var hayMenor = false;
    var cont = 0;
    //this.utilitiesService.nombreMenores = [];
    for (var i = 0; i < this.listaAsistentes.length; i++) {
      const fn = this.listaAsistentes[i].fechaNacimiento;
      let anhos = this.dataServiciosCursos.calcularEdad(fn)
      if (Number(anhos) >= 14 && Number(anhos) < 18) {
        cont = cont + 1;
      }
      if (this.listaAsistentes.length == 1 && anhos < 18 && anhos > 14) {
        cont = cont - 1;
      }

    }
    this.utilitiesService.loading = true;

    if (this.listaAsistentes.length != 0) {
      if (this.listaAsistentes.length == cont) {
        let pago: Pago = {
          vapago: true,
          esmenor: true,
          nombreres: "",
          documentores: "",
        };
        localStorage.setItem("pago", JSON.stringify(pago));
      } else {
        let pago: Pago = {
          vapago: true,
          esmenor: false,
          nombreres: "",
          documentores: "",
        };
        localStorage.setItem("pago", JSON.stringify(pago));
        $(".btn_reset").click();
      }

      if (hayMenor) {
        $(".btn_reset").click();
        setTimeout(() => {
          this.utilitiesService.loading = false;
          $(".btn-modal-polices-menor").click();
        }, 1000);
      } else {
        $(".btn_reset").click();
        setTimeout(() => {
          this.utilitiesService.loading = false;
          $(".btn-modal-polices").click();
        }, 1000);
      }
    } else {
      this.utilitiesService.messageTitleModal = "Recuerda";
      this.utilitiesService.messageModal =
        "Debes agregar asistentes al curso seleccionado";

      setTimeout(() => {
        this.utilitiesService.loading = false;
       $(".modalNuevowarning").click();
      }, 1000);
    }

  }

  eliminarAsistente(indice: number) {
    this.utilitiesService.loading = true;

    if (indice > -1 && indice < this.listaAsistentes.length) {
      this.listaAsistentes.splice(indice, 1); // Elimina un elemento en la posición 'indice'
      this.cantPersonas = this.listaAsistentes.length; //se actualiza la cantidad de personas
    }

    if (this.listaAsistentes.length == 0) {
      this.utilitiesService.loading = false;
      this.utilitiesService.messageTitleModal = "Asistentes"
      this.utilitiesService.messageModal = 'La lista de asistentes se encuentra vacia'
      this.utilitiesService.backLogin = false;
     $(".modalNuevowarning").click();
      setTimeout(() => {
        $(".btn-close").click();
        this.router.navigate(["/home"]);
      }, 1200);

    } else {
      this.utilitiesService.loading = false;
      this.total = this.calcularPrecio()
    }
  }

  calcularPrecio(): number {
    const cantAsist = this.listaAsistentes.length;

    if (cantAsist === 0) {
      console.log('No hay asistentes en la lista.');
      return 0; // Retorna 0 si no hay asistentes
    }

    const valorTotal = this.listaAsistentes.reduce((total, asistente) => total + asistente.valorPagoCurso, 0);
    console.log(valorTotal)

    console.log(`El valor total para ${cantAsist} asistentes es: ${valorTotal}`);
    return valorTotal; // Retorna el valor total calculado
  }

  reserve() {
    //valida de nuevo los cupos disponibles
    this.cuposDisonibles()

    if (this.cuposDispo == true) {
      this.utilitiesService.loading = true;
      let bodyInfoDues = this.getBodyInfoDues();

      this.dataServiciosCursos
        .iniciartipoTransaccion(bodyInfoDues)
        .subscribe((response: Transaction) => {
          console.log(response)
          this.utilitiesService.loading = false;
          console.log(response.paymentOrderStatus)

          if (response.paymentOrderStatus === "RUNNING") {

            this.utilitiesService.urlRedireccionPayzen = response.paymentUrl;
            this.utilitiesService.paymentOrderId = response.paymentOrderId;

            this.utilitiesService.messageTitleModal = "Vas a realizar tu pago";
            this.utilitiesService.messageModal =
              "Serás direccionado a nuestro módulo de pago. Antes de confirmar tu pago, revisa que el listado de asistentes esté completo y correcto, al finalizar el proceso asegúrate de dar clic en el botón salida segura. ";
            this.utilitiesService.backLogin = false;

            //$(".btn-close-form-pay-dues").click();
            setTimeout(() => {
              this.utilitiesService.loading = false;
              //$(".btn-modal-success-payu").click();
              $(".modalNuevoSuccessPayu").click();
            }, 1000);

            //por aca entra cuando no hay pago por pyzen
          } else if (response.paymentOrderStatus == "SIN-PAGO") {
            this.utilitiesService.messageTitleModal =
              "Vas a confirmar tu entrada a pasadía";
            this.utilitiesService.messageModal =
              "Da clic en regresar si deseas modificar la información ingresada, en caso contrario haces clic en validar para confirmar tu compra como colaborador.";
            this.utilitiesService.backLogin = false;

            $(".btn-close-form-pay-dues").click();
            setTimeout(() => {
              this.utilitiesService.loading = false;
              //$(".btn-modal-success-payu").click();
              $(".modalNuevoSuccessPayu").click();
            }, 1000);

            this.utilitiesService.documentNopyzen = response.message;
            this.utilitiesService.identifierProductNopyzen = response.paymentUrl;
            this.documentNopyzen = response.message;
            this.identifierProductNopyzen = response.paymentUrl;
          } else {
            this.utilitiesService.messageTitleModal =
              "Error al iniciar la transacción.";
            this.utilitiesService.messageModal = response.message;
            this.utilitiesService.backLogin = false;

            $(".btn-close-form-pay-dues").click();
            setTimeout(() => {
              this.utilitiesService.loading = false;
              $(".modalNuevoError").click();
            }, 1000);
            setTimeout(() => {
              //this.cancel();
            }, 2500);
          }
        });
    }
  }

  finaliceNoPyzen(document, productId) {
    // console.log("vamos biennnn "+ document+"--"+productId);
    let body = {
      documento: document,
      identificadorProducto: productId,
    };

    this.utilitiesService.loading = true;
    this.authenticationService
      .verifyTransactionNoPyzen(body)
      .subscribe((response: TransactionPayzen) => {
        this.utilitiesService.transactionPayzen = response;
        this.utilitiesService.transactionPayzen.documento = document;

        this.utilitiesService.loading = false;
        console.log(
          "llego de la confirmación exitosa, email: " +
          this.utilitiesService.transactionPayzen.email
        );
        this.utilitiesService.messageTitleModal = "Ya tienes tus entradas";
        // this.utilitiesService.colorTransaction = "green";
        this.utilitiesService.messageTitleModal = "Confirmación exitosa";
        this.utilitiesService.colorTransaction = "green";
        this.utilitiesService.backLogin = false;
        $(".btn-info-pay-dues").click();
        // this.router.navigate(["/inicio"]);

        $(".btn-close-form-pay-dues").click(function (event) {
          location.reload();
        });
      });
  }

  private getBodyInfoDues() {
    console.log(this.utilitiesService.currentUser)
    var haymenor = false;
    for (var i = 0; i < this.listaAsistentes.length; i++) {
      /* if (this.listaAsistentes[i].esMenor18) {
        haymenor = true;
      } */
    }
    var docres, nombreres;

    let user: Pago = JSON.parse(localStorage.getItem("pago"));
    if (user.esmenor == true) {
      docres = user.documentores;
      nombreres = user.nombreres;
    } else {
      docres = "";
      nombreres = "";
    }
    let body: InitiateTransaction = {
      documento: this.utilitiesService.documentUser || this.utilitiesService.currentUser.documento,
      tipoDocumento:this.utilitiesService.currentUser.tipoDocumento || "C",
      sedeId: this.cursoSeleccionado.sede.sedeId, //9
      cursoId: this.cursoSeleccionado.id, //
      programacionId: this.cursoSeleccionado.programacion.programacionId,
      valorPago: this.total,
      urlRetorno: environment.apiUrl + "home", //cambiar url
      nombreCompleto: this.utilitiesService.fullNameUser || this.utilitiesService.currentUser.nombreBeneficiario || "",
      direccionResidencia:  this.utilitiesService.currentUser.direccion || this.utilitiesService.direccionResidencia || "cll",
      celular: this.utilitiesService.currentUser.celular || this.utilitiesService.celular || "",
      genero:  this.utilitiesService.currentUser.sexo ||this.utilitiesService.genero || "",
      fechaNacimiento: this.utilitiesService.currentUser.fechaNacimiento || this.utilitiesService.fechaNaciemintoResponsable || "",
      emailConfirmacion: this.utilitiesService.currentUser.correo || "",
      aceptaPoliticaServicio: true,
      aceptaPoliticaTratamientoDatos: true,
      aceptaAutorizacionMenores: true,
      documentoResponsable: docres || "",
      nombreResponsable: nombreres || "",
      asistentes: this.listaAsistentes,
      haymenor18: haymenor, //NO
      nombreDatafono: ""
    };
    console.log(body);
    return body;
  }
  cancel() {
    window.location.reload();
  }

}
