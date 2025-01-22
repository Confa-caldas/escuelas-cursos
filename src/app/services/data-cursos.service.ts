import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DataServiciosCursos {
  private servicioSeleccionado: any;
  private jsonUrl = 'assets/data/img-cards.json';

  constructor(private http: HttpClient) {

  }
  private getQueryGet(query: string) {
    const url = `${environment.escuelaCursoRest}${query}`;
    return this.http.get(url);
  }

  private getQueryPost(query: string, bodyContent: any) {
    const url = `${environment.escuelaCursoRest}${query}`;
    const body = bodyContent;
    return this.http.post(url, body);
  }

  getServicios() {
    return this.getQueryGet("/metodo1").pipe(
      map((response) => {
        return response;
      })
    );
  }

  getSedes() {
    return this.getQueryGet("/metodo2").pipe(
      map((response) => {
        return response;
      })
    );
  }

  getHabeasData(personaId: string) {
    let bodyUser = {
      personaId: personaId.toString(),
    };

    return this.getQueryPost("/metodo4", bodyUser).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getEnrrolado(personaId: number) {
    let bodyUser = {
      personaId: personaId.toString(),
    };
    return this.getQueryPost("/metodo5", bodyUser).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCiudades() {
    return this.getQueryGet("/metodo6").pipe(
      map((response) => {
        return response;
      })
    );
  }



  iniciartipoTransaccion(body) {

    return this.getQueryPost("/metodo8%0A", body).pipe(
      map((response) => {
        return response;
      })
    );
  }


  getTarifas(sedeId: string, programacionId: string) {
    let bodyUser = {
      programacionId: programacionId.toString(),
      sedeId: sedeId.toString()
    };
    return this.getQueryPost("/metodo9", bodyUser).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getDeportes() {
    return this.getQueryGet("/metodo10").pipe(
      map((response) => {
        return response;
      })
    );
  }

  verifyTransaction(productoId: string) {
    let body = {
      productoId: productoId,
    };
    return this.getQueryPost("/metodo11", body).pipe(
      map((response) => {
        return response;
      })
    );
  }


  // Método para establecer el servicio seleccionado
  setServicio(servicio: any) {
    this.servicioSeleccionado = servicio;
  }

  // Método para obtener el servicio seleccionado
  getCursos() {
    return this.servicioSeleccionado;
  }

  calcularEdad(fechaNacimiento: string): number {
    console.log(fechaNacimiento)
    const hoy = new Date(); // Fecha actual
    const nacimiento = new Date(fechaNacimiento); // Fecha de nacimiento como Date

    let edad = hoy.getFullYear() - nacimiento.getFullYear(); // Calcula diferencia en años
    const mes = hoy.getMonth() - nacimiento.getMonth();
    const dia = hoy.getDate() - nacimiento.getDate();

    // Ajustar si el cumpleaños de este año aún no ha pasado
    if (mes < 0 || (mes === 0 && dia < 0)) {
      edad--;
    }

    console.log(edad, "edad linea 143 servicio calcular edad")
    return edad;
  }

  /* IMAGENES DE CARD HOME */
  getImagenes(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonUrl);
  }

  //Método para obtener los cupos disponibles antes de realizar el pago
  getCurposDispo(programacionId: string) {
    let body = {
      programacionId: programacionId,
    };
    return this.getQueryPost("/metodo12", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //Método para obtener el historial de transacciones/pagos
  getHistorialPagos(documento: string) {
    let body = {
      documento: documento,
    };
    return this.getQueryPost("/metodo14", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //Método que valida si el asitente ya tiene un curso inscrito
  getCursoInscrito(programacionId: string, documento: string) {
    let body = {
      documento: documento,
      programacionId: programacionId
    };
    console.log(body)
    return this.getQueryPost("/metodo15", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  consultaRecreacion(documento: string) {
    let body = {
      documento: documento,
    };
    return this.getQueryPost("/metodo16", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //Método para limpiar los cupos al rechazar/regresar el pago
  LimpiarCupos(programacionId: string, paymentOrderId: string) {
    let body = {
      programacionId: programacionId,
      paymentId: paymentOrderId,
    };
    return this.getQueryPost("/metodo17", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //traer menos categoria
  menorCategoria(documento: string) {
    let body = {
      documento: documento,
    };

    return this.getQueryPost("/metodo18", body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  //consultar el grupo familiar
  consultarGrupoFamiliar(documento: string) {
    let body = {
      documento: documento,
    };

    return this.getQueryPost("/metodo19", body).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
