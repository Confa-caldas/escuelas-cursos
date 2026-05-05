import { Injectable } from '@angular/core';

//interfaces
import { Asistente, TransactionStatus, TransactionPayzen } from 'src/app/interfaces/cursos.interface'
import { User, credenciales, TipoDoc } from '../interfaces/user.interface';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  miPerfil: boolean = true;
  changePass: boolean = false;
  updateInfo: boolean = false;

  puedeIngresar: boolean = false;
  debeActualizarDatos: boolean = false;
  debeRealizarValidacion: boolean = false;
  userActivo: boolean = false;
  permiteRealizarPreguntas: boolean = false;

  bloqueo = false;
  backHome: boolean = false;
  backModify: boolean = false;

  // Loading
  loading: boolean = false;
  messageLoading: string = null;

  // Modal
  messageTitleModal: string;
  messageModal: string;
  backLogin: boolean = false;
  errorInfoLogin: string = 'El usuario no se encuentra registrado o alguno de los dos datos es incorrecto.';

  // User
  currentUser: User;
  fullNameUser: string;
  documentUser: string;
  tipoDoc: string;
  emailUser: string;
  phoneUser: string;
  transaccionId: number;
  registerUser: User;
  fechaNacimiento: string = ''; //validacion de identidad
  existUser: boolean = false;
  recoveryEmail: string;
  nasfaUser: User;
  direccionResidencia: string;
  celular: string;
  genero: string;
  estadoFacial: boolean = false;
  estadoRegistraduria: boolean = false;
  actualizarEstadoFacialIC: boolean = false;
  botnesEstadoFacial: boolean = false;
  usuarioNasfa: boolean = false;
  tienePreguntas: boolean = false;

  edad: number;
  listadoCursos: [];

  //Curso
  curso: [] = [];
  servicios: any;
  ciudadCurso: string;
  actividadCurso: string;
  ubicacionCurso: string;
  edadNivelCurso: string;
  horarioCurso: any[] = [];
  fechaInicioFin: string;
  edadMin: number;
  edadMax: number;
  tarifaCategoria: number;
  listadoAsistentes: Asistente[] = [];
  programacionId: string;
  paymentOrderId: string;

  urlRedireccionPayzen: string;

  documentNopyzen: string;
  identifierProductNopyzen: string;
  dues: any = null;
  returnUrl: string = null;
  subserviceCode: number = null;
  transactionInfo: TransactionStatus;
  transactionPayzen: TransactionPayzen;
  colorTransaction: string = null;

  //responsable de la compra 
  fechaNaciemintoResponsable: string;

  //Validacion facial
  foto: string = null;
  indiciocorreo: string = null;
  indiciocel: string = null;
  showWebcam: boolean = false;
  facialOtp: boolean = false;
  preguntasOtp: boolean = false;
  desdelogin: boolean = false;
  celularIndicio: string;
  correoIndicio: string;

  credencialesLogin: credenciales;
  otrosIngresos: boolean = false;

  dataTpDoc: TipoDoc[]
  mostrarModalSugerencia: boolean = true;
  vacacionesRecreativas: boolean = false;


  constructor() { }

  convertDateFormat(_date: any, _format: string) {
    const year = _date.year;
    const month = _date.month;
    const day = _date.day;

    let date = year + '/' + month + '/' + day;

    if (year && month && day) {
      return moment(date).format(_format);
    }
    else {
      return moment(_date).format(_format);
    }
  }

  setCodeTransactionStatus(code: string) {
    switch (code) {
      case 'OK':
        this.messageModal = 'Transacción aprobada por la entidad financiera';
        break;
      case 'NOT_AUTHORIZED':
        this.messageModal = 'Transacción no aprobada por la entidad financiera';
        break;
      case 'EXPIRED':
        this.messageModal = 'Transacción expirada';
        break;
      case 'FAILED':
        this.messageModal = 'Se ha presentado un fallo en la comunicación con la entidad financiera';
        break;
      case 'PENDING':
        this.messageModal = 'Tu transacción está pendiente de aprobación por tu entidad financiera';
        break;
      case 'BANK':
        this.messageModal = 'Se ha presentado un fallo en la comunicación con la entidad financiera';
        break;
    }
  }

  calculateAge(startAge: string): number {
    // Convertir la cadena en un objeto Date
    const start = new Date(startAge);
    const now = new Date();

    // Calcular la diferencia en años
    let age = now.getFullYear() - start.getFullYear();

    // Verificar si aún no ha cumplido años este año
    const montDiferent = now.getMonth() - start.getMonth();
    if (
      montDiferent < 0 ||
      (montDiferent === 0 && now.getDate() < start.getDate())
    ) {
      age--;
    }

    return age;
  }

}
