import { Injectable } from '@angular/core';
 
import { HttpClient } from '@angular/common/http';
import { PuntosLineasAtencion, LineasAtencion, PuntosAtencion } from '../interfaces/attention.interface';

@Injectable({
  providedIn: 'root'
})
export class AttentionService {

  puntosLineasAtencion: PuntosLineasAtencion;
  lineasAtencion: LineasAtencion[] = [];
  puntosAtencion: PuntosAtencion[] = [];

  constructor(
    private http: HttpClient
  ) {
    this.getPuntosLineasAtencion();
  }

  private getPuntosLineasAtencion() {
    this.http.get('assets/data/attention.json')
      .subscribe((response: PuntosLineasAtencion) => {
        this.puntosLineasAtencion = response;
        this.lineasAtencion = response.lineasAtencion;
        this.puntosAtencion = response.puntosAtencion;
        // console.log(this.lineasAtencion);
        // console.log(this.puntosAtencion);
      });
  }
}
