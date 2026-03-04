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
  mostrarCuros: boolean = false;

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
                <li><strong>Ciclo 4:</strong> Inscripciones 3 de septiembre.</li>
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
          this.utilitiesService.messageLoading = null;
          if (response.usuario.existeUsuario) {
            localStorage.setItem("user", JSON.stringify(response));
            localStorage.setItem("cc", response.usuario.documento);
            this.document = response.usuario.documento;
            this.utilitiesService.fullNameUser = `${response.usuario.primerNombre} ${response.usuario.segundoNombre} ${response.usuario.primerApellido} ${response.usuario.segundoApellido}`;
            //this.utilitiesService.fullNameUser = this.utilitiesService.currentUser.nombreBeneficiario
            //this.utilitiesService.loading = true;
            //this.consultarInformacionMiPerfilConfa(this.document);
          } else {
            location.reload();
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
    this.utilitiesService.fullNameUser = `${infoUser.usuario.primerNombre} ${infoUser.usuario.segundoNombre} ${infoUser.usuario.primerApellido} ${infoUser.usuario.segundoApellido}`;
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
    const idMunicipio = Number(localStorage.getItem('idMunicipio'));

    const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    const ordenarHorarios = (horarios: { nombreDia: string }[]): { nombreDia: string }[] => {
      return horarios.sort((a, b) => {
        const indiceA = diasOrdenados.indexOf(a.nombreDia.trim());
        const indiceB = diasOrdenados.indexOf(b.nombreDia.trim());
        return indiceA - indiceB;
      });
    };

    this.dataServiciosCursos.getServicios().pipe(first())
      .subscribe((response: any) => {
        const servicios = response.servicios || [];
        const servicioFiltradoCursos = servicios.find(servicio => servicio.id === idServicio);

        if (!servicioFiltradoCursos || !servicioFiltradoCursos.curso) {
          this.cursos = [];
          this.cursosFiltrados = [];
          this.deportes = [];
          this.utilitiesService.loading = false;
          return;
        }

        // 🔹 Primero filtrar los cursos por municipio
        const cursos = servicioFiltradoCursos.curso;
        const servicioFiltrado = cursos.filter(c => c.sede?.municipioId === idMunicipio);

        // 🔹 Si no hay cursos, limpiar todo
        if (!servicioFiltrado.length) {
          this.cursos = [];
          this.cursosFiltrados = [];
          this.deportes = [];
          this.utilitiesService.loading = false;
          return;
        }

        // 🔹 Ahora sí: cargar solo los deportes con cursos en ese municipio
        const deporteMap = new Map();
        servicioFiltrado.forEach(cur => {
          if (cur.modalidadDeportiva) {
            deporteMap.set(cur.modalidadDeportiva.id, cur.modalidadDeportiva);
          }
        });
        this.deportes = Array.from(deporteMap.values());

        // 🔹 Asignar cursos
        this.cursos = servicioFiltrado;
        this.cursosFiltrados = [...this.cursos];

        // 🔹 Ajustar horarios
        this.cursosFiltrados.forEach(curso => {
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

            curso.horario = ordenarHorarios(curso.horario);
          }
        });

        // 🔹 Actualizar opciones de filtros
        this.actualizarOpcionesFiltros(this.cursos);

        this.utilitiesService.loading = false;
      },
        error => {
          console.error('Error al consultar los cursos:', error);
          this.utilitiesService.loading = false;
        });
  }



  /**
   * Resetea a 'default' los filtros inferiores al nivel indicado (cascada).
   * Gestiona la limpieza sistemática: al cambiar un filtro superior, los inferiores se invalidan.
   * @param desde - Desde qué nivel de la jerarquía (Curso > Nivel > Sede > Edad > Horario) resetear hacia abajo.
   */
  resetFiltrosInferiores(desde: 'nivel' | 'sede' | 'edad' | 'horario'): void {
    if (desde === 'nivel') {
      this.nivelSeleccionado = 'default';
      this.sedeSeleccionada = 'default';
      this.edadSeleccionada = 'default';
      this.horarioSeleccionada = 'default';
    } else if (desde === 'sede') {
      this.sedeSeleccionada = 'default';
      this.edadSeleccionada = 'default';
      this.horarioSeleccionada = 'default';
    } else if (desde === 'edad') {
      this.edadSeleccionada = 'default';
      this.horarioSeleccionada = 'default';
    } else {
      this.horarioSeleccionada = 'default';
    }
  }

  /**
   * Devuelve this.cursos filtrado solo por los criterios hasta el nivel indicado (sin aplicar horario).
   * Usado para recalcular las opciones de los desplegables inferiores en la cascada.
   * @param nivel - Hasta qué nivel aplicar filtros: 'curso' (solo deporte), 'nivel', 'sede' o 'edad'.
   */
  getCursosFiltradosHastaNivel(nivel: 'curso' | 'nivel' | 'sede' | 'edad'): any[] {
    let list = [...this.cursos];

    if (this.ciudadSeleccionada !== 'default') {
      list = list.filter(c => c.sede?.municipioId === Number(this.ciudadSeleccionada));
    }
    if (this.deporteSeleccionado !== 'default') {
      list = list.filter(c => c.modalidadDeportiva?.id === Number(this.deporteSeleccionado));
    }
    if (nivel === 'curso') return list;

    if (this.nivelSeleccionado !== 'default') {
      list = list.filter(c => c.etapa?.id === Number(this.nivelSeleccionado));
    }
    if (nivel === 'nivel') return list;

    if (this.sedeSeleccionada !== 'default') {
      list = list.filter(c => c.sede?.sedeId === Number(this.sedeSeleccionada));
    }
    if (nivel === 'sede') return list;

    if (this.edadSeleccionada !== 'default') {
      const [minEdad, maxEdad] = this.edadSeleccionada.split('-').map(Number);
      list = list.filter(c => c.edadMinima === minEdad && c.edadMaxima <= maxEdad);
    }
    return list;
  }

  /**
   * Recalcula las opciones de los filtros a partir de los cursos pasados.
   * this.deportes no se modifica (siempre muestra todas las opciones del municipio).
   * Solo actualiza las listas indicadas en opciones para mantener las opciones visibles en los selectores superiores.
   * @param cursos - Cursos ya filtrados por los criterios superiores de la cascada.
   * @param opciones - Qué listas actualizar. Si no se pasa, se actualizan todas (niveles, sedes, edades, horarios).
   */
  actualizarOpcionesFiltros(
    cursos: any[],
    opciones?: { niveles?: boolean; sedes?: boolean; edades?: boolean; horarios?: boolean }
  ): void {
    const actualizarTodo = opciones == null;
    const sedesMap = new Map();
    const ciudadMap = new Map();
    const nivelMap = new Map();
    const edadMap = new Map();
    const horarioMap = new Map();

    cursos.forEach(servicio => {
      if (servicio.sede) {
        sedesMap.set(servicio.sede.sedeId, servicio.sede);
        ciudadMap.set(servicio.sede.municipioId, servicio.sede);
      }
      if (servicio.etapa) {
        nivelMap.set(servicio.etapa.id, servicio.etapa);
      }
      if (servicio.horario && Array.isArray(servicio.horario)) {
        servicio.horario.forEach((horario: any) => horarioMap.set(horario.horarioId, horario));
      }
    });

    const rangos = cursos.map(curso => ({
      min: curso.edadMinima,
      max: curso.edadMaxima,
      id: curso.id,
    }));
    const edadesUnicas = rangos.filter(
      (rango, index, self) =>
        index === self.findIndex(r => r.min === rango.min && r.max === rango.max)
    ).sort((a, b) => a.min - b.min);

    if (actualizarTodo || opciones?.niveles) {
      this.niveles = Array.from(nivelMap.values()).sort((a, b) =>
        (a.nombre || '').localeCompare(b.nombre || '', 'es')
      );
    }
    if (actualizarTodo || opciones?.sedes) {
      this.sedes = Array.from(sedesMap.values());
      this.ciudades = Array.from(ciudadMap.values());
    }
    if (actualizarTodo || opciones?.edades) {
      this.edades = edadesUnicas;
    }
    if (actualizarTodo || opciones?.horarios) {
      this.horarios = Array.from(horarioMap.values());
    }
  }

  /**
   * Única responsabilidad: genera this.cursosFiltrados aplicando todos los criterios activos en cascada
   * (ciudad, curso, nivel, sede, edad, horario). No resetea ni actualiza opciones de los desplegables.
   */
  aplicarFiltros(): void {
    let list = [...this.cursos];

    if (this.ciudadSeleccionada !== 'default') {
      list = list.filter(c => c.sede?.municipioId === Number(this.ciudadSeleccionada));
    }
    if (this.deporteSeleccionado !== 'default') {
      list = list.filter(c => c.modalidadDeportiva?.id === Number(this.deporteSeleccionado));
    }
    if (this.nivelSeleccionado !== 'default') {
      list = list.filter(c => c.etapa?.id === Number(this.nivelSeleccionado));
    }
    if (this.sedeSeleccionada !== 'default') {
      list = list.filter(c => c.sede?.sedeId === Number(this.sedeSeleccionada));
    }
    if (this.edadSeleccionada !== 'default') {
      const [minEdad, maxEdad] = this.edadSeleccionada.split('-').map(Number);
      list = list.filter(c => c.edadMinima === minEdad && c.edadMaxima <= maxEdad);
    }
    if (this.horarioSeleccionada !== 'default') {
      const horarioId = Number(this.horarioSeleccionada);
      list = list.filter(c => c.horario?.some((h: any) => h.horarioId === horarioId));
    }

    this.cursosFiltrados = list;
    this.p = 1;
  }

  /** Cascada nivel Curso: resetea Nivel, Sede, Edad y Horario; actualiza todas las opciones inferiores; aplica filtros. */
  onCursoChange(): void {
    this.resetFiltrosInferiores('nivel');
    this.actualizarOpcionesFiltros(this.getCursosFiltradosHastaNivel('curso'));
    this.aplicarFiltros();
  }

  /** Cascada nivel Nivel: resetea Sede, Edad y Horario; actualiza solo opciones de Sede, Edad y Horario (mantiene Nivel). */
  onNivelChange(): void {
    this.resetFiltrosInferiores('sede');
    this.actualizarOpcionesFiltros(this.getCursosFiltradosHastaNivel('nivel'), {
      sedes: true,
      edades: true,
      horarios: true,
    });
    this.aplicarFiltros();
  }

  /** Cascada nivel Sede: resetea Edad y Horario; actualiza solo opciones de Edad y Horario (mantiene Nivel y Sede). */
  onSedeChange(): void {
    this.resetFiltrosInferiores('edad');
    this.actualizarOpcionesFiltros(this.getCursosFiltradosHastaNivel('sede'), {
      edades: true,
      horarios: true,
    });
    this.aplicarFiltros();
  }

  /** Cascada nivel Edad: resetea Horario; actualiza solo opciones de Horario (mantiene Nivel, Sede y Edad). */
  onEdadChange(): void {
    this.resetFiltrosInferiores('horario');
    this.actualizarOpcionesFiltros(this.getCursosFiltradosHastaNivel('edad'), {
      horarios: true,
    });
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    //this.ciudadSeleccionada = 'default';
    this.sedeSeleccionada = 'default';
    this.nivelSeleccionado = 'default';
    //this.deporteSeleccionado = 'default';
    this.edadSeleccionada = 'default';
    this.horarioSeleccionada = 'default';
    this.servicioActivo = 'default';
    //this.consultarCursos();// Restablece los cursos originales
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

    this.mostrarCuros = false;

    this.router.navigate(["/asistente"]);
  }


  /** Muestra la grilla de resultados aplicando los filtros actuales (solo aplica filtros, no limpia). */
  mostrar(): void {
    this.mostrarCuros = true;
    this.aplicarFiltros();
  }
}
