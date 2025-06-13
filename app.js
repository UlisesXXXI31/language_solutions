// Datos ejemplo de lecciones y palabras
// Datos de las lecciones (esto sería el contenido de palabras.js)
// Variables globales
// Variables globales
 // Variables globales
// Variables globales
let puntos = 0;
let leccionActual = null;
let actividadActual = null;

const pantallaInicio = document.getElementById("pantalla-inicio");
const pantallaLecciones = document.getElementById("pantalla-lecciones");
const pantallaActividades = document.getElementById("pantalla-actividades");
const pantallaActividad = document.getElementById("pantalla-actividad");

const leccionesContainer = document.getElementById("lecciones-container");
const actividadesContainer = document.getElementById("actividades-container");
const actividadJuego = document.getElementById("actividad-juego");

const tituloLeccion = document.getElementById("titulo-leccion");
const tituloActividad = document.getElementById("titulo-actividad");
const puntosTexto = document.getElementById("puntos");
const btnReiniciarPuntos = document.getElementById("btn-reiniciar-puntos");
const btnVolverLecciones = document.getElementById("btn-volver-lecciones");
const sonidoCorrcto = new Audio("correcto.mp3");
const sonidoIncorrecto= new Audio("incorrecto.mp3");

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(reg => console.log('Service Worker registrado con éxito:', reg))
    .catch(err => console.log('Error al registrar el Service Worker:', err));
}

// Mostrar/Ocultar pantallas
function mostrarPantalla(idPantalla) {
  const pantallas = document.querySelectorAll(".pantalla");
  pantallas.forEach(p => {
    p.classList.remove("pantalla-activa");
    p.classList.add("pantalla-oculta");
  });
  const pantalla = document.getElementById(idPantalla);
  if (pantalla) {
    pantalla.classList.remove("pantalla-oculta");
    pantalla.classList.add("pantalla-activa");
  }
}

// Mostrar lista de lecciones
function mostrarLecciones() {
  leccionesContainer.innerHTML = "";
  datosLecciones.lecciones.forEach(leccion => {
    const btn = document.createElement("button");
    btn.textContent = leccion.nombre;
    btn.className = "leccion-btn";
    btn.addEventListener("click", () => {
      seleccionarLeccion(leccion);
    });
    leccionesContainer.appendChild(btn);
  });
}

// Seleccionar lección
function seleccionarLeccion(leccion) {
  leccionActual = leccion;
  tituloLeccion.textContent = `Lección: ${leccion.nombre}`;
  mostrarActividades();
  mostrarPantalla("pantalla-actividades");
}

// Mostrar actividades
function mostrarActividades() {
  actividadesContainer.innerHTML = "";

  const actividades = [
    { id: "traducir", nombre: "Traducir" },
    { id: "emparejar", nombre: "Emparejar" },
    { id: "eleccion-multiple", nombre: "Elección múltiple" },
    { id: "escuchar", nombre: "Escuchar" }
  ];

  actividades.forEach(act => {
    const btn = document.createElement("button");
    btn.textContent = act.nombre;
    btn.className = "actividad-btn";
    btn.addEventListener("click", () => {
      iniciarActividad(act.id);
    });
    actividadesContainer.appendChild(btn);
  });
}

// Reiniciar puntos
btnReiniciarPuntos.addEventListener("click", () => {
  puntos = 0;
  actualizarPuntos();
});

function actualizarPuntos() {
  puntosTexto.textContent = `Puntos totales: ${puntos}`;
}

// Botón volver a lecciones
btnVolverLecciones.addEventListener("click", () => {
  mostrarPantalla("pantalla-lecciones");
  actividadJuego.innerHTML = "";
});

// Iniciar actividad
function iniciarActividad(idActividad) {
  actividadActual = idActividad;
  tituloActividad.textContent = {
    "traducir": "Actividad: Traducir",
    "emparejar": "Actividad: Emparejar",
    "eleccion-multiple": "Actividad: Elección múltiple"
  }[idActividad] || "Actividad";

  actividadJuego.innerHTML = "";
  mostrarPantalla("pantalla-actividad");

  if (idActividad === "traducir") {
    iniciarTraducir();
  } else if (idActividad === "emparejar") {
    iniciarEmparejar();
  } else if (idActividad === "eleccion-multiple") {
    iniciarEleccionMultiple();
  }else if(idActividad==="escuchar") {
    iniciarEscuchar();
  }
}

/* === ACTIVIDAD TRADUCIR === */

let traducirPalabras = [];
let traducirIndice = 0;

function iniciarTraducir() {
  traducirPalabras = [...leccionActual.palabras];
  traducirIndice = 0;
  mostrarPalabraTraducir();
}

function mostrarPalabraTraducir() {
  if (traducirIndice >= traducirPalabras.length) {
    actividadJuego.innerHTML = `<p>Has terminado la actividad Traducir.</p>`;
    return;
  }
  const palabra = traducirPalabras[traducirIndice];
  actividadJuego.innerHTML = `
    <p><strong>Alemán:</strong> ${palabra.aleman}</p>
    <input type="text" id="input-traducir" placeholder="Escribe la traducción en español" autocomplete="off" />
    <div id="mensaje-feedback" style="margin-top: 1rem;"></div>
    <button id="btn-verificar">Verificar</button>
  `;
  document.getElementById("btn-verificar").addEventListener("click", verificarTraducir);
  document.getElementById("input-traducir").focus();
}

function verificarTraducir() {
  const input = document.getElementById("input-traducir");
  const feedback = document.getElementById("mensaje-feedback");
  const palabra = traducirPalabras[traducirIndice];
  const respuesta = input.value.trim().toLowerCase();
  const correcta = palabra.espanol.toLowerCase();

  if (respuesta === correcta) {
    feedback.textContent = "¡Correcto!";
    feedback.style.color = "green";
    sonidoCorrcto.play();
    puntos++;
    traducirIndice++;
    actualizarPuntos();
    setTimeout(mostrarPalabraTraducir, 1000);
  } else {
    feedback.textContent = `Incorrecto. La respuesta correcta es: ${palabra.espanol}`;
    feedback.style.color = "red";
    sonidoIncorrecto.play();
    puntos = Math.max(0, puntos - 1);
    actualizarPuntos();
  }
}

/* === ACTIVIDAD EMPAREJAR === */

let emparejarPalabras = [];
let emparejarPares = [];
let emparejarSeleccionados = [];
let emparejarBloque = 0;
const BLOQUE_TAMANIO = 10;

function iniciarEmparejar() {
  emparejarPalabras = [...leccionActual.palabras];
  emparejarPares = [];
  emparejarSeleccionados = [];
  emparejarBloque = 0;
  cargarBloqueEmparejar();
}

function cargarBloqueEmparejar() {
  emparejarSeleccionados = [];
  actividadJuego.innerHTML = "";
  const inicio = emparejarBloque * BLOQUE_TAMANIO;
  const fin = Math.min(inicio + BLOQUE_TAMANIO, emparejarPalabras.length);
  const bloquePalabras = emparejarPalabras.slice(inicio, fin);

  // Creamos pares aleatorios con las palabras alemán y español mezclados
  const alemanArr = bloquePalabras.map(p => p.aleman);
  const espanolArr = bloquePalabras.map(p => p.espanol);

  // Mezclamos las opciones de español
  const espanolMezclado = espanolArr.sort(() => Math.random() - 0.5);

  actividadJuego.innerHTML = `
    <p>Empareja las palabras en alemán con su traducción en español:</p>
    <div id="palabras-aleman" class="contenedor-palabras"></div>
    <div id="palabras-espanol" class="contenedor-palabras"></div>
    <div id="mensaje-feedback" style="margin-top:1rem;"></div>
  `;

  const contenedorAleman = document.getElementById("palabras-aleman");
  const contenedorEspanol = document.getElementById("palabras-espanol");
  const feedback = document.getElementById("mensaje-feedback");

  bloquePalabras.forEach(p => {
    const btnAlem = document.createElement("button");
    btnAlem.textContent = p.aleman;
    btnAlem.className = "btn-palabra";
    btnAlem.addEventListener("click", () => seleccionarEmparejar("aleman", btnAlem, p));

    contenedorAleman.appendChild(btnAlem);
  });

  espanolMezclado.forEach(espanol => {
    const btnEsp = document.createElement("button");
    btnEsp.textContent = espanol;
    btnEsp.className = "btn-palabra";
    btnEsp.addEventListener("click", () => seleccionarEmparejar("espanol", btnEsp, espanol));

    contenedorEspanol.appendChild(btnEsp);
  });

  function seleccionarEmparejar(tipo, btn, valor) {
    if (emparejarSeleccionados.length === 2) return;

    // Si ya hay un seleccionado del mismo tipo, ignorar
    if (emparejarSeleccionados.find(s => s.tipo === tipo)) return;

    btn.classList.add("seleccionada");
    emparejarSeleccionados.push({ tipo, btn, valor });

    if (emparejarSeleccionados.length === 2) {
      // Verificar si son pareja correcta
      let correcto = false;

      if (emparejarSeleccionados[0].tipo === "aleman") {
        // Buscar palabra que coincide con alemán
        const p = bloquePalabras.find(p => p.aleman === emparejarSeleccionados[0].valor);
        if (p && p.espanol === emparejarSeleccionados[1].valor) correcto = true;
      } else {
        const p = bloquePalabras.find(p => p.aleman === emparejarSeleccionados[1].valor);
        if (p && p.espanol === emparejarSeleccionados[0].valor) correcto = true;
      }

      if (correcto) {
        puntos++;
        actualizarPuntos();
        feedback.textContent = "¡Correcto!";
        feedback.style.color = "green";
        sonidoCorrcto.play();

        // Ocultar botones emparejados
        emparejarSeleccionados.forEach(s => {
          s.btn.style.visibility = "hidden";
          s.btn.disabled = true;
        });

        // Remover pares emparejados del bloque para no usarlos más
        bloquePalabras.splice(
          bloquePalabras.findIndex(p => p.aleman === emparejarSeleccionados.find(s => s.tipo === "aleman").valor),
          1
        );

        // Revisar si bloque vacío (ya emparejadas todas)
        if (bloquePalabras.length === 0) {
          emparejarBloque++;
          if (emparejarBloque * BLOQUE_TAMANIO >= emparejarPalabras.length) {
            actividadJuego.innerHTML = `<p>Has terminado la actividad Emparejar.</p>`;
          } else {
            setTimeout(() => {
              cargarBloqueEmparejar();
              feedback.textContent = "";
            }, 1000);
          }
        }
      } else {
        puntos = Math.max(0, puntos - 1);
        actualizarPuntos();
        feedback.textContent = "Incorrecto. Intenta de nuevo.";
        feedback.style.color = "red";
        sonidoIncorrecto.play();

        setTimeout(() => {
          emparejarSeleccionados.forEach(s => {
            s.btn.classList.remove("seleccionada");
          });
          emparejarSeleccionados = [];
          feedback.textContent = "";
        }, 1000);
      }

      emparejarSeleccionados = [];
    }
  }
}

/* === ACTIVIDAD ELECCIÓN MÚLTIPLE === */

let eleccionPalabras = [];
let eleccionIndice = 0;

function iniciarEleccionMultiple() {
  eleccionPalabras = [...leccionActual.palabras];
  // Mezclar palabras aleatoriamente para orden aleatorio
  eleccionPalabras.sort(() => Math.random() - 0.5);
  eleccionIndice = 0;
  mostrarPreguntaEleccion();
}

function mostrarPreguntaEleccion() {
  if (eleccionIndice >= eleccionPalabras.length) {
    actividadJuego.innerHTML = `<p>Has terminado la actividad Elección múltiple.</p>`;
    return;
  }
  const palabra = eleccionPalabras[eleccionIndice];

  // Crear opciones (1 correcta + 3 incorrectas aleatorias)
  const opciones = [palabra.espanol];

  // Tomar otras palabras para distractores
  const otrasOpciones = leccionActual.palabras
    .filter(p => p.espanol !== palabra.espanol)
    .map(p => p.espanol)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  opciones.push(...otrasOpciones);
  opciones.sort(() => Math.random() - 0.5); // mezclar opciones

  actividadJuego.innerHTML = `
    <p><strong>Alemán:</strong> ${palabra.aleman}</p>
    <div id="opciones-multiple"></div>
    <div id="mensaje-feedback" style="margin-top:1rem;"></div>
  `;

  const opcionesContainer = document.getElementById("opciones-multiple");
  const feedback = document.getElementById("mensaje-feedback");

  opciones.forEach(opcion => {
    const btn = document.createElement("button");
    btn.textContent = opcion;
    btn.className = "btn-opcion";
    btn.addEventListener("click", () => {
      if (opcion === palabra.espanol) {
        feedback.textContent = "¡Correcto!";
        feedback.style.color = "green";
        sonidoCorrcto.play();
        puntos++;
        actualizarPuntos();
        eleccionIndice++;
        setTimeout(mostrarPreguntaEleccion, 1000);
      } else {
        feedback.textContent = `Incorrecto. La respuesta correcta es: ${palabra.espanol}`;
        feedback.style.color = "red";
        sonidoIncorrecto.play();
        puntos = Math.max(0, puntos - 1);
        actualizarPuntos();
      }
    });
    opcionesContainer.appendChild(btn);
  });
}

/* === INICIALIZACIÓN === */

document.addEventListener("DOMContentLoaded", () => {
  mostrarPantalla("pantalla-inicio");
  actualizarPuntos();

  // Simulamos botón para iniciar, si lo tienes, aquí muestra las lecciones
  const btnIniciar = document.getElementById("btn-iniciar");
  btnIniciar.addEventListener("click", () => {
    mostrarLecciones();
    mostrarPantalla("pantalla-lecciones");
  });
});
let escucharPalabras = [];
let escucharIndice = 0;

function iniciarEscuchar() {
  escucharPalabras = [...leccionActual.palabras];
  escucharIndice = 0;
  mostrarPalabraEscuchar();
}

function mostrarPalabraEscuchar() {
  if (escucharIndice >= escucharPalabras.length) {
    actividadJuego.innerHTML = `<p>Has terminado la actividad Escuchar.</p>`;
    return;
  }
  const palabra = escucharPalabras[escucharIndice];

  actividadJuego.innerHTML = `
    <p>Escucha la palabra en alemán y escríbela correctamente:</p>
    <button id="btn-reproducir">🔊 Reproducir palabra</button>
    <input type="text" id="input-escuchar" placeholder="Escribe la palabra en alemán" autocomplete="off" />
    <div id="mensaje-feedback" style="margin-top:1rem;"></div>
    <button id="btn-verificar-escuchar">Verificar</button>
  `;

  const btnReproducir = document.getElementById("btn-reproducir");
  btnReproducir.addEventListener("click", () => reproducirPalabra(palabra.aleman));

  document.getElementById("btn-verificar-escuchar").addEventListener("click", verificarEscuchar);
  document.getElementById("input-escuchar").focus();
}

function reproducirPalabra(texto) {
  // Usamos SpeechSynthesis para sintetizar la voz en alemán
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'de-DE'; // idioma alemán
    speechSynthesis.speak(utterance);
  } else {
    alert("Tu navegador no soporta síntesis de voz.");
  }
}

function verificarEscuchar() {
  const input = document.getElementById("input-escuchar");
  const feedback = document.getElementById("mensaje-feedback");
  const palabra = escucharPalabras[escucharIndice];
  const respuesta = input.value.trim().toLowerCase();
  const correcta = palabra.espanol.toLowerCase();

  if (respuesta === correcta) {
    feedback.textContent = "¡Correcto!";
    feedback.style.color = "green";
    sonidoCorrcto.play();
    puntos++;
    escucharIndice++;
    actualizarPuntos();
    setTimeout(mostrarPalabraEscuchar, 1000);
  } else {
    feedback.textContent = `Incorrecto. La palabra correcta es: ${palabra.aleman}`;
    feedback.style.color = "red";
    sonidoIncorrecto.play();
    puntos = Math.max(0, puntos - 1);
    actualizarPuntos();
  }
}



const actividades = [
  { id: "traducir", nombre: "Traducir" },
  { id: "emparejar", nombre: "Emparejar" },
  { id: "eleccion-multiple", nombre: "Elección múltiple" },
  { id: "escuchar", nombre: "Escuchar" }
];
