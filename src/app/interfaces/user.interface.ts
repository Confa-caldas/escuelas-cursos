export interface UserRegister {
  sistema: string;
  linkMensaje: string;
  parametro: string;
  remitente: string;
  asunto: string;
  usuario: UserR;
}

export interface User {
  usuarioId?: number;
  documento: string;
  direccion: string;
  telefono: string;
  sexo: string;
  categoria: string;
  celular: string;
  correo: string;
  clave: string;
  codBeneficiario: string;
  nombreBeneficiario: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  documentoTrabajador: string;
  obligaCambioContra?: boolean;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  link: string;
  existeUsuario: boolean;
  usuarioNasfa: boolean;
  fechaActualizacion?: string;
  sistemaActualizacion: string;
  correoMd5: string;
  aceptaHabeas: boolean;
  tipoDocumento?: string;
  preguntasValidacion: boolean;
  fechaRespuestasValidacion: string;
  bloqueoUser: boolean;
  estadoUser: string;
  contUser: number;
  bloqueo: boolean;
  preguntas: PreguntasUser;
  mensaje: string;
  registroPendiente:boolean;
}
export interface UserR {
  usuarioId?: number;
  documento: string;
  direccion: string;
  telefono: string;
  sexo: string;
  categoria: string;
  celular: string;
  correo: string;
  clave: string;
  codBeneficiario: string;
  nombreBeneficiario: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  documentoTrabajador: string;
  obligaCambioContra?: boolean;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  link: string;
  existeUsuario: boolean;
  usuarioNasfa: boolean;
  fechaActualizacion?: string;
  sistemaActualizacion: string;
  correoMd5: string;
  aceptaHabeas: boolean;
  tipoDocumento?: string;
  preguntasValidacion: boolean;
  fechaRespuestasValidacion: string;
  bloqueoUser: boolean;
  estadoUser: string;
  contUser: number;
  bloqueo: boolean;
 /*  preguntas: PreguntasUser; */
  mensaje: string;
  registroPendiente:boolean;
}

export interface Token {
  token?: string;
  mensaje?: string;
}

export interface RememberPassword {
  documento: string;
  sistema: string;
  linkMensaje: string;
  parametro: string;
  remitente: string;
  asunto: string;
}

export interface ValidateToken {
  mensaje: string;
  valido: boolean;
  tipo: string;
}

export interface ValidateQuestion {
  respuesta: boolean;
  bloqueo: boolean;
  intentos: number;
  error: string;
  estado: number;
  debeActualizarDatos: boolean;
}

export interface userMiPerfil {
  usuario: Usuario;
}

export interface Usuario {
  documento: string;
  direccion: string;
  telefono: string;
  sexo: string;
  categoria: string;
  celular: string;
  correo: string;
  clave: string;
  codBeneficiario: string;
  nombreBeneficiario: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  documentoTrabajador: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  link: string;
  existeUsuario: boolean;
  usuarioNasfa: boolean;
  sistemaActualizacion: string;
  correoMd5: string;
  aceptaHabeas: boolean;
  tipoDocumento: string;
  /*  "preguntasValidacion": boolean;
  "fechaRespuestasValidacion": string;
  "bloqueoUser": boolean;
  "estadoUser": string;
  "contUser": number; */
}

export interface Questions {
  ConsultaPreguntasResponse: ConsultaPreguntasResponse;
}
export interface ConsultaPreguntasResponse {
  mensaje: string;
  error: number;
  preguntas: PreguntasUser;
}
export interface PreguntasUser {
  identificador: number;
  texto: string;
  respuestas: object;
}

export interface ConsultaInformacionUser {
  ConsultaPersonasResponse: ConsultaPersonasResponse;
}
export interface ConsultaPersonasResponse {
  mensaje: string;
  error: number;
  beneficiarios: Array<Persona>;
  persona: Persona;
}
export interface Persona {
  PrimerApellido: string;
  celular: string;
  codigoDepartamentoResidencia: string;
  codigoEstadoCivil: string;
  codigoMunicipioLabor: string;
  codigoMunicipioResidencia: string;
  codigoNivelEscolaridad: string;
  codigoPaisResidencia: string;
  codigoSexo: string;
  codigoTipoIdentificacion: string;
  correoElectronico: string;
  fechaNacimiento: string;
  numeroIdentificacion: string;
  ocupacion: string;
  primerNombre: string;
  segundoApellido: string;
  segundoNombre: string;
  telefonoFijo: string;
  tipoPersona: string;
}

export interface validateResponse {
  ValidacionRespuestasResponse: Resultado;
}

export interface Resultado {
  error: number;
  mensaje: string;
  resultadoValidacion: boolean;
}

export interface UserRegister {
  usuario: UserR;
}

export interface Token {
  token?: string;
  mensaje?: string;
}

export interface RememberPassword {
  documento: string;
  sistema: string;
  linkMensaje: string;
  parametro: string;
  remitente: string;
  asunto: string;
}

export interface ValidateToken {
  mensaje: string;
  valido: boolean;
  tipo: string;
}

export interface UserOrCompany {
  documentType: string;
  document?: number;
  companyNit?: number;
  companyBranch?: string;
}

/* 
export interface ValidateQuestion {
  respuesta: boolean;
  bloqueo:boolean;
  intentos:number;
  error:string;
  estado:number;
} */

export interface MiPerfilConfa {
  usuarioId: number;
  documento: string;
  grupoFamiliar?: Array<GrupoFamiliar>;
  direccion: string;
  categoria: string;
  celular: string;
  correo: string;
  fechaNacimiento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  existeUsuario: boolean;
  usuarioNasfa: boolean;
  tipoDocumento: string;
  tiempoAfiliacion: string;
  derechoCuotaMonetaria: boolean;
  estado: string;
  clave: string;
  fechaAfiliacion?: string;
  fechaIngresoEmpresa?: string;
  genero?: string;
  textoPdf?: string[];
  tipo_afi?: string;
  esDesempleadoParaServicio?: boolean;
  tipoUsuario?: string;
  listadoGruposFamiliares?: Array<GruposFamiliaresList>;
  codigoAfi?: string;
  municipio?: string;
  nit?: string;
  razonSocialempresa?: string;
  vigencia?: string;
}

export interface GruposFamiliaresList {
  documentoTrabajdor?: string;
  tipoDocTrabajdor?: string;
  numGrupo?: string;
  personasACargo: Array<PersonaACargo>;
}
export interface selecPersona {
  apellido1: string;
  apellido2: string;
  categoria: string;
  documento: string;
  edad: string;
  nombre1: string;
  nombre2: string;
  parentesco: string;
  seleccionada: boolean;
  sexo: string;
}

export interface PersonaACargo {
  nombre?: string;
  documento?: string;
  tipoDoc?: string;
  parentesco?: string;
  edad?: string;
  sexo?: string;
  fechaNacimiento?: string;
}

export interface Afiliado {
  apellido1?: string;
  apellido2?: string;
  categoria?: string;
  codbarrio?: string;
  codciudad?: string;
  coddepto?: string;
  codigo?: string;
  codsector?: string;
  direccion?: string;
  documento?: string;
  edad?: string;
  email?: string;
  empresa: Empresa;
  estado?: string;
  estcivil?: string;
  fechaafi?: string;
  fechaing?: string;
  fechanac?: string;
  nombre?: string;
  nombre1?: string;
  nombre2?: string;
  sexo?: string;
  telefono?: string;
  tipodoc?: string;
  tipotr?: string;
}

export interface Empresa {
  alDia?: string;
  clase?: string;
  codciudad?: string;
  coddepto?: string;
  codigo?: string;
  direccion?: string;
  estado?: string;
  nit?: string;
  nombreComercial?: string;
  razonSocial?: string;
}

export interface GrupoFamiliar {
  documento: string;
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  categoria: string;
  edad: string;
}

export interface Session {
  debeActualizarDatos?: boolean;
  debeRealizarValidacion?: boolean;
  puedeIngresar?: boolean;
  usuario?: User;
  exitoso: boolean;
}

export interface EstadoAplicativo {
  titulo: string;
  mensaje: string;
  estado: string;
}
