const days = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "viernes",
  "Sabado"
  ];
  
  const dailyEvents = {

  0: {
    title: "Domingo",
    tasks: [
      "Preparar recursos para el VS",
      "Guardar aceleradores",
      "Coordinar estrategias con la alianza"
    ]
  },

  1: {
    title: "Lunes",
    tasks: [
      "Tareas de radar (Guardar las tareas un dia antes)",

      "Gastar energia (Atacando dooms o bien zombies)",

      "Recolectando oro, hierro o madera (Dejarlo la noche de antes. y si estais trabajando mientras esteis en horario de trabajo dejar recolectando igual)",

      "Subir de nivel del dron (Solo subimos el nivel del dron y si nos pide piezas de dron, nos dara mas puntos)",

      "Abrir los cofres de chip de dron (Los cofres de CHIPS son los que si tenemos que abrir, TENER CUIDADO NO SON LOS COFRES DE COMPLEMENTOS DE DRON)"
    ]
  },

  2: {
    title: "Martes",
    tasks: [
      "Construccion (Intentar guardar construcciones sin abrir el regalo una vez haya terminado y abrir los regalos los MARTES, eso hara que sume puntos)",

      "Aceleradores construccion (usar todo tipo de aceleradores pero solo para las construcciones de este dia, os daran puntos por dos: Finalizar construccion y por gastar aceleradores)",

      "Camiones UR (Los MARTES solo se pondran camiones de nivel UR para que puntue bien en el vs)",

      "Tareas secretas (Los MARTES solo se cogeran tareas secretas de nivel UR) (si os quedais sin tickets avisarnos)",

      "Reclutamiento de supervivientes (Guardar tickets de reclutamientos, para que los MARTES utiliceis los de supervivientes eso hara que ganeis puntos)"
    ]
  },

  3: {
    title: "Miércoles",
    tasks: [
      "Tareas de radar (Guardar las tareas un dia antes)",

      "Investigaciones (Investigar todo lo posible el dia MIERCOLES , para que puntue todo)",

      "Aceleradores de investigación (Usar todo tipo de aceleradores de investigación solo para los MIERCOLES)",

      "Abrir los cofres de complementos de dron (Para todo el MIERCOLES abrir todo esos cofres no guardéis ninguno pero solo para el MIERCOLES una vez termine el Miércoles, volver a guardar todos)"
    ]
  },

  4: {
    title: "Jueves",
    tasks: [
      "Reclutamiento de Heroes (Guardar tickets de reclutamientos, para que los JUEVES utiliceis los de heroes eso hara que ganeis puntos)",

      "Gastar experiencia Heroe (Gastar todas las experiencia de héroes. Se consigue atacando dooms, zombies o haciendo las pruebas de los héroes)",

      "Gastar todos los fragmentos de los héroes (si no teneis a kim a 5 estrellas SUBIRLA A TOPE)"
    ]
  },

  5: {
    title: "Viernes",
    tasks: [
      "Tareas de radar (Guardar las tareas un dia antes)",

      "Construcción (Intentar guardar construcciones sin abrir el regalo una vez haya terminado y abrir los regalos los VIERNES, eso hara que sume puntos)",

      "Investigaciones (Investigar todo lo posible el dia VIERNES , para que puntue todo)",

      "Aceleradores construccion (usar todo tipo de aceleradores pero solo para las construcciones de este dia, os daran puntos por dos: Finalizar construccion y por gastar aceleradores)",

      "Aceleradores de investigación (Usar todo tipo de aceleradores de investigación para el VIERNES)",

      "Reclutar tropas y Acelerarlas (Usar todos los aceleradores posibles para conseguir el máximo de tropas el VIERNES, eso hará que ganéis la mayoría de puntos)"
    ]
  },

  6: {
    title: "Sábado",
    tasks: [
      "Aceleradores construccion (usar todo tipo de aceleradores pero solo para las construcciones de este dia, os daran puntos por gastar aceleradores)",

      "Aceleradores de investigación (Usar todo tipo de aceleradores de investigación para el SABADO)",

      "Acelerar tropas (Usar todos los aceleradores posibles para conseguir el máximo de tropas el SABADO, eso hará que ganéis la mayoría de puntos)",

      "Camiones UR (Los SABADOS solo se pondran camiones de nivel UR para que puntue bien en el vs)",

      "Tareas secretas (Los MARTES solo se cogeran tareas secretas de nivel UR) (si os quedais sin tickets avisarnos)",

      "SI NO VAIS ATACAR A LAS 04:00 A.M, TODO EL MUNDO SE PONE ESCUDO",

      "Cada muerte de soldados enemigos os darán puntos (esos puntos cuanto mejor tropas tenga el enemigo mas puntos dará)",

      "CASTIGO: Todo el que no tenga escudo será revisado por los R4/R5 y podrá ser expulsado"
    ]
  }

}

export { days, dailyEvents };