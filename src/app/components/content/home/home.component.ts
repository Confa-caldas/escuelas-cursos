
//dependencias
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DatePipe, CommonModule } from "@angular/common";
import { ReactiveFormsModule, UntypedFormGroup, FormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { first } from 'rxjs/operators';
import { environment } from "src/environments/environment";

//interfaces
import { MiPerfilConfa, Session, User, Usuario, selecPersona } from "src/app/interfaces/user.interface";
import { Servicio } from '../../../interfaces/servicio.interface';

//servicios
import { UtilitiesService } from "src/app/services/utilities.service";
import { QuestionsService } from "src/app/services/questions.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { DataServiciosCursos } from 'src/app/services/data-cursos.service'

//Componentes
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';


declare var $;
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  providers: [DatePipe]
})
export class HomeComponent implements OnInit {
  public environment = environment;
  //Vistas
  miPerfil: boolean = true;
  //Variables de usuario
  login: boolean = false;
  user: Usuario;
  userMiPerfil: MiPerfilConfa;
  persona1: selecPersona;
  usuario: User;
  fullName: string = "";
  document: string;
  documento: string;

  token: string;
  listadoImagenes: any;

  ciudadSeleccionada = 'default'; // ciudad seleccionada para filtrar
  ciudades: any[] = [];

  /* Escuelas y cursos */
  servicios: Servicio[] = [];
  dataCursosOriginal: any[] = []; // estructura original con [{ curso: [...] }]
  cursosVisibles: any[] = []; // estructura original con [{ curso: [...] }]

  constructor(
    private router: Router,
    public utilitiesService: UtilitiesService,
    public questionsService: QuestionsService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private dataServiciosCursos: DataServiciosCursos
  ) {

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
        /* ||res==null */ 
        this.authenticationService
          .loginNew(ptoken.token)
          .pipe(first())
          .subscribe((response: Session) => {
            this.utilitiesService.messageLoading = null;
            this.utilitiesService.currentUser = response.usuario;
            if (response.usuario.existeUsuario) {
              localStorage.setItem("user", JSON.stringify(response));
              localStorage.setItem("cc", response.usuario.documento);
              this.document = response.usuario.documento;
              this.utilitiesService.loading = true;
              this.consultarInformacionMiPerfilConfa(this.document);
            }else{
            location.reload();
          }
          });
    }
  }

  ngOnInit() {
    //Llamamos modal de la sugerencia de seguridad
    this.utilitiesService.loading = true;
    this.consultarCursos();
  }

  navigate() {
    this.router.navigate(["/historico"]);
  }

  get isTwoOrFour(): boolean {
    return this.servicios.length === 2 || this.servicios.length === 4;
  }

  consultarInformacionMiPerfilConfa(documento: string) {

    const infoUser = JSON.parse(localStorage.getItem("user"));
    //console.log(infoUser)
    this.userMiPerfil = infoUser.user;
    this.documento = infoUser.usuario.documento;
    this.fullName = `${infoUser.usuario.primerNombre} ${infoUser.usuario.segundoNombre} ${infoUser.usuario.primerApellido} ${infoUser.usuario.segundoApellido}`;
    this.utilitiesService.loading = false;
    this.utilitiesService.fullNameUser = `${infoUser.usuario.primerNombre} ${infoUser.usuario.segundoNombre} ${infoUser.usuario.primerApellido} ${infoUser.usuario.segundoApellido}`;
    this.utilitiesService.documentUser = infoUser.usuario.documento;
    this.utilitiesService.direccionResidencia = infoUser.usuario.direccion;
    this.utilitiesService.celular = infoUser.usuario.celular;
    this.utilitiesService.genero = infoUser.usuario.genero;

  }

  consultarCursos() {
    this.dataServiciosCursos.getServicios().pipe(first())
      .subscribe((response: any) => {
        const ciudadMap = new Map();
        const ID_SERVICIO_MAYORES = 27;

        response.servicios.sort((a, b) => {
          if (a.id === ID_SERVICIO_MAYORES) return -1;
          if (b.id === ID_SERVICIO_MAYORES) return 1;
          return 0;
        });

        // Ajusta el acceso al arreglo según la estructura de `response`
        const dataArray = response.servicios || []; // Cambia `servicios` por la propiedad correcta si es diferente

        // trae las imagenes almacenadas en el JSON img-cards
        //this.imagenesCards();

        // Aquí se setean los valores en la propiedad `servicios`
        this.servicios = dataArray.map((item: any) => ({
          id: item.id,
          conciliacion: item.conciliacion,
          descripcion: item.descripcion,
          estado: item.estado,
          nombre: item.nombre,
          curso: item.curso.map((cursoItem: any) => ({
            descripcion: cursoItem.descripcion,
            edadMaxima: cursoItem.edadMaxima,
            edadMinima: cursoItem.edadMinima,
            estado: cursoItem.estado,
            etapa: {
              descripcion: cursoItem.etapa.descripcion,
              estado: cursoItem.etapa.estado,
              id: cursoItem.etapa.id,
              nombre: cursoItem.etapa.nombre
            },
            horario: {
              diaId: cursoItem.horario.diaId,
              horaFin: cursoItem.horario.horaFin,
              horaInicio: cursoItem.horario.horaInicio,
              horarioId: cursoItem.horario.horarioId,
              nombreDia: cursoItem.horario.nombreDia
            },
            id: cursoItem.id,
            modalidadDeportiva: {
              descripcion: cursoItem.modalidadDeportiva.descripcion,
              estado: cursoItem.modalidadDeportiva.estado,
              id: cursoItem.modalidadDeportiva.id,
              nombre: cursoItem.modalidadDeportiva.nombre
            },
            nombre: cursoItem.nombre,
            programacion: {
              ano: cursoItem.programacion.ano,
              cuposDisponibles: cursoItem.programacion.cuposDisponibles,
              cuposMinimos: cursoItem.programacion.cuposMinimos,
              cuposTotales: cursoItem.programacion.cuposTotales,
              fechaCorte: cursoItem.programacion.fechaCorte,
              fechaFin: cursoItem.programacion.fechaFin,
              fechaInicio: cursoItem.programacion.fechaInicio,
              periodo: cursoItem.programacion.periodo,
              programacionId: cursoItem.programacion.programacionId
            },
            sede: {
              departamentoId: cursoItem.sede.departamentoId,
              direccion: cursoItem.sede.direccion,
              estado: cursoItem.sede.estado,
              municipioId: cursoItem.sede.municipioId,
              nombreDepartamento: cursoItem.sede.nombreDepartamento,
              nombreMunicipio: cursoItem.sede.nombreMunicipio,
              nombreSede: cursoItem.sede.nombreSede,
              sedeId: cursoItem.sede.sedeId,
              telefono: cursoItem.sede.telefono
            }
          })),
          urlImagen: item.urlImagen
        }));

        dataArray.forEach(item => {
          if (Array.isArray(item.curso)) {
            item.curso.forEach(servicio => {
              if (servicio.sede) {
                ciudadMap.set(servicio.sede.municipioId, {
                  municipioId: servicio.sede.municipioId,
                  nombreMunicipio: servicio.sede.nombreMunicipio?.trim(), // quitamos espacios innecesarios
                });
              }
            });
          }
        });

        this.ciudades = Array.from(ciudadMap.values());

        this.ciudades = Array.from(ciudadMap.values());
        this.utilitiesService.servicios = this.servicios

        this.utilitiesService.loading = false;
      },
        error => {
          console.error('Error al consultar los cursos:', error);
          this.utilitiesService.loading = false;
        }
      );
  }

  imagenesCards() {
    this.dataServiciosCursos.getImagenes().subscribe((response: any) => {
      ////console.log(response)
      this.listadoImagenes = response

      // Asegúrate de que ambas listas tengan la misma longitud
      const minLength = Math.min(this.servicios.length, this.listadoImagenes.length);
      this.servicios = this.servicios.slice(0, minLength);
      this.listadoImagenes = this.listadoImagenes.slice(0, minLength);
    },
      error => {
        console.error('Error al consultar las imagenes:', error);
      }
    );

  }

  verDetalle(servicio: any) {
    console.log(this.ciudadSeleccionada)

    if (this.ciudadSeleccionada == 'default') {
      this.utilitiesService.messageTitleModal = "Atención";
      this.utilitiesService.messageModal = 'Debe selecionar un municipio.';
      this.utilitiesService.backLogin = false;
      $(".modalNuevowarning").click();

    } else {
      localStorage.setItem('idServicio', servicio.id);
      localStorage.setItem('idMunicipio', this.ciudadSeleccionada);
      this.utilitiesService.loading = true;

      // Redirigir a la ruta 'cursos' con el 'id' del servicio como parámetro
      this.router.navigate(['/cursos']);
    }



  }

  aplicarFiltros() {
    const municipioId = this.ciudadSeleccionada;

    const cursosFiltrados: any[] = [];

    // Recorremos la estructura original
    this.dataCursosOriginal.forEach(item => {
      if (Array.isArray(item.curso)) {
        const cursosFiltradosPorMunicipio = item.curso.filter(curso =>
          curso.sede && curso.sede.municipioId === municipioId
        );

        if (cursosFiltradosPorMunicipio.length > 0) {
          cursosFiltrados.push(...cursosFiltradosPorMunicipio);
        }
      }
    });

    // Asignamos la lista filtrada a la variable que se muestra en el HTML
    this.cursosVisibles = cursosFiltrados;
// Filtramos cada servicio, quedándonos solo con los cursos del municipio
  const serviciosFiltrados = this.servicios
    .map(servicio => ({
      ...servicio,
      cursos: servicio.curso.filter(curso => curso.sede.municipioId === Number(municipioId))
    }))
    // Ahora eliminamos los servicios sin cursos
    .filter(servicio => servicio.cursos.length > 0);
    
    console.log(this.servicios, this.cursosVisibles, 'servicios filtrados:',serviciosFiltrados);

    this.servicios = serviciosFiltrados;
  }

}
