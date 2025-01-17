export interface PuntosLineasAtencion {
  puntosAtencion: PuntosAtencion[];
  lineasAtencion: LineasAtencion[];
}

export interface LineasAtencion {
  nombreSede: string;
  telefonos: string;
  extensiones: string;
  correo: string;
}

export interface PuntosAtencion {
  nombreSede: string;
  direccionSede: string;
  modalidad: string;
}
