// Datos ejemplo de lecciones y palabras
// Datos de las lecciones (esto sería el contenido de palabras.js)
// Variables globales
// Variables globales
 // Variables globales
// Variables globales
let puntos = 0;
let puntosUltimaSesion = 0; 
let leccionActual = null;
let actividadActual = null;
let nuevaEstrellaGanada = false;
let nuevoTrofeoGanado = false;

const progresoLecciones = JSON.parse(localStorage.getItem('progresoLecciones')) || {};
const btnVolverLogros = document.getElementById("btn-volver-logros");
const btnVolverMapa = document.getElementById("btn-volver-mapa");

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
const btnVolverActividades = document.getElementById("btn-volver-actividades");
const pantallaListaPalabras = document.getElementById("pantalla-lista-palabras");
const listaPalabrasContainer = document.getElementById("lista-palabras-container");
const tituloListaLeccion = document.getElementById("titulo-lista-leccion");
const btnIrActividades = document.getElementById("btn-ir-actividades");
const btnVolverLista = document.getElementById("btn-volver-lista");

const listaHistorial = document.getElementById("lista-historial");
const btnSalirHistorial = document.getElementById("btn-salir-historial");
const pantallaHistorial = document.getElementById("pantalla-historial");
const contenedorHistorial = document.getElementById("historial-container");
const btnVerHistorial = document.getElementById("btn-ver-historial");

const inputEmail = document.getElementById("input-email");
const btnIniciar = document.getElementById("btn-iniciar");
const mensajeErrorEmail = document.getElementById("mensaje-error-email");
const dominioPermitido = "@europaschool.org";


const sonidoCorrcto = new Audio("/language_solutions/correcto.mp3");
const sonidoIncorrecto= new Audio("/language_solutions/incorrecto.mp3");







//al cargar la página el campo email ya esté rellenado:
document.addEventListener('DOMContentLoaded', () => {
    const correoGuardado = localStorage.getItem('correoAlumno');
    if (correoGuardado) {
        inputEmail.value = correoGuardado;
        btnIniciar.disabled = false;
       crearBotonesFlotantes();
       inicializarProgreso();
    }
});

// Registro del Service Worker (versión GitHub Pages)
// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registrado con éxito');
      })
      .catch(err => {
        console.log('❌ Fallo en el registro:', err);
      });
  });
}

function validarEmail(email) {
  return email.endsWith(dominioPermitido);
}

function actualizarEstadoBoton() {
  const email = inputEmail.value.trim().toLowerCase();

  if (email === "") {
    mensajeErrorEmail.style.display = "none";
    btnIniciar.disabled = true;
    return;
  }

  if (!validarEmail(email)) {
    mensajeErrorEmail.textContent = "Correo incorrecto: debe terminar en " + dominioPermitido;
    mensajeErrorEmail.style.display = "block";
    btnIniciar.disabled = true;
  } else {
    mensajeErrorEmail.style.display = "none";
    btnIniciar.disabled = false;
  }
}

// Escuchar cambios en el input para validar en tiempo real
inputEmail.addEventListener("input", () => {
  const email = inputEmail.value.trim().toLowerCase();
  const esValido = email && email.endsWith(dominioPermitido);

  btnIniciar.disabled = !esValido;

  if (!esValido) {
    mensajeErrorEmail.textContent = "Introduce un correo válido de la escuela (@europaschool.org).";
    mensajeErrorEmail.style.display = "block";
  } else {
    mensajeErrorEmail.textContent = "";
    mensajeErrorEmail.style.display = "none";
  }
});


// Cuando se clickea el botón iniciar
btnIniciar.addEventListener("click", () => {
  const email = inputEmail.value.trim().toLowerCase();

 if (email && email.endsWith(dominioPermitido)) {
    localStorage.setItem("correoAlumno", email);
    mostrarPantalla("pantalla-lecciones");
    mostrarLecciones();
  }
  
    
});

// Mostrar/Ocultar pantallas
function ocultarTodasLasPantallas() {
  document.querySelectorAll(".pantalla").forEach(p => {
    p.classList.add("pantalla-oculta");
    p.classList.remove("pantalla-activa");
  });
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
  mostrarListaPalabras(leccion);
}

function mostrarListaPalabras(leccion) {
  ocultarTodasLasPantallas();

  pantallaListaPalabras.classList.remove("pantalla-oculta");
  pantallaListaPalabras.classList.add("pantalla-activa");

  leccionActual = leccion;
  tituloListaLeccion.textContent = `Palabras de la lección: ${leccion.nombre}`;
  listaPalabrasContainer.innerHTML = "";

  const tabla = document.createElement("table");
  tabla.innerHTML = "<thead><tr><th>Alemán</th><th>Español</th></tr></thead><tbody></tbody>";

  leccion.palabras.forEach(par => {
    const fila = document.createElement("tr");
    fila.innerHTML = `<td>${par.aleman}</td><td>${par.espanol}</td>`;
    tabla.querySelector("tbody").appendChild(fila);
  });

  listaPalabrasContainer.appendChild(tabla);
}

// Mostrar actividades
function mostrarActividades() {
  actividadesContainer.innerHTML = "";

  const actividades = [
    { id: "traducir", nombre: "Traducir" },
    { id: "emparejar", nombre: "Emparejar" },
    { id: "eleccion-multiple", nombre: "Elección múltiple" },
    { id: "escuchar", nombre: "Escuchar" },
    { id: "pronunciacion", nombre: "Pronunciación" }
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



//Botón volver a actividades
btnVolverActividades.onclick = () => {
    mostrarPantalla("pantalla-actividades");
    actividadJuego.innerHTML = "";
  };

// Botón volver a lecciones
btnVolverLecciones.addEventListener("click", () => {
  mostrarPantalla("pantalla-lecciones");
  actividadJuego.innerHTML = "";
});
// Guardar puntuación en el historial (ya debes tener algo como esto cuando vuelve a lecciones)
function guardarPuntuacionEnHistorial() {
  const puntosSesion = puntos - puntosUltimaSesion;
  if (puntosSesion <= 0) return;

  const historial = JSON.parse(localStorage.getItem("historialPuntos")) || [];
  const correo = localStorage.getItem("correoAlumno") || "Sin correo";

  historial.push({
    fecha: new Date().toLocaleString(),
    leccion: leccionActual ? leccionActual.nombre : "Sin lección",
    puntos: puntosSesion,
    correo: correo
  });

  localStorage.setItem("historialPuntos", JSON.stringify(historial));
  puntosUltimaSesion = puntos;
}


btnVolverLecciones.addEventListener("click", () => {
  guardarPuntuacionEnHistorial();
  guardarPuntuacion();
  mostrarPantalla("pantalla-lecciones");
  actividadJuego.innerHTML = "";
});


btnVerHistorial.addEventListener("click", () => {
  mostrarHistorial();
  mostrarPantalla("pantalla-historial");
});

btnSalirHistorial.addEventListener("click", () => {
  mostrarPantalla("pantalla-lecciones");
  mostrarLecciones();
});


// Mostrar historial
function mostrarHistorial() {
  const historialContainer = document.getElementById("historial-container");
  historialContainer.innerHTML = "";

  const historial = JSON.parse(localStorage.getItem("historialPuntos")) || [];

  if (historial.length === 0) {
    historialContainer.textContent = "No hay historial aún.";
    return;
  }

  const lista = document.createElement("ul");

  historial.forEach(entry => {
  const li = document.createElement("li");
  li.textContent = `${entry.fecha} — ${entry.leccion || "Sin leccion"} — ${entry.puntos} puntos — ${entry.correo}`;
  lista.appendChild(li);
});

  historialContainer.appendChild(lista);
}


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
  }else if (idActividad === "pronunciacion") {
    iniciarPronunciar(leccionActual);
  }
}
btnIrActividades.addEventListener("click", () => {
  mostrarPantalla("pantalla-actividades");
  mostrarActividades();
});

btnVolverLista.addEventListener("click", () => {
  mostrarPantalla("pantalla-lecciones");
  mostrarLecciones();
});

new Date().toLocaleString("es-ES", {
  timeZone: "Europe/Madrid",
  hour12: false
});

btnVolverLogros.addEventListener("click", () => {
  mostrarPantalla("pantalla-lecciones");  
  mostrarLecciones();
});

btnVolverMapa.addEventListener("click", () => {
  mostrarPantalla("pantalla-lecciones");
  mostrarLecciones();
});


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
    registrarActividadCompletada(leccionActual.id, 'traducir');
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
    btnAlem.addEventListener("click", () => seleccionarEmparejar("aleman", btnAlem, p.aleman));

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
      let palabraAleman, palabraEspanol;

if (emparejarSeleccionados[0].tipo === "aleman") {
  palabraAleman = emparejarSeleccionados[0].valor;
  palabraEspanol = emparejarSeleccionados[1].valor;
} else {
  palabraAleman = emparejarSeleccionados[1].valor;
  palabraEspanol = emparejarSeleccionados[0].valor;
}

correcto = bloquePalabras.some(p => p.aleman === palabraAleman && p.espanol === palabraEspanol);


      if (correcto) {
        puntos++;
        actualizarPuntos();
        feedback.textContent = "¡Correcto!";
        feedback.style.color = "green";
        sonidoCorrcto.play();
       registrarActividadCompletada(leccionActual.id, 'emparejar');

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
        registrarActividadCompletada(leccionActual.id, 'eleccion-multiple');
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
   registrarActividadCompletada(leccionActual.id, 'escuchar');
  } else {
    feedback.textContent = `Incorrecto. La palabra correcta es: ${palabra.aleman}`;
    feedback.style.color = "red";
    sonidoIncorrecto.play();
    puntos = Math.max(0, puntos - 1);
    actualizarPuntos();
  }
}


/*=== ACTIVIDAD PRONUNCIACIÓN === */

// Estas variables deben ser accesibles por las funciones
let palabrasPronunciacion;
let indicePalabraActual;
let contenedor = document.getElementById('actividad-juego'); // Asumiendo que 'contenedor' está definido fuera

function iniciarPronunciar(leccionSeleccionada){
    // 1. Obtenemos la lista de palabras de la lección
    palabrasPronunciacion = leccionSeleccionada.palabras.map(p => p.aleman);
    indicePalabraActual = 0;
    // 2. Llamamos a la función que mostrará la primera palabra
    mostrarPalabraPronunciacion();
}

function mostrarPalabraPronunciacion() {
    if (indicePalabraActual >= palabrasPronunciacion.length) {
        contenedor.innerHTML = '<p>¡Has completado todas las palabras!</p>';
        return;
    }

    // --- CAMBIO CLAVE ---
    // Obtenemos la palabra actual del array usando el índice
    const palabraActual = palabrasPronunciacion[indicePalabraActual];

    contenedor.innerHTML = `
        <h3>Pronuncia esta palabra en alemán:</h3>
               <p style="font-size: 24px; font-weight: bold;">${palabraActual}</p>
        <button id="btn-escuchar-pronunciacion">Escuchar</button>
        <button id="btn-pronunciar">Pronunciar</button>
        <p id="feedback-pronunciacion"></p>
    `;

    // Pasamos la palabra correcta a las funciones de los eventos
    document.getElementById('btn-escuchar-pronunciacion').addEventListener('click', () => {
        reproducirPronunciacion(palabraActual);
    });

    document.getElementById('btn-pronunciar').addEventListener('click', () => {
        iniciarReconocimientoVoz(palabraActual);
    });
}

function reproducirPronunciacion(palabra) {
    const utterance = new SpeechSynthesisUtterance(palabra);
    utterance.lang = 'de-DE';
    speechSynthesis.speak(utterance);
}

function iniciarReconocimientoVoz(palabraCorrecta) {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Tu navegador no soporta reconocimiento de voz.');
        return;
    }

    const reconocimiento = new webkitSpeechRecognition();
    reconocimiento.lang = 'de-DE';
    reconocimiento.interimResults = false;
    reconocimiento.maxAlternatives = 1;

    const feedbackEl = document.getElementById('feedback-pronunciacion');
    feedbackEl.textContent = '🎙️ Escuchando...';
    feedbackEl.style.color = 'black';

    reconocimiento.start();

    reconocimiento.onresult = (event) => {
        // LIMPIEZA: Quita espacios y el punto final que el API suele añadir
        const resultadoUsuario = event.results[0][0].transcript.trim().toLowerCase().replace(/\.$/, '');
        const palabraObjetivo = palabraCorrecta.trim().toLowerCase();

        console.log(`Usuario dijo: "${resultadoUsuario}" | Correcto es: "${palabraObjetivo}"`);

        // CÁLCULO DE SIMILITUD
        const similitud = calcularSimilitud(resultadoUsuario, palabraObjetivo);
        const umbralAceptable = palabraObjetivo.length > 5 ? 2 : 1; // Umbral dinámico

        if (similitud <= umbralAceptable) {
            feedbackEl.textContent = '✅ ¡Correcto!';
            feedbackEl.style.color = 'green';
            sonidoCorrcto.play();
            puntos++;
            actualizarPuntos();
            indicePalabraActual++;
            setTimeout(mostrarPalabraPronunciacion, 2000);
            registrarActividadCompletada(leccionActual.id, 'pronunciacion');
        } else {
            feedbackEl.textContent = `❌ Incorrecto. Dijiste: "${resultadoUsuario}"`;
            feedbackEl.style.color = 'red';
            sonidoIncorrecto.play();
            puntos = Math.max(0, puntos - 1);
            actualizarPuntos();
        }

        setTimeout(() => {
            indicePalabraActual++;
            mostrarPalabraPronunciacion();
        }, 2000);
    };

    reconocimiento.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        if (event.error === 'no-speech') {
            feedbackEl.textContent = 'No se detectó ninguna voz. Inténtalo de nuevo.';
        } else {
            feedbackEl.textContent = 'Error al reconocer tu voz.';
        }
    };
}

// NO OLVIDES AÑADIR ESTA FUNCIÓN A TU SCRIPT
function calcularSimilitud(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) { matrix[0][i] = i; }
  for (let j = 0; j <= b.length; j++) { matrix[j][0] = j; }
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + cost);
    }
  }
  return matrix[b.length][a.length];
}
// Función para inicializar el progreso si no existe
function inicializarProgreso() {
  datosLecciones.lecciones.forEach(leccion => {
    if (!progresoLecciones[leccion.id]) {
      progresoLecciones[leccion.id] = {
        estrellas: 0,
        actividadesCompletadas: [],
        completada: false
      };
    }
  });
  localStorage.setItem('progresoLecciones', JSON.stringify(progresoLecciones));
}

// Crear botones flotantes
function crearBotonesFlotantes() {
  // Botón del mapa
  const btnMapa = document.createElement('button');
  btnMapa.className = 'btn-flotante';
  btnMapa.innerHTML = '🗺️';
  btnMapa.title = 'Mapa de lecciones';
  btnMapa.addEventListener('click', () => {
    mostrarPantalla('pantalla-mapa');
    dibujarMapa();
  });
  document.body.appendChild(btnMapa);

  // Botón de logros
  const btnLogros = document.createElement('button');
  btnLogros.className = 'btn-flotante btn-logros';
  btnLogros.innerHTML = '🏆';
  btnLogros.title = 'Mis logros';
  btnLogros.addEventListener('click', () => {
    mostrarPantalla('pantalla-logros');
    mostrarLogros();
    if (nuevaEstrellaGanada || nuevoTrofeoGanado) {
      mostrarNotificacionLogro();
      nuevaEstrellaGanada = false;
      nuevoTrofeoGanado = false;
    }
  });
  document.body.appendChild(btnLogros);
}

// Dibujar mapa de lecciones
function dibujarMapa() {
  const mapaContainer = document.getElementById('mapa-container');
  mapaContainer.innerHTML = '';
  
  datosLecciones.lecciones.forEach(leccion => {
    const progreso = progresoLecciones[leccion.id] || {};
    const estrellas = progreso.estrellas || 0;
    
    const leccionDiv = document.createElement('div');
    leccionDiv.className = `leccion-mapa ${progreso.completada ? 'completada' : ''}`;
    leccionDiv.innerHTML = `
      <h3>${leccion.nombre}</h3>
      <div class="estrellas-leccion">
        ${'★'.repeat(estrellas)}${'☆'.repeat(5 - estrellas)}
      </div>
      ${progreso.completada ? '<p>¡Completada!</p>' : ''}
    `;
    
    leccionDiv.addEventListener('click', () => {
      seleccionarLeccion(leccion);
      mostrarPantalla('pantalla-actividades');
    });
    
    mapaContainer.appendChild(leccionDiv);
  });
}

// Mostrar logros
function mostrarLogros() {
  const estrellasContainer = document.getElementById('estrellas-container');
  const trofeosContainer = document.getElementById('trofeos-container');
  
  estrellasContainer.innerHTML = '';
  trofeosContainer.innerHTML = '';
  
  // Estrellas por lección
  datosLecciones.lecciones.forEach(leccion => {
    const estrellas = (progresoLecciones[leccion.id]?.estrellas) || 0;
    if (estrellas > 0) {
      const div = document.createElement('div');
      div.innerHTML = `
        <p><strong>${leccion.nombre}:</strong> ${estrellas} estrellas</p>
        <div>${'★'.repeat(estrellas)}${'☆'.repeat(5 - estrellas)}</div>
      `;
      estrellasContainer.appendChild(div);
    }
  });
  
  // Trofeos
  const leccionesCompletadas = datosLecciones.lecciones.filter(
    leccion => progresoLecciones[leccion.id]?.completada
  ).length;
  
  const trofeoDiv = document.createElement('div');
  trofeoDiv.innerHTML = `
    <div class="trofeo">
      🏆
      ${leccionesCompletadas === datosLecciones.lecciones.length ? 
        '<span class="logro-badge">1</span>' : ''}
    </div>
    <p>${leccionesCompletadas} de ${datosLecciones.lecciones.length} lecciones completadas</p>
  `;
  trofeosContainer.appendChild(trofeoDiv);
}

// Notificación de logro
function mostrarNotificacionLogro() {
  const notificacion = document.createElement('div');
  notificacion.className = 'notificacion-logro';
  notificacion.innerHTML = `
    <h3>¡Logro desbloqueado!</h3>
    <p>Revisa tus recompensas</p>
  `;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Modificar esta función cuando se complete una actividad
function registrarActividadCompletada(leccionId, actividadId) {
  if (!progresoLecciones[leccionId]) {
    progresoLecciones[leccionId] = { estrellas: 0, actividadesCompletadas: [], completada: false };
  }
  
  if (!progresoLecciones[leccionId].actividadesCompletadas.includes(actividadId)) {
    progresoLecciones[leccionId].actividadesCompletadas.push(actividadId);
    progresoLecciones[leccionId].estrellas += 1;
    puntos += 50;
    nuevaEstrellaGanada = true;
    
    // Verificar si se completó la lección
    const actividades = ['traducir', 'emparejar', 'eleccion-multiple', 'escuchar', 'pronunciacion'];
    const completada = actividades.every(act => 
      progresoLecciones[leccionId].actividadesCompletadas.includes(act)
    );
    
    if (completada && !progresoLecciones[leccionId].completada) {
      progresoLecciones[leccionId].completada = true;
      puntos += 200;
      nuevoTrofeoGanado = true;
    }
    
    localStorage.setItem('progresoLecciones', JSON.stringify(progresoLecciones));
    actualizarPuntos();
  }
}

// Añade esta llamada cuando se complete una actividad correctamente
// Por ejemplo, en verificarTraducir():
function verificarTraducir() {
  // ... tu código existente ...
  
  if (respuesta === correcta) {
    registrarActividadCompletada(leccionActual.id, 'traducir');
    // ... resto del código ...
  }
}


const actividades = [
  { id: "traducir", nombre: "Traducir" },
  { id: "emparejar", nombre: "Emparejar" },
  { id: "eleccion-multiple", nombre: "Elección múltiple" },
  { id: "escuchar", nombre: "Escuchar" }
];
