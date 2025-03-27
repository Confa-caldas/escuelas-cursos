import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { map } from "rxjs/operators";
import {
  InfoCheckComercial,
  ValidateQuestion,
} from "../interfaces/user.interface";

@Injectable({
  providedIn: "root",
})
export class ValidationService {
  constructor(private http: HttpClient) {}

  private getPOSTFacial(ruta: string, token: string, bodyContent: any) {
    const url = `${environment.validacionIndentidad}${ruta}`;
    const body = bodyContent;
    return this.http.post(url, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getPOSTFacialService(
    tipoDoc: string,
    documento: string,
    imagen: string,
    token: string
  ) {
    let body = {
      tipoDoc: tipoDoc,
      documento: documento,
      foto: imagen,
      token: token,
    };
    return this.getPOSTFacial("transaccion/metodo2", token, body).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getOTPGenerarService(
    tipoDoc: string,
    documento: string,
    canal: string,
    transaccionId: number,
    token: string
  ) {
    let body = {
      tipoDocumento: tipoDoc,
      documento: documento,
      canal_envio: canal,
      transaccionId: transaccionId,
    };

    return this.getPOSTFacial("transaccion/metodo3", token, body).pipe(
      map((response) => {
        return response["RespuestaEnvioSMS"];
      })
    );
  }

  getValidarOTPService(transaccionId: number, otp: number, token: string) {
    let body = {
      transaccionId: transaccionId,
      codigoAcceso: otp,
    };

    return this.getPOSTFacial("transaccion/metodo4", token, body).pipe(
      map((response) => {
        return response["RespuestaValidacionCodigoAcceso"];
      })
    );
  }

  async hasWebcam(): Promise<boolean> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some((device) => device.kind === "videoinput");
    } catch (error) {
      console.error("Error al acceder a la cámara", error);
      return false;
    }
  }

  validateQuestion(
    tipoDoc: string,
    documento: string,
    validacion: boolean,
    momento: string,
    token: string
  ) {
    let bodyValidateQuestion = {
      tipoDoc: tipoDoc,
      documento: documento.toString(),
      respuestas: validacion,
      momento: momento,
    };

    /* 	console.log(bodyValidateQuestion) */

    return this.getPOSTFacial(
      "transaccion/metodo5",
      token,
      bodyValidateQuestion
    ).pipe(
      map((response: ValidateQuestion) => {
        return response;
      })
    );
  }

  postInfoCheckComercial(token: string, infoCheck: InfoCheckComercial) {
    return this.getPOSTFacial("transaccion/metodo7", token, infoCheck).pipe(
      map((response) => {
        return response;
      })
    );
  }

  ObtenerTrasaccionId(
      tipoDocumento: string,
      documento: string,
      canal_envio: string,
      token: string
  ) {
    let body = {
      tipoDoc: tipoDocumento,
      documento: documento,
      canal_envio:  canal_envio,
    };

    return this.getPOSTFacial("transaccion/metodo12",token, body).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
