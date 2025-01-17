export interface Servicio {
    conciliacion: boolean;
    descripcion: string;
    estado:string;
    nombre:string;
    curso: Curso[];
    urlImagen:string;
  }
  
  export interface Curso {
    descripcion: string;
    edadMaxima: number;
    edadMinima: number;
    estado: string;
    etapa: Etapa;
    horario: Horario;
    id: number;
    modalidadDeportiva: ModalidadDeportiva;
    nombre: string;
    programacion: Programacion;
    sede: Sede;
  }
  
  export interface Etapa {
    descripcion: string;
    estado: string;
    id: number;
    nombre: string;
  }
  
  export interface Horario {
    diaId: number;
    horaFin: string;
    horaInicio: string;
    horarioId: number;
    nombreDia: string;
  }
  
  export interface ModalidadDeportiva {
    descripcion: string;
    estado: string;
    id: number;
    nombre: string;
  }
  
  export interface Programacion {
    ano: string;
    cuposDisponibles: number;
    cuposMinimos: number;
    cuposTotales: number;
    fechaCorte: number;
    fechaFin: number;
    fechaInicio: number;
    periodo: string;
    programacionId: number;
  }
  
  export interface Sede {
    departamentoId: number;
    direccion: string;
    estado: string;
    municipioId: number;
    nombreDepartamento: string;
    nombreMunicipio: string;
    nombreSede: string;
    sedeId: number;
    telefono: string;
  }
  