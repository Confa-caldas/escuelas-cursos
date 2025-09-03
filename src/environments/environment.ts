// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// ng build --configuration=production
// ng build --prod=true

export const environment = {
  production: false,
  portalWeb: "https://confa.co/",
  personas: "https://confa.co/",
  empresas: "https://confa.co/empresas/",
  facebook: "https://www.facebook.com/Confacaldas/",
  twitter: "https://twitter.com/confacaldas",
  instagram: "https://www.instagram.com/confacaldas/",
  youtube: "https://www.youtube.com/user/Confamiliares",
  pagoDeAportes: "https://www.enlace-apb.com/interssi/.plus",
  acercaDeConfa: "https://confa.co/personas/acerca-de-confa/",
  servicios: [
    {
      nombreServicio: "Subsidios",
      linkServicio: "https://confa.co/personas/subsidios/",
    },
    {
      nombreServicio: "Vivienda",
      linkServicio: "https://confa.co/personas/vivienda/",
    },
    {
      nombreServicio: "Educación",
      linkServicio: "https://confa.co/personas/educacion/",
    },
    {
      nombreServicio: "Recreación",
      linkServicio: "https://confa.co/personas/recreacion/",
    },
    {
      nombreServicio: "Creditos",
      linkServicio: "https://confa.co/personas/creditos/",
    },
    {
      nombreServicio: "Alojamiento",
      linkServicio: "https://app.confa.co:8321/alojamiento",
    },
    {
      nombreServicio: "Salud",
      linkServicio: "https://app.confa.co:8321/salud",
    },
    {
      nombreServicio: "Boletines",
      linkServicio: "https://app.confa.co:8324/login",
    },
  ],
  contacto: "https://confa.co/personas/contacto/",
  viveConfa: "https://confa.co/personas/servicios-en-linea/",
  serviciosEnLinea: "https://confa.co/personas/servicios-en-linea/",
  miPerfilConfa: "https://app.confa.co:8356/#/",

  apiUrl: "https://validacion-identidad.d1qbr9e38zvx72.amplifyapp.com/", //Cambiar para amplify
  //apiUrl: "https://devkaren.d1qbr9e38zvx72.amplifyapp.com", //Cambiar para amplify
  //apiUrl: "http://localhost:4200/", //Cambiar dependiendo el puerto de la ruta en pruebas
  //escuelaCursoRest: "http://nbappa:28080/escuelaCursoRestWS/rest/escuelaCurso", https://app.confa.co:8377
  escuelaCursoRest: "https://app.confa.co:8377/recreacionWS/rest/escuelaCurso",
  //escuelaCursoRest: "http://localhost:8081/recreacionWS/rest/escuelaCurso",
  //escuelaCursoRest: "http://nbdesrecre:28080/recreacionWS/rest/escuelaCurso",
  
  //apiIngresoConfa: "http://localhost:8080/ingresoConfaWssMiPerfil/rest/",
  apiIngresoConfa: "https://app.confa.co:8687/ingresoConfaWSSGC/rest/",
  //apiIngresoConfa: "https://alojamiento.confa.co/ingresoConfaWSS/rest/", //PRODUCCION
  parametro1: "hlZTM4ZDcwNDRlODcyNzZDX1BPUlQqMjAxOCQ=",
  parametro2: "UG9ydGFsX0NvbmZhODRkZGZiMzQxMjZmYzNhND",

  /*-----------------API CIRCULAR EN PROD----------------- */
  apiCircular: "https://c007.confa.co/circularWS/",
  param1: "YmQ2YmU2YzkxYzRmNmM0ZUNJUkNVX0YqMjAyMCQ=",
  param2: "Q2lyY3VsYXJfQ29uZmE3YjdhNTNlMjM5NDAwYTEz",
  servicio: 1,

  dispoCentros:
    "https://alojamiento.confa.co/recreacionWS/rest/pasadiaRecreacion",

    validacionIndentidad: "https://pruebasfon.confa.co:28181/validacionIdentidadWS/",
  //apiIngresoConfa: "http://localhost:8080/ingresoConfaWSSMiPerfil/rest/",

  /*-----------------DEPARTAMENTOS Y MUNICIPIOS----------------- */
  apiAlojamiento: "https://alojamiento.confa.co/alojamientoWS/rest/",

  /*-----------------FACIAL----------------- */
  apiFacial:
    "https://identidad.confa.co/transaccionAutenticacionWS/transaccion/metodo1",

  /*-----------------INFORMACION HABEAS DATA----------------- */
  apiHabeasData:
    "https://identidad.confa.co/transaccionAutenticacionWS/transaccion/metodo13",

     /*  validacion de identida */
  validacionIdentidadWS:
  "https://pruebasfon.confa.co:28181/validacionIdentidadWS/transaccion",

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
