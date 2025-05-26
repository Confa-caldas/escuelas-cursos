import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { first } from 'rxjs/operators';

import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import * as moment from 'moment';

//interfaces
import { MiPerfilConfa, Session, User, Usuario, selecPersona } from "src/app/interfaces/user.interface";

//servicios
import { DataServiciosCursos } from 'src/app/services/data-cursos.service'
import { UtilitiesService } from "src/app/services/utilities.service";
import { QuestionsService } from "src/app/services/questions.service";
import { AuthenticationService } from "src/app/services/authentication.service";

//componentes
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { TopMenuComponentComponent } from '../../shared/top-menu-component/top-menu-component.component'

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,
    TopMenuComponentComponent
  ],
  templateUrl: './cursos.component.html',
  styleUrl: './cursos.component.css'
})
export class CursosComponent {

  idServicio!: number;//id proporcionado por la ruta que hace referencia el servicio
  cursos: any[] = []; //lista original de cursos para el servicio
  sedes: any[] = []; // Lista de sedes únicas
  ciudades: any[] = []; // Lista de ciudades únicas
  niveles: any[] = []; // Lista de niveles únicas
  deportes: any[] = []; // Lista de deportes únicas
  edades: any[] = []; // Lista de edades únicas
  horarios: any[] = []; // Lista de horarios únicas
  servicios: any[] = [];  // Lista de servicios que estan activos

  sedeSeleccionada = 'default'; // Sede seleccionada para filtrar
  ciudadSeleccionada = 'default'; // ciudad seleccionada para filtrar
  nivelSeleccionado = 'default'; // nivel seleccionado para filtrar
  deporteSeleccionado = 'default';  // deporte seleccionado para filtrar
  edadSeleccionada = 'default';  // deporte seleccionado para filtrar
  horarioSeleccionada = 'default';  // deporte seleccionado para filtrar
  servicioActivo = 'default';  // deporte seleccionado para filtrar
  cursosFiltrados: any[] = [];  // Lista de cursos después de aplicar los filtros
  mostrarHorarios: boolean = false;


  userMiPerfil: MiPerfilConfa;
  usuario: User;
  fullName: string = "";
  document: string;
  documento: string;
  inactivarbotonSeleccionCurso: boolean;

  /* NgxPaginationModule */
  p: number = 1; // Página actual
  itemsPerPage: number = 4; // Elementos por página

  isAccordionOpen: boolean = false;
  preguntas = [];
  private _collection: any = [
    {
      title: "¿Cuándo son las inscripciones?",
      description: `<p>Los cursos deportivos de Natación, karate, exploración deportiva e iniciación deportiva se realizan por ciclos de 10 clases y las fechas de inscripción son las siguientes:</p>
              <ul>
                <li><strong>Ciclo 1:</strong> Inscripciones 21 de enero.</li>
                <li><strong>Ciclo 2:</strong> Inscripciones 8 de abril.</li>
                <li><strong>Ciclo 3:</strong> Inscripciones 17 de junio.</li>
                <li><strong>Ciclo 4:</strong> Inscripciones 2 de septiembre.</li>
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
    private route: ActivatedRoute,
    public utilitiesService: UtilitiesService,
    public questionsService: QuestionsService,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService,
    private dataServiciosCursos: DataServiciosCursos) {
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
        this.authenticationService
          .loginNew(ptoken.token)
          .pipe(first())
          .subscribe((response: Session) => {
            this.utilitiesService.currentUser = response.usuario;
            if (response.usuario.existeUsuario) {
              localStorage.setItem("user", JSON.stringify(response));
              localStorage.setItem("cc", response.usuario.documento);
              this.document = response.usuario.documento;
              //this.utilitiesService.loading = true;
              //this.consultarInformacionMiPerfilConfa(this.document);
            }
          });
    }
  }

  ngOnInit() {
    this.preguntas = this._collection;
    this.consultarCursos();
    this.consultarInformacionMiPerfilConfa(this.document);
  }

  toggleAccordion(index: number): void {
    this._collection.forEach((item, i) => {
      item.open = i === index ? !item.open : false;
    });
  }

  toggleHorarios() {
    this.mostrarHorarios = !this.mostrarHorarios;
  }

  consultarInformacionMiPerfilConfa(documento: string) {
    const infoUser = JSON.parse(localStorage.getItem("user"));
    console.log(infoUser)
        this.userMiPerfil = infoUser.user;
        //this.documento = infoUser.usuario.documento;
        this.fullName = `${infoUser.usuario.primerNombre} ${infoUser.usuario.segundoNombre} ${infoUser.usuario.primerApellido} ${infoUser.usuario.segundoApellido}`;
        this.utilitiesService.loading = false;
        this.utilitiesService.fullNameUser =`${infoUser.usuario.primerNombre} ${infoUser.usuario.segundoNombre} ${infoUser.usuario.primerApellido} ${infoUser.usuario.segundoApellido}`;
        this.utilitiesService.documentUser = infoUser.usuario.documento;
        this.utilitiesService.direccionResidencia = infoUser.usuario.direccion;
        this.utilitiesService.celular = infoUser.usuario.celular;
        this.utilitiesService.genero = infoUser.usuario.genero;
  }

  navigate() {
    this.router.navigate(["/historico"]);
  }

  atras() {
    this.utilitiesService.loading = true;
    setTimeout(() => {
      this.utilitiesService.loading = false;
      this.utilitiesService.changePass = false;
      this.utilitiesService.updateInfo = false;
      this.utilitiesService.miPerfil = true;
      this.router.navigate(["/home"]);
    }, 500);
  }


  isMenuVisible(): boolean {
    const routesWithMenu = ['/cursos', '/asistente', '/resumen'];
    return routesWithMenu.includes(this.router.url);
  }

  consultarCursos() {
    this.utilitiesService.loading = true;
    const idServicio = Number(localStorage.getItem('idServicio'));
    const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const ordenarHorarios = (horarios: { nombreDia: string }[]): { nombreDia: string }[] => {
      return horarios.sort((a, b) => {
        const indiceA = diasOrdenados.indexOf(a.nombreDia.trim());
        const indiceB = diasOrdenados.indexOf(b.nombreDia.trim());
        return indiceA - indiceB;  // Cambiar a `indiceB - indiceA` para orden descendente
      });
    };

    this.dataServiciosCursos.getServicios().pipe(first())
      .subscribe((response: any) => {
        const servicios = response.servicios || [];
        const servicioFiltrado = servicios.find(servicio => servicio.id === idServicio);

        this.utilitiesService.loading = false;

        if (servicioFiltrado) {
          this.cursos = servicioFiltrado.curso || [];
          this.cursosFiltrados = [...this.cursos]; // Clona el array original

          // Cambia el formato de las horas para visualización y ordena los horarios
          this.cursosFiltrados.forEach(curso => {
            /* //console.log(curso.programacion.cuposDisponibles); */

            if (curso.programacion.cuposDisponibles === 0) {
              this.inactivarbotonSeleccionCurso = true;
            }

            if (curso.horario && Array.isArray(curso.horario)) {
              curso.horario.forEach(horario => {
                if (horario.horaInicio) {
                  horario.horaInicio = moment(horario.horaInicio, "HH:mm:ss").format("h:mm A");
                }
                if (horario.horaFin) {
                  horario.horaFin = moment(horario.horaFin, "HH:mm:ss").format("h:mm A");
                }
              });

              // Ordena los horarios del curso
              curso.horario = ordenarHorarios(curso.horario);
            }

          });

          // Inicializa las opciones de filtros
          this.actualizarOpcionesFiltros(this.cursos);
        } else {
          this.cursos = [];
          this.cursosFiltrados = [];
        }
      },
        error => {
          console.error('Error al consultar los cursos:', error);
        });
  }

  // Método para recalcular las opciones únicas de filtros
  actualizarOpcionesFiltros(cursos: any[]) {
    const sedesMap = new Map();
    const ciudadMap = new Map();
    const nivelMap = new Map();
    const deporteMap = new Map();
    const edadMap = new Map();
    const horarioMap = new Map();

    /*   //console.log(cursos, "Cursos") */

    cursos.forEach(servicio => {
      if (servicio.sede) {
        sedesMap.set(servicio.sede.sedeId, servicio.sede);
        ciudadMap.set(servicio.sede.municipioId, servicio.sede);
      }

      if (servicio.etapa) {
        nivelMap.set(servicio.etapa.id, servicio.etapa);
      }

      if (servicio.modalidadDeportiva) {
        deporteMap.set(servicio.modalidadDeportiva.id, servicio.modalidadDeportiva);
      }


      if (servicio.horario && Array.isArray(servicio.horario)) {
        servicio.horario.forEach(horario => {
          horarioMap.set(horario.horarioId, horario);

        });
      }
      /* //console.log(Array.from(horarioMap.values())) */

      const rangos = cursos.map(curso => ({
        min: curso.edadMinima,
        max: curso.edadMaxima,
        id: curso.id, //391
      }));
      
      this.edades = rangos.filter(
        (rango, index, self) =>
          index === self.findIndex(r => r.min === rango.min && r.max === rango.max)
      ).sort((a, b) => a.min - b.min); // Ordenar por edad mínima
      
    });

    // Actualiza las opciones de los filtros
    this.sedes = Array.from(sedesMap.values());
    this.ciudades = Array.from(ciudadMap.values());
    this.niveles = Array.from(nivelMap.values());
    this.deportes = Array.from(deporteMap.values());
    this.horarios = Array.from(horarioMap.values());

    //console.log(this.edades, 'Edades')
  }


  // Método para aplicar los filtros seleccionados
  aplicarFiltros() {
    let cursosFiltrados = [...this.cursos]; // Siempre trabaja sobre el conjunto original

    if (this.ciudadSeleccionada !== 'default') {
      const ciudadSeleccionada = Number(this.ciudadSeleccionada);
      cursosFiltrados = cursosFiltrados.filter(curso => curso.sede.municipioId === ciudadSeleccionada);
    }

    if (this.sedeSeleccionada !== 'default') {
      const sedeIdSeleccionado = Number(this.sedeSeleccionada);
      cursosFiltrados = cursosFiltrados.filter(curso => curso.sede.sedeId === sedeIdSeleccionado);
    }

    if (this.nivelSeleccionado !== 'default') {
      const nivelSeleccionado = Number(this.nivelSeleccionado);
      cursosFiltrados = cursosFiltrados.filter(curso => curso.etapa.id === nivelSeleccionado);
    }

    if (this.deporteSeleccionado !== 'default') {
      const deporteSeleccionado = Number(this.deporteSeleccionado);
      cursosFiltrados = cursosFiltrados.filter(curso => curso.modalidadDeportiva.id === deporteSeleccionado);
      //cursosFiltrados = cursosFiltrados.filter(curso => curso.id === deporteSeleccionado);
    }

   /*  if (this.edadSeleccionada !== 'default') {
      const [minEdad, maxEdad] = this.edadSeleccionada.split('-').map(Number);
      cursosFiltrados = cursosFiltrados.filter(curso =>
        curso.edadMinima >= minEdad && curso.edadMaxima <= maxEdad
      );
    } */

     if (this.edadSeleccionada !== 'default') {
      const edadSeleccionada = Number(this.edadSeleccionada);
      const [minEdad, maxEdad] = this.edadSeleccionada.split('-').map(Number);
      console.log(minEdad)
      cursosFiltrados = cursosFiltrados.filter(curso => curso.edadMinima === minEdad && curso.edadMaxima <= maxEdad);
    }

    

    if (this.horarioSeleccionada !== 'default') {
      const horarioSeleccionada = Number(this.horarioSeleccionada); // Asegúrate de convertirlo a número
      cursosFiltrados = cursosFiltrados.filter(curso =>
        curso.horario?.some(horario => horario.horarioId === horarioSeleccionada)
      );
    }

    /* if (this.horarioSeleccionada !== 'default') {
      const horarioSeleccionada = Number(this.horarioSeleccionada);
      cursosFiltrados = cursosFiltrados.filter(curso =>  
        //horario => horario.horarioId === horarioSeleccionada 
        curso.horarios?.some(horario => horario.horarioId === horarioSeleccionada)
      );
    } */

    // Actualiza los cursos filtrados y recalcula las opciones de filtros
    this.cursosFiltrados = cursosFiltrados;
    this.actualizarOpcionesFiltros(cursosFiltrados);
  }



  limpiarFiltros() {
    this.ciudadSeleccionada = 'default';
    this.sedeSeleccionada = 'default';
    this.nivelSeleccionado = 'default';
    this.deporteSeleccionado = 'default';
    this.edadSeleccionada = 'default';
    this.horarioSeleccionada = 'default';
    this.servicioActivo = 'default';

    this.consultarCursos();// Restablece los cursos originales


  }

  cursoSeleccionado(curso: any) {

    this.utilitiesService.curso = curso;

    const horario = moment(curso.horario.horaInicio, "HH:mm:ss").format("h:mm A");

    this.utilitiesService.ciudadCurso = curso.sede.nombreMunicipio
    this.utilitiesService.actividadCurso = curso.nombre
    this.utilitiesService.ubicacionCurso = curso.sede.nombreSede
    this.utilitiesService.edadNivelCurso = curso.edadMinima + ' a ' + curso.edadMaxima + ' - ' + curso.etapa.nombre
    this.utilitiesService.horarioCurso = curso.horario
    this.utilitiesService.fechaInicioFin = 'Desde ' + curso.programacion.fechaInicio + ' a ' + curso.programacion.fechaFin

    this.utilitiesService.edadMin = curso.edadMinima
    this.utilitiesService.edadMax = curso.edadMaxima

    /* //console.log(this.utilitiesService.horarioCurso)
    //console.log(curso.horario) */

    this.router.navigate(["/asistente"]);
  }
}
