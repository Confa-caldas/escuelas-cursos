export interface Asistente {
  nombreCompleto: string;
  documento: string;
  tipoDocumento:string;
  direccionResidencia: string;
  celular:  number;
  email: string;
  categoria: string;
  municipioId:  number;
  mayor19Anios: Boolean;
  esConfaRisaralda: Boolean;
  esMenor18: Boolean;
  tipoAfiliacion: string;
  genero: string;
  fechaNacimiento: string;
  docAfiliado:  string;
  esDeportista: Boolean,
  esTrabajadorConfa: Boolean,
  centroCostos: string;
  valorPagoCurso: number;
}

export interface Transaction {
  paymentOrderStatus: string;
  paymentUrl: string;
  paymentOrderId: string;
  message: string;
}

export interface InitiateTransaction {
  documento: String;
  tipoDocumento: String;
  sedeId: number;
  cursoId: number;
  programacionId: number;
  valorPago: number;
  urlRetorno: String;
  nombreCompleto: String;
  direccionResidencia: String;
  celular: String;
  genero: String;
  fechaNacimiento: String;
  emailConfirmacion: String;
  aceptaPoliticaServicio: boolean;
  aceptaPoliticaTratamientoDatos: boolean;
  aceptaAutorizacionMenores: boolean; //
  documentoResponsable: String;
  nombreResponsable: String;
  haymenor18: boolean;
  asistentes: Asistente[];
  nombreDatafono: String;
}
export interface TransactionStatus {
  entityCode: string;
  ticketId: string;
  trazabilityCode: string;
  tranState: string;
  returnCode: string;
  transValue: number;
  transVatValue: number;
  payCurrency: string;
  currencyRate: number;
  bankProcessDate: string;
  fiCode: string;
  bankName: string;
  paymentSystem: string;
  transCycle: string;
  invoice: string;
  numeroIdentificacion: string;
  identificadorProducto: string;
  nombreApellido: string;
  tipoDocumento: string;
  direccionResidencia: string;
  celular: string;
  emailConfirmacion: string;
  codigoArea: string;
  codigoServicio: string;
  codigoSubservicio: string;
  srvCode: string;
}

export interface TransactionPayzen {
  clasificacion: number;
  documento: string;
  estadoFacturaId: number;
  fechaCreacion: string;
  fechaModificacion: string;
  identificadorProducto: string;
  message: string;
  metadata: string;
  nombreApellido: string;
  numeroFactura: string;
  paymentOrderId: string;
  paymentOrderStatusId: string;
  registroId: number;
  tipoDocumento: string;
  transStatusId: number;
  transUuid: string;
  urlRetorno: string;
  valorPago: number;
  email: string;
  celular: string;
  direccion: string;
}

export interface Pago {
    vapago: boolean;
    esmenor: boolean;
    nombreres: string;
    documentores: string;
  }

  /* export interface Pago {
    nombreCompleto: string;
    tipoDocumento:string;
    documento: string;
    valorPago: Number;
    urlRetorno: string;
    servicio: string;
    sedeId: Number;
    cursoId: Number;
    programacionId: Number;
    direccionResidencia: string;
    celular: string;
    genero: string;
    fechaNacimiento: string;
    emailConfirmacion: string;
    aceptaPoliticaServicio: true;
    aceptaPoliticaTratamientoDatos: true;
    aceptaAutorizacionMenores: true;
    documentoResponsable: string;
    nombreResponsable: string;
    nombreDatafono: string;
    haymenor18: boolean; 
  } */