
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
  serviciosFiltradosFinal: Servicio[] = [];
  dataCursosOriginal: any[] = []; // estructura original con [{ curso: [...] }]
  cursosVisibles: any[] = []; // estructura original con [{ curso: [...] }]

  isAccordionOpen: boolean = false;
  preguntas = [];
  private _collection: any = [
    {
      title: "¿Cuándo son las inscripciones?",
      description: `<p>Los cursos deportivos de Natación, karate, exploración deportiva e iniciación deportiva se realizan por ciclos de 10 clases y las fechas de inscripción son las siguientes:</p>
              <ul>
                <li><strong>Ciclo 1:</strong> Inscripciones 7 de enero.</li>
                <li><strong>Ciclo 2:</strong> Inscripciones 8 de abril.</li>
                <li><strong>Ciclo 3:</strong> Inscripciones 24 de junio.</li>
                <li><strong>Ciclo 4:</strong> Inscripciones 16 de septiembre.</li>
              </ul>
              <p>Cursos de actividad física como yoga, clases al parque, baile para mayores, actividad física para mayores de 60 años, las matrículas son la última semana de cada mes.</p>`,
      open: false,
    },
    {
      title: "¿Cuándo se realizan los cursos deportivos Confa?",
      description: `Los cursos deportivos de Natación, karate, Exploración Deportiva e Iniciación deportiva se realizan en ciclos de 10 clases que es aproximadamente 2.5 meses. Los cursos de actividad física como yoga, baile para mayores, clases al parque, entre otras, son de periodicidad mensual.`,
      open: false,
    },
    {
      title: "¿Dónde se ofrecen las clases de los cursos de Formación deportiva?",
      description: `<ul>
                <li><strong>Natación Manizales:</strong> Complejo Acuático del Bosque Popular.</li>
                <li><strong>Natación Santágueda:</strong> Centro Recreacional Santágueda.</li>
                <li><strong>Natación Dorada:</strong> Centro Recreacional Alegría Tropical.</li>
                <li><strong>Karate:</strong> Confa sede La Asunción Manizales y en Versalles Plaza.</li>
                <li><strong>Danzeatro:</strong> Municipio de Chinchiná.</li>
                <li><strong>Iniciación deportiva y exploración motriz:</strong> Confa sede La Asunción Manizales y sede Versalles Plaza Manizales.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Qué se requiere para las clases de natación?",
      description: `Es indispensable que el estudiante lleve gorro, vestido de baño y chanclas adecuadas para cuando se sale del agua.`,
      open: false,
    },
    {
      title: "¿Los bebés siempre deben entrar al agua con el padre de familia?",
      description: `Sí, estudiantes hasta los 5 años deben ingresar con el acudiente.`,
      open: false,
    },
    {
      title: "¿Cuáles son los niveles del curso de natación?",
      description: `<ul>
                <li><strong>Nivel básico:</strong> No sabe nada o apenas está empezando.</li>
                <li><strong>Nivel intermedio:</strong> Conoce algo de técnica de libre y espalda.</li>
                <li><strong>Nivel avanzado:</strong> Ya domina los estilos libre, espalda y pecho.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Cuánto tiempo tengo que quedarme en el mismo nivel?",
      description: `<p>Se debe permanecer en el mismo nivel hasta que se desarrollen las habilidades necesarias para poder avanzar al siguiente nivel y se alcancen los objetivos propuestos. Pueden repetir el nivel. Al iniciar cada nivel, los profesores hacen una evaluación de entrada en la que verifican sus capacidades y recomiendan seguir en el mismo nivel o pasar al siguiente siempre y cuando se puedan mover de manera interna.</p>`,
      open: false,
    },
    {
      title: "¿Por ser antiguo tengo prioridad en la inscripción?",
      description: `<ul>
                <li>No, la inscripción es abierta al público y no prioriza antigüedad.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Desde qué edad se puede practicar karate en los cursos deportivos de Confa?",
      description: `<ul>
                <li>Desde los 0 meses hasta los 59 años y de 60 a más años para los programas de adulto mayor. Para los bebés, y buscando evitar enfermedades de otitis, se recomienda a partir de los 6 meses.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Se requiere uniforme para practicar karate?",
      description: `<ul>
                <li>No es obligatorio, se puede asistir con ropa deportiva y a medida que se desarrolle el gusto por la disciplina asesoramos para conseguirlo.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Qué se ve en el curso de Iniciación deportiva? ¿Quiénes se pueden inscribir?",
      description: `<ul>
                <li>Los niños experimentan con diferentes deportes, aprenden los fundamentos básicos e identifican sus fortalezas para practicarlo. Buscamos que conozcan variedad de deportes y desarrollen técnicas básicas. Pueden inscribirse niños entre los 6 y 8 años.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Qué se ve en el curso de exploración motriz? ¿Quiénes se pueden inscribir?",
      description: `<ul>
                <li>Estimulamos los patrones básicos de movimientos como correr, saltar, atrapar, patear, girar, entre otras. Pueden inscribirse niños entre los 3 y 5 años.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Cuánto tiempo dura un ciclo de los cursos deportivos?",
      description: `<ul>
                <li>Cada ciclo consta de 10 clases, una a la semana, con duración de 1 hora cada clase. (Aproximadamente 2 meses y medio)</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Puedo inscribir a mi hijo a varios cursos al mismo tiempo?",
      description: `<ul>
                <li>Los niños pueden estar en varios cursos siempre y cuando se cumpla con los requisitos de edad y que los horarios no se crucen entre sí. Se debe realizar el pago de la tarifa de inscripción correspondiente a cada uno de los cursos en los que se inscriba.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿De qué consta el curso de Karate?",
      description: `<ul>
                <li>En este curso se fortalecen conocimientos en un arte marcial que se convierte en un estilo de vida. Favorece aspectos como la respiración adecuada y consciente, la coordinación y la concentración, el autocontrol, autoconocimiento y otras habilidades importantes en la vida diaria. Cabe aclarar que en esta disciplina no hay contacto físico entre los deportistas.</li>
              </ul>`,
      open: false,
    },
    {
      title: "¿Qué niveles tienen en la escuela de Karate Confa?",
      description: ` Se tiene solo un nivel pero cada persona avanzará con esquema de cinturones:<ul>
                <li> Principiantes (Cinturones blanco, amarillo y naranja).</li>
                <li> Intermedios (Cinturones verdes y azules).</li>
                <li> Avanzados (Cinturones violetas, marrones y negros).</li>
              </ul>`,
      open: false,
    },
  ];

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
          console.log(response);
          if (response.usuario.existeUsuario) {
            localStorage.setItem("user", JSON.stringify(response));
            localStorage.setItem("cc", response.usuario.documento);
            this.document = response.usuario.documento;
            this.utilitiesService.loading = true;
            this.consultarInformacionMiPerfilConfa(this.document);
          } else {
            location.reload();
          }
        });
        console.log(this.utilitiesService.currentUser);
    }
  }

  ngOnInit() {
    //Llamamos modal de la sugerencia de seguridad
    this.utilitiesService.loading = true;
    this.consultarCursos();
    this.preguntas = this._collection;
  }
  toggleAccordion(index: number): void {
    this._collection.forEach((item, i) => {
      item.open = i === index ? !item.open : false;
    });
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
        this.serviciosFiltradosFinal = this.utilitiesService.servicios
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

    console.log(this.servicios, this.cursosVisibles, 'servicios filtrados:', serviciosFiltrados);

    //this.servicios = serviciosFiltrados;
    this.serviciosFiltradosFinal = serviciosFiltrados
  }

}
