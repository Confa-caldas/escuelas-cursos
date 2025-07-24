import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { UtilitiesService } from "src/app/services/utilities.service";
import { CookieService } from "ngx-cookie-service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { first } from "rxjs/operators";
import { Token, GruposFamiliaresList, MiPerfilConfa, Questions, Session, User, userMiPerfil, Usuario, selecPersona } from "src/app/interfaces/user.interface";
import { Router } from "@angular/router";
import { ReactiveFormsModule, FormsModule, FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { QuestionsService } from "src/app/services/questions.service";
import { environment } from "src/environments/environment";

import { Md5 } from "ts-md5";
import { GrupoFamiliar } from "../../../interfaces/user.interface";
import { CommonModule } from "@angular/common";

//servicio
import { DataServiciosCursos } from 'src/app/services/data-cursos.service'

//interfaces
import { Asistente } from 'src/app/interfaces/cursos.interface'

//Componentes
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { TopMenuComponentComponent } from '../../shared/top-menu-component/top-menu-component.component'

declare var $;

@Component({
  selector: 'app-seleccion-asistentes',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TopMenuComponentComponent
  ],
  templateUrl: './seleccion-asistentes.component.html',
  styleUrl: './seleccion-asistentes.component.css'
})
export class SeleccionAsistentesComponent implements OnInit {

  @ViewChild('tipoDocumentoRef') tipoDocumentoRef!: ElementRef;

  public environment = environment;
  textNucleoFamiliar: string = "";
  certificadosgrupo: boolean = true;

  //Variables de usuario
  login: boolean = false;
  user: Usuario;
  userMiPerfil: MiPerfilConfa;
  persona1: selecPersona;
  usuario: User;
  fullName: string = "";
  document: string;
  documento: string;
  userCategoria: string;

  /* Informacion de el otro asistente */
  tipoDocOtroAsistente: string = "";
  documentoOtroAsistente: number | null = null;
  categoriaOtroAsistente: string = "";
  nombreOtroAsistente: string = "";
  nombresAsistenteAdd: string = "";
  apellidosAsistenteAdd: string = "";
  fechaNacOtroAsistente: string = "";
  tipoAfiliacionOtroAsistente: string = "";
  generoAsistenteAdd
  correoOtroAssistente: string = "";
  tipoUsuarioAdd: string = "";
  catgoriaMenor: string = "";

  /* VALIDACIONES */
  cardeRegistro = false;
  resumen: boolean = false;
  estadoEstadoInscrito: boolean = null;


  /* INHABILITAR */
  InhabilitarBtn: boolean = false;
  InhabilitarBtnContinuar: boolean = true;
  habilitarFondo: boolean = false;
  InhabilitarBtnAddOtroasistente: boolean = false;
  InhabilitarInputDate: boolean = false;

  /* LISTAS */
  nucleoFamiliar: any[] = [];
  asistentes: Asistente[] = [];
  tarifas: any[] = [];
  horarios: any[] = [];

  resultadoGF: any[] = [];

  /* INFORMACION DEL CURSO */
  cursoSeleccionado: any;
  sedeId: number | null = null;
  programacionId: number | null = null;
  valorTarifa: number | null = null;
  existeUsuario: boolean = null;
  existeUsuarioAdi: boolean = true;

  mayorEdad: boolean = null;
  menorEdad: boolean = null;
  valorPagoCursoAsistenteAdd: number | null = null;


  constructor(
    private autheticationService: AuthenticationService,
    private router: Router,
    public utilitiesService: UtilitiesService,
    public questionsService: QuestionsService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private dataServiciosCursos: DataServiciosCursos
  ) { }

  ngOnInit() {
    let ptoken =
      this.cookieService.get("ptoken") !== ""
        ? JSON.parse(this.cookieService.get("ptoken"))
        : "";
    let user =
      localStorage.getItem("user") !== ""
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    let cc =
      localStorage.getItem("cc") !== ""
        ? JSON.parse(localStorage.getItem("cc"))
        : null;
    if (ptoken != "") {
      this.authenticationService
        .loginNew(ptoken.token)
        .pipe(first())
        .subscribe((response: Session) => {
          console.log(response.usuario)
          if (response.usuario.existeUsuario) {
            localStorage.setItem("user", JSON.stringify(response));
            localStorage.setItem("cc", response.usuario.documento);
            this.document = response.usuario.documento;
            //console.log(this.document)
            this.utilitiesService.loading = false;
          }else{
            location.reload();
          }
        });
    }

    this.horarios = this.utilitiesService.horarioCurso;

    if (this.utilitiesService.actividadCurso == '' || this.utilitiesService.actividadCurso == undefined) {
      this.router.navigate(["/cursos"]);
      return; // Detenemos la ejecución si no hay actividad
    }
    this.cargarInfoCurso()
    this.obtenerPrecio()
  }

  cargarInfoCurso() {

    //console.log(this.utilitiesService.curso)
    this.cursoSeleccionado = this.utilitiesService.curso

    this.utilitiesService.horarioCurso = this.cursoSeleccionado.horario.horaInicio


    this.sedeId = this.cursoSeleccionado.sede.sedeId
    this.programacionId = this.cursoSeleccionado.programacion.programacionId
    this.cuposDisonibles();

  }

  //metodo que rastrea los cambios de la seleccion del input select tipo de documento otro asistente
  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value; // Obtiene el valor seleccionado

    this.tipoDocOtroAsistente = selectedValue;

    ////console.log('Valor seleccionado desde el evento:', selectedValue);
  }

  navigate() {
    this.router.navigate(["/historico"]);
  }

  cuposDisonibles() {

    const programacionId = this.cursoSeleccionado.programacion.programacionId
    //console.log(programacionId,'programacionId')

    this.dataServiciosCursos.getCurposDispo(programacionId).pipe(first())
      .subscribe((response: any) => {
        ////console.log(response)
        const cantCupos = response.cuposDisponibles;

        if (cantCupos == 0) {
          this.utilitiesService.messageTitleModal = 'No puedes continuar';
          this.utilitiesService.messageModal = 'Este curso no tiene cupos disponible';
          $(".modalNuevowarning").click();
          setTimeout(() => {
            this.utilitiesService.loading = false;
            this.router.navigate(["/cursos"]);
          }, 3000);
        } else if (cantCupos == 1) {
          this.utilitiesService.messageTitleModal = 'Atención';
          this.utilitiesService.messageModal = 'Este curso solo cuenta con 1 cupo disponible';
          setTimeout(() => {
            $(".modalNuevowarning").click();
          }, 500);
          //this.consultarInformacionMiPerfilConfa(this.document);
          this.informacionUsuarioGrupoFamiliar()

        } else {
          //this.consultarInformacionMiPerfilConfa(this.document);
          this.informacionUsuarioGrupoFamiliar()
        }
      },
        error => {
          console.error('Error al consultar los cursos:', error);
        });
  }

  atras() {
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.utilitiesService.loading = false;
      this.router.navigate(["/cursos"]);
    }, 500);
  }

  /*   traerGrupoFamiliar(documento: string) {
      this.dataServiciosCursos.consultarGrupoFamiliar(documento)
        .pipe(first())
        .subscribe((response: any) => {
          //console.log(response)
  
          const grupoFam = response.resultado;
  
          //console.log(grupoFam)
  
          for (let index = 0; index < grupoFam.length; index++) {
            const doc = grupoFam[index].identificacion;
            //console.log(doc)
            let catBen = grupoFam[index].categoria;
  
            //obtener edad
            const edad = this.obtenerEdad(grupoFam[index].fechaNac)
  
            //validacion de edad 
            if (
              Number(edad) >= Number(this.utilitiesService.edadMin) &&
              Number(edad) <= Number(this.utilitiesService.edadMax)
            ) {
              if (Number(edad) > 18) {
                this.mayorEdad = true;
                this.menorEdad = false;
                //catBen = resultadoUnico[0].categoria;
                //catBen = 'C'
              } else {
                this.mayorEdad = false;
                this.menorEdad = true;
                //catBen = resultadoUnico[0].categoria;
              }
  
              // Buscar la tarifa correspondiente
              const tarifaBeneficiario = this.tarifas.find(tarifa => tarifa[0] === catBen);
  
              this.yaEstaIncrito(this.programacionId, doc);
              setTimeout(() => {
                if (this.estadoEstadoInscrito == false) {
                  this.nucleoFamiliar.push({
                    nombreCompleto: grupoFam[index].nombre,
                    documento: grupoFam[index].identificacion || '',
                    tipoDocumento: grupoFam[index].tipo_id || '',
                    direccionResidencia: grupoFam[index].direccion || '',
                    celular: Number(grupoFam[index].celular) || 0,
                    email: grupoFam[index].email || '',
                    categoria: catBen,
                    municipioId: 1,
                    mayor19Anios: this.mayorEdad,
                    esMenor18: this.menorEdad,
                    tipoAfiliacion: grupoFam[index].tipoAfiliacion,
                    genero: grupoFam[index].sexo || '',
                    fechaNacimiento: grupoFam[index].fechaNac || '',
                    docAfiliado: documento,
                    esTrabajadorConfa: false,
                    valorPagoCurso: Number(tarifaBeneficiario[1]),
                    inhabilitado: false // Nueva propiedad para controlar el estado
                  });
                }
              }, 1000);
              //console.log(this.nucleoFamiliar)
            }
          }
  
  
  
          setTimeout(() => {
  
            this.utilitiesService.loading = false;
  
            ////console.log(this.nucleoFamiliar);
            // Validación de resultados
            if (this.nucleoFamiliar.length === 0) {
              this.utilitiesService.messageTitleModal = "Atención";
              this.utilitiesService.messageModal = 'Ningún integrante de tu grupo familiar está habilitado para el curso seleccionado o ya están inscritos';
              this.utilitiesService.backLogin = false;
              $(".modalNuevowarning").click();
            }
          }, 1000);
        });
    } */


  consultarInformacionCategoria(documento: string) {

    this.dataServiciosCursos.menorCategoria(documento).pipe(first())
      .subscribe((response: any) => {
        //console.log(response, 'info para categoria')
        const resultadoObjeto = JSON.parse(response.resultado);
        const categoria = resultadoObjeto.categoria;
        this.catgoriaMenor = categoria;

      });
  }

  /* BUSCA LA INFORMACION DE EL OTRO ASISTENTE ADICIONAL */
  ValidarOtroAsistente() {
    this.utilitiesService.loading = true;
    let documentoOtro = String(this.documentoOtroAsistente);
    //console.log(documentoOtro)

    const existeEnGrupoFamiliar = this.resultadoGF.some(
      (persona) => persona.documento === documentoOtro
    );

    if (existeEnGrupoFamiliar) {
      this.utilitiesService.messageTitleModal = "No puedes continuar"
      this.utilitiesService.messageModal = 'El documento ya pertenece al grupo familiar.'
      this.utilitiesService.backLogin = false;
      setTimeout(() => {
        1054884773
        $(".modalNuevowarning").click();
      }, 1000);
      this.tipoDocOtroAsistente = "";
      this.documentoOtroAsistente = null
      this.fechaNacOtroAsistente = "";
    } else if (documentoOtro == this.document) {
      this.utilitiesService.messageTitleModal = "No puedes continuar"
      this.utilitiesService.messageModal = 'El documento ya pertenece al grupo familiar.'
      this.utilitiesService.backLogin = false;
      setTimeout(() => {
        this.utilitiesService.loading = false;
        $(".modalNuevowarning").click();
      }, 1000);
      this.tipoDocOtroAsistente = "";
      this.documentoOtroAsistente = null
      this.fechaNacOtroAsistente = "";
    } else {


      //valida si el usuario ya se encuentra incrito en el curso seleccionado
      this.yaEstaIncrito(documentoOtro, this.programacionId);

      setTimeout(() => {

        if (!this.estadoEstadoInscrito) {
          //valida si esta genesys
          this.dataServiciosCursos.menorCategoria(documentoOtro).pipe(first())
            .subscribe((response: any) => {

              const resultadoObj = JSON.parse(response.resultado);

              if (response.estado === 'OK' && resultadoObj.persona_id != null && resultadoObj.persona_id !== '') {
                //if (response.estado == 'OK' && (resultadoObj.persona_id != null || resultadoObj.persona_id != undefined || resultadoObj.persona_id != '' || resultadoObj.persona_id != "")) {
                // set datos de genesys

                /* primero toma la edad y hace el calculo de si cumple con la edad para el curso */
                const edad = this.obtenerEdad(resultadoObj.fechaNac)
                //console.log(edad)
                if (Number(edad) >= Number(this.utilitiesService.edadMin) && Number(edad) <= Number(this.utilitiesService.edadMax)) {
                  this.existeUsuarioAdi = true;
                  this.InhabilitarBtnAddOtroasistente = true;
                  this.categoriaOtroAsistente = resultadoObj.categoria
                  //console.log(this.categoriaOtroAsistente)
                  this.tipoDocOtroAsistente = resultadoObj.tipo_id
                  this.fechaNacOtroAsistente = resultadoObj.fechaNac
                  this.nombreOtroAsistente = resultadoObj.nombre;
                  this.tipoAfiliacionOtroAsistente = resultadoObj.tipoAfiliacion || ''
                  this.correoOtroAssistente = resultadoObj.email || '';
                  this.generoAsistenteAdd = resultadoObj.sexo || 'M';
                  this.tipoUsuarioAdd = resultadoObj.tipoAfiliacion;
                  this.InhabilitarInputDate = true;

                } else {
                  this.utilitiesService.messageTitleModal = "Tu registro ha fallado"
                  this.utilitiesService.messageModal = 'No cumples con los requisitos de edad para este curso.'
                  this.utilitiesService.backLogin = false;
                  setTimeout(() => {
                    this.utilitiesService.loading = false;
                    $(".modalNuevowarning").click();
                  }, 1000);
                  this.tipoDocOtroAsistente = "";
                  this.documentoOtroAsistente = null
                  this.fechaNacOtroAsistente = "";
                }
              } else {
                //consulta en ingreso confa
                this.authenticationService.consultarInformacionMiPerfilConfa(documentoOtro).pipe(first())
                  .subscribe((response: any) => {
                    //console.log(response, 'Consulta info otro asistente')

                    if (response.existeUsuario) {
                      /* primero toma la edad y hace el calculo de si cumple con la edad para el curso */
                      const edad = this.obtenerEdad(response.fechaNacimiento)
                      ////console.log(edad)
                      if (Number(edad) >= Number(this.utilitiesService.edadMin) && Number(edad) <= Number(this.utilitiesService.edadMax)) {
                        this.existeUsuarioAdi = response.existeUsuario || true;
                        this.InhabilitarBtnAddOtroasistente = true;
                        this.categoriaOtroAsistente = response.categoria
                        this.tipoDocOtroAsistente = response.tipoDocumento
                        this.fechaNacOtroAsistente = response.fechaNacimiento
                        this.nombreOtroAsistente = `${response.primerNombre} ${response.segundoNombre} ${response.primerApellido} ${response.segundoApellido}`;
                        this.tipoAfiliacionOtroAsistente = response.tipoUsuario || ''
                        this.correoOtroAssistente = response.correo || '';
                        this.generoAsistenteAdd = response.genero || 'M';
                        this.tipoUsuarioAdd = response.tipoUsuario;
                        this.InhabilitarInputDate = true;

                      } else {
                        this.utilitiesService.messageTitleModal = "Tu registro ha fallado"
                        this.utilitiesService.messageModal = 'No cumples con los requisitos de edad para este curso.'
                        this.utilitiesService.backLogin = false;
                        setTimeout(() => {
                          this.utilitiesService.loading = false;
                          $(".modalNuevowarning").click();
                        }, 1000);
                        this.tipoDocOtroAsistente = "";
                        this.documentoOtroAsistente = null
                        this.fechaNacOtroAsistente = "";
                      }
                    } else {
                      this.existeUsuarioAdi = false;
                      this.utilitiesService.messageTitleModal = "No esta registrado!"
                      this.utilitiesService.messageModal = 'Este documento no se encuentra registrado, por favor ingresa los datos personales del asistente adicional.'
                      this.utilitiesService.backLogin = false;
                      $(".modalNuevowarning").click();
                      setTimeout(() => {
                        this.utilitiesService.loading = false;

                      }, 500);
                      //estado para mostrar el apartado de registro
                      this.cardeRegistro = true;
                      this.InhabilitarBtnAddOtroasistente = true;
                      this.InhabilitarInputDate = false;
                    }
                  });
              }
            })
        }
        this.utilitiesService.loading = false;
      }, 500);
    }
  }

  /* Corresponde al boton de agregar otro asistente */
  OtrosAsistentes() {

    let validoInsetar: boolean = true;

    //console.log(this.tipoDocOtroAsistente)

    const value = this.tipoDocumentoRef.nativeElement.value;
    //console.log(value)

    if (
      !this.tipoDocOtroAsistente ||
      this.tipoDocOtroAsistente.trim() === "" ||
      this.tipoDocOtroAsistente === null ||
      this.tipoDocOtroAsistente === undefined
    ) {
      this.utilitiesService.messageTitleModal = "Recuerda";
      this.utilitiesService.messageModal = 'Debes ingresar todos los datos solicitados, debes ingresar el tipo de documento';
      this.utilitiesService.backLogin = false;

      validoInsetar = false;

      setTimeout(() => {
        this.utilitiesService.loading = false;
        $(".modalNuevowarning").click();
      }, 200);
    }

    if (this.fechaNacOtroAsistente == '' || this.fechaNacOtroAsistente == null || this.fechaNacOtroAsistente == undefined) {

      this.utilitiesService.messageTitleModal = "Recuerda"
      this.utilitiesService.messageModal = 'Debes ingresar todos los datos solicitados, la fecha de nacimiento no puede ir vacia'
      this.utilitiesService.backLogin = false;
      validoInsetar = false;
      setTimeout(() => {
        this.utilitiesService.loading = false;
        $(".modalNuevowarning").click();
      }, 200);

    }

    if (!this.existeUsuarioAdi) {
      if (this.nombresAsistenteAdd == '' || this.nombresAsistenteAdd == null || this.nombresAsistenteAdd == undefined ||
        this.apellidosAsistenteAdd == '' || this.apellidosAsistenteAdd == null || this.apellidosAsistenteAdd == undefined) {
        this.utilitiesService.messageTitleModal = "Recuerda"
        this.utilitiesService.messageModal = 'Debes ingresar todos los datos solicitados'
        this.utilitiesService.backLogin = false;
        validoInsetar = false;

        setTimeout(() => {
          this.utilitiesService.loading = false;
          $(".modalNuevowarning").click();
        }, 200);
      }
    }

    /* primero toma la edad y hace el calculo de si cumple con la edad para el curso */
    const edad = this.obtenerEdad(this.fechaNacOtroAsistente)
    if (validoInsetar) {
      ////console.log(edad)
      if (Number(edad) >= Number(this.utilitiesService.edadMin) && Number(edad) <= Number(this.utilitiesService.edadMax)) {

        this.InhabilitarBtnAddOtroasistente = false;
        this.habilitarFondo = true;

        /*       if (this.tipoUsuarioAdd == 'B' && this.existeUsuario && edad > 18) {
                this.categoriaOtroAsistente = 'C'
              } */

        if (!this.existeUsuarioAdi) {
          this.categoriaOtroAsistente = 'D'
          this.tipoAfiliacionOtroAsistente = 'D'
        }


        if (edad > 18) {
          this.mayorEdad = true;
          this.menorEdad = false;
        } else {
          this.mayorEdad = false;
          this.menorEdad = true;
        }

        this.crearListaOtroAsistentes()
      } else {
        this.utilitiesService.messageTitleModal = "Tu registro ha fallado"
        this.utilitiesService.messageModal = 'No cumples con los requisitos de edad para este curso.'
        this.utilitiesService.backLogin = false;
        setTimeout(() => {
          this.utilitiesService.loading = false;
          $(".modalNuevowarning").click();
        }, 1000);
        this.tipoDocOtroAsistente = "";
        this.documentoOtroAsistente = null;
        this.fechaNacOtroAsistente = "";

      }

    }


  }

  validarEdadGrupoFamiliar(grupof: any) {
    this.utilitiesService.loading = true;
    const edad = this.obtenerEdad(grupof.fechaNacimiento);

    if (Number(edad) >= Number(this.utilitiesService.edadMin) && Number(edad) <= Number(this.utilitiesService.edadMax)) {
      this.crearListaAsistentes(grupof);
      setTimeout(() => {
        this.utilitiesService.loading = false;
        grupof.inhabilitado = true; // Deshabilitar solo este elemento
      }, 1000);
    } else {
      this.utilitiesService.messageTitleModal = "Tu registro ha fallado";
      this.utilitiesService.messageModal = 'No cumples con los requisitos de edad para este curso.';
      this.utilitiesService.backLogin = false;
      setTimeout(() => {
        this.utilitiesService.loading = false;
        $(".modalNuevowarning").click();
      }, 1000);
      grupof.inhabilitado = false; // Asegurar que no quede deshabilitado
    }
  }

  obtenerEdad(event: any) {
    const fechaNacimiento = event;
    ////console.log(fechaNacimiento)

    let anhos = this.dataServiciosCursos.calcularEdad(fechaNacimiento)
    ////console.log(anhos)
    return anhos
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

    return `${year}-01-01`;
  }

  crearListaAsistentes(as: any) {
    ////console.log(as)
    this.dataServiciosCursos.menorCategoria(as.documento).pipe(first())
      .subscribe((response: any) => {

        if (response.estado != 'OK') {
          //console.log('Error procesando la respuesta para menorCategoria:', response);
          this.asistentes.push(as);
          //console.log(as);
          this.InhabilitarBtnContinuar = false;
        } else {
          //console.log(response, 'info para categoria');
          const resultadoObjeto = JSON.parse(response.resultado);
          const categoria = resultadoObjeto.categoria;
          const tarifa = this.tarifas.find(tarifa => tarifa[0] === categoria);
          as.categoria = categoria;
          as.valorPagoCurso = Number(tarifa[1]);
          this.asistentes.push(as);
          //console.log(as);
          this.InhabilitarBtnContinuar = false;
        }
      });
  }

  /* Agregar el otro asistenta al array */
  crearListaOtroAsistentes() {
    //console.log(this.nombreOtroAsistente)

    if (!this.existeUsuarioAdi) {
      this.nombreOtroAsistente = `${this.nombresAsistenteAdd} ${this.apellidosAsistenteAdd}`;
    }
    const tarifa = this.tarifas.find(tarifa => tarifa[0] === this.categoriaOtroAsistente);

    this.asistentes.push({
      nombreCompleto: this.nombreOtroAsistente,
      documento: String(this.documentoOtroAsistente),
      tipoDocumento: this.tipoDocOtroAsistente,
      direccionResidencia: '',
      celular: 123,
      email: this.correoOtroAssistente,
      categoria: this.categoriaOtroAsistente,
      municipioId: 1,
      mayor19Anios: this.mayorEdad,
      esMenor18: this.menorEdad,
      esConfaRisaralda: false,
      esDeportista: false,
      tipoAfiliacion: this.tipoAfiliacionOtroAsistente,
      genero: this.generoAsistenteAdd,
      fechaNacimiento: this.fechaNacOtroAsistente,
      docAfiliado: '',
      esTrabajadorConfa: false,
      centroCostos: '1',
      valorPagoCurso: Number(tarifa[1])
    })

    ////console.log(this.asistentes)
    this.InhabilitarBtnContinuar = false;
    this.existeUsuario = null;
  }

  continuar() {
    this.utilitiesService.listadoAsistentes = this.asistentes;
    this.utilitiesService.horarioCurso = this.horarios;
    this.router.navigate(["/resumen"]);

  }

  obtenerPrecio() {

    ////console.log('sedeId:', this.sedeId);
    ////console.log('programacionId:', this.programacionId);

    const sede = this.sedeId.toString();
    const programacion = this.programacionId.toString();

    this.dataServiciosCursos.getTarifas(sede, programacion).pipe(first())
      .subscribe((response: any) => {
        //console.log(response)

        if (response.estado == false) {
          this.utilitiesService.messageTitleModal = "Atención";
          this.utilitiesService.messageModal = 'no hay tarifas disponibles';
          this.utilitiesService.backLogin = false;
          setTimeout(() => {
            $(".modalNuevoInfo").click();
          }, 500);

          setTimeout(() => {
            this.router.navigate(["/cursos"]);

          }, 1500);

        } else {
          this.tarifas = response.tarifas
        }
      });
  }

  eliminarAsistente(asis: any) {
    this.utilitiesService.loading = true;
    this.InhabilitarBtn = false;

    const documento = asis.documento;

    // Encuentra el asistente por su documento
    const index = this.asistentes.findIndex(asistente => asistente.documento === documento);

    if (index !== -1) {
      // Cambia la propiedad `inhabilitado` a false antes de eliminar
      asis.inhabilitado = false;

      // Elimina el objeto del array
      this.asistentes.splice(index, 1);
    } else {
      console.error(`No se encontró un asistente con documento ${documento}.`);
    }

    // Verifica si la lista está vacía para ajustar `InhabilitarBtnContinuar`
    if (this.asistentes.length === 0) {
      this.InhabilitarBtnContinuar = true;
    }
    this.utilitiesService.loading = false;

  }

  eliminarAsistenteAdicional(documento: any) {
    this.utilitiesService.loading = true;

    const index = this.asistentes.findIndex(asistente => asistente.documento === documento);

    if (index !== -1) {
      // Elimina el objeto del array
      this.asistentes.splice(index, 1);
      ////console.log(`Asistente con documento ${documento} eliminado.`);
      this.nombresAsistenteAdd = null;
      this.apellidosAsistenteAdd = null;
      this.nombreOtroAsistente = null;
      this.documentoOtroAsistente = null;
      this.tipoDocOtroAsistente = null;
      this.fechaNacOtroAsistente = null;

      this.InhabilitarInputDate = false;
      this.habilitarFondo = false;
      this.InhabilitarBtnAddOtroasistente = false

    } else {
      console.error(`No se encontró un asistente con documento ${documento}.`);
    }

    if (this.asistentes.length == 0) {
      this.InhabilitarBtnContinuar = true
    }

    this.utilitiesService.loading = false;

  }

  isMenuVisible(): boolean {
    const routesWithMenu = ['/home', '/cursos', '/asistente', '/resumen'];
    return routesWithMenu.includes(this.router.url);
  }

  yaEstaIncrito(programacionId: any, documento: any) {
    this.dataServiciosCursos.getCursoInscrito(programacionId, documento).pipe(first())
      .subscribe((response: any) => {
        //console.log(response.estado)

        this.estadoEstadoInscrito = response.estado

      });
  }


  /*   consultarInformacionMiPerfilConfa(documento: string) {
      this.authenticationService.consultarInformacionMiPerfilConfa(documento)
        .pipe(first())
        .subscribe((response: MiPerfilConfa) => {
          //console.log(response);
          // Asignación de datos principales
          this.userMiPerfil = response;
          this.documento = response.documento;
          this.fullName = `${response.primerNombre} ${response.segundoNombre} ${response.primerApellido} ${response.segundoApellido}`;
          this.utilitiesService.fechaNaciemintoResponsable = response.fechaNacimiento;
  
          const gf = response.grupoFamiliar;
          const lgf = response.listadoGruposFamiliares;
  
          // Eliminar duplicados en `gf` por documento
          const gfUnico = gf.filter((item, index, self) =>
            index === self.findIndex((t) => t.documento === item.documento)
          );
  
          this.resultadoGF = gfUnico;
          //console.log(gfUnico, 'gfUnico')
          // Iterar sobre el grupo familiar único
          for (let index = 0; index < gfUnico.length; index++) {
            const doc = gfUnico[index].documento;
            //console.log(doc, 'documento')
            //Consultar menor categoria
  
            let catBen = gfUnico[index].categoria;
            // Filtrar personas de los grupos familiares que coincidan con el documento
            const resultado = lgf
              .map(grupo => grupo.personasACargo.filter(persona => persona.documento === doc))
              .reduce((acc, curr) => acc.concat(curr), []);
  
            // Eliminar duplicados del resultado por documento
            const resultadoUnico = [...new Map(
              resultado.map(persona => [persona.documento, persona])
            ).values()];
  
  
            // Agregar al array `nucleoFamiliar` solo si no existe ya
            if (resultadoUnico.length > 0 &&
              !this.nucleoFamiliar.some(item => item.documento === doc)) {
              //console.log(resultadoUnico)
  
              if (
                Number(resultadoUnico[0].edad) >= Number(this.utilitiesService.edadMin) &&
                Number(resultadoUnico[0].edad) <= Number(this.utilitiesService.edadMax)
              ) {
                if (Number(resultadoUnico[0].edad) > 18) {
                  this.mayorEdad = true;
                  this.menorEdad = false;
                  //catBen = resultadoUnico[0].categoria;
                  //catBen = 'C'
                } else {
                  this.mayorEdad = false;
                  this.menorEdad = true;
                  //catBen = resultadoUnico[0].categoria;
                }
  
                // Buscar la tarifa correspondiente
                const tarifaBeneficiario = this.tarifas.find(tarifa => tarifa[0] === catBen);
  
                //valida si el usuario ya se encuentra incrito en el curso seleccionado
                this.yaEstaIncrito(this.programacionId, resultadoUnico[0].documento,);
                setTimeout(() => {
                  if (this.estadoEstadoInscrito == false) {
                    this.nucleoFamiliar.push({
                      nombreCompleto: resultadoUnico[0].nombre,
                      documento: resultadoUnico[0].documento || '',
                      tipoDocumento: resultadoUnico[0].tipoDoc || '',
                      direccionResidencia: response.direccion || '',
                      celular: Number(response.celular) || 0,
                      email: response.correo || '',
                      categoria: catBen,
                      municipioId: 1,
                      mayor19Anios: this.mayorEdad,
                      esMenor18: this.menorEdad,
                      tipoAfiliacion: 'B',
                      genero: resultadoUnico[0].sexo || '',
                      fechaNacimiento: resultadoUnico[0].fechaNacimiento || '',
                      docAfiliado: response.documento,
                      esTrabajadorConfa: false,
                      valorPagoCurso: Number(tarifaBeneficiario[1]),
                      inhabilitado: false // Nueva propiedad para controlar el estado
                    });
                  }
                }, 1000);
              }
            }
  
          }
  
          //inserta persona que se autentico en la lista final 
  
          // Buscar la tarifa correspondiente
          const tarifa = this.tarifas.find(tarifa => tarifa[0] === response.categoria);
  
  
          //valida la edad 
          const edad = this.obtenerEdad(response.fechaNacimiento)
  
          if (
            Number(edad) >= Number(this.utilitiesService.edadMin) &&
            Number(edad) <= Number(this.utilitiesService.edadMax)
          ) {
            if (Number(edad) > 18) {
              this.mayorEdad = true;
              this.menorEdad = false;
            } else {
              this.mayorEdad = false;
              this.menorEdad = true;
            }
  
            //valida si el usuario ya se encuentra incrito en el curso seleccionado
            this.yaEstaIncrito(this.programacionId, response.documento);
  
            //console.log(this.estadoEstadoInscrito)
  
            setTimeout(() => {
  
  
              if (this.estadoEstadoInscrito == false) {
                this.nucleoFamiliar.push({
                  nombreCompleto: `${response.primerNombre} ${response.segundoNombre} ${response.primerApellido} ${response.segundoApellido}`,
                  documento: response.documento || '',
                  tipoDocumento: response.tipoDocumento || '',
                  direccionResidencia: response.direccion || '',
                  celular: Number(response.celular) || 0,
                  email: response.correo || '',
                  categoria: response.categoria || '',
                  municipioId: 1,
                  mayor19Anios: this.mayorEdad,
                  esMenor18: this.menorEdad,
                  tipoAfiliacion: response.tipoUsuario,
                  genero: response.genero || '',
                  fechaNacimiento: response.fechaNacimiento || '',
                  docAfiliado: response.documento,
                  esTrabajadorConfa: false,
                  valorPagoCurso: Number(tarifa[1]),
                  inhabilitado: false // Nueva propiedad para controlar el estado ddel boton agregar en la lista
                });
              }
            }, 1000);
          }
  
  
          this.utilitiesService.loading = false;
  
          setTimeout(() => {
            ////console.log(this.nucleoFamiliar);
            // Validación de resultados
            if (this.nucleoFamiliar.length === 0) {
              this.utilitiesService.messageTitleModal = "Atención";
              this.utilitiesService.messageModal = 'Ningún integrante de tu grupo familiar está habilitado para el curso seleccionado o ya están inscritos';
              this.utilitiesService.backLogin = false;
              $(".modalNuevowarning").click();
            }
          }, 1000);
  
  
        });
    } */

  preventWhitespace(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    // Evitar espacio
    if (event.key === ' ') {
      event.preventDefault();
      return;
    }

    // Permitir solo números (0–9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  evitarPegado(event: ClipboardEvent) {
    const pastedInput: string = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(pastedInput)) {
      event.preventDefault();
    }
  }

  /* ajuste de la consulta de asistentes y creacion del grupo familiar */
  informacionUsuarioGrupoFamiliar() {
    this.utilitiesService.loading = true;
    //console.log('informacionUsuarioGrupoFamiliar')
    //informacion del usuario 
    const infoUser = JSON.parse(localStorage.getItem("InformacionMiPerfil"));

    setTimeout(() => {
      this.userMiPerfil = infoUser.usuario;
      this.documento = infoUser.documento;
      this.fullName = `${infoUser.primerNombre} ${infoUser.segundoNombre} ${infoUser.primerApellido} ${infoUser.segundoApellido}`;
      this.utilitiesService.fechaNaciemintoResponsable = infoUser.fechaNacimiento;

      //infromacion del grupo familiar 
      const gfUnico = JSON.parse(localStorage.getItem("grupoFamiliarFusionado"));
      console.log('gfUnico', gfUnico)
      for (let index = 0; index < gfUnico.length; index++) {
        const grupoFamiliar = gfUnico[index];
        //console.log('entro al FOR')

        if (Number(grupoFamiliar.edad) >= Number(this.utilitiesService.edadMin) && Number(grupoFamiliar.edad) <= Number(this.utilitiesService.edadMax)) {
          if (Number(grupoFamiliar.edad) > 18) {
            this.mayorEdad = true;
            this.menorEdad = false;
            //catBen = resultadoUnico[0].categoria;
            //catBen = 'C'
          } else {
            this.mayorEdad = false;
            this.menorEdad = true;
            //catBen = resultadoUnico[0].categoria;
          }
          // Buscar la tarifa correspondiente
          const tarifaBeneficiario = this.tarifas.find(tarifa => tarifa[0] === grupoFamiliar.categoria);
          //valida si el usuario ya se encuentra incrito en el curso seleccionado
          this.yaEstaIncrito(this.programacionId, grupoFamiliar.documento,);
          setTimeout(() => {
            if (this.estadoEstadoInscrito == false) {
              this.nucleoFamiliar.push({
                nombreCompleto: grupoFamiliar.nombreCompleto,
                documento: grupoFamiliar.documento || '',
                tipoDocumento: grupoFamiliar.tipoDoc || '',
                direccionResidencia: infoUser.direccion || '',
                celular: Number(infoUser.celular) || 0,
                email: infoUser.correo || '',
                categoria: grupoFamiliar.categoria,
                municipioId: 1,
                mayor19Anios: this.mayorEdad,
                esMenor18: this.menorEdad,
                tipoAfiliacion: grupoFamiliar.documento === infoUser.documento ? infoUser.tipoUsuario : 'B',
                genero: grupoFamiliar.sexo || '',
                fechaNacimiento: grupoFamiliar.fechaNacimiento || '',
                docAfiliado: infoUser.documento,
                esTrabajadorConfa: false,
                valorPagoCurso: Number(tarifaBeneficiario[1]),
                inhabilitado: false // Nueva propiedad para controlar el estado
              });
            }
          }, 1000);
        }

      }

      //console.log('salio del FOR')

      setTimeout(() => {
        ////console.log(this.nucleoFamiliar);
        // Validación de resultados
        if (this.nucleoFamiliar.length === 0) {
          this.utilitiesService.messageTitleModal = "Atención";
          this.utilitiesService.messageModal = 'Ningún integrante de tu grupo familiar está habilitado para el curso seleccionado o ya están inscritos';
          this.utilitiesService.backLogin = false;
          $(".modalNuevowarning").click();
        }
      }, 1000);
    }, 1000);
  }
}