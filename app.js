// app.js

// 1. Configuración de Firebase
// *** REEMPLAZA LOS VALORES DE ESTE OBJETO CON LOS QUE OBTUVISTE DE LA CONSOLA DE FIREBASE ***
const firebaseConfig = {
    apiKey: "AIzaSyC6Kz_4V2GSQi_obosfZkEUL2jAkPg40CM",
  authDomain: "formularios-4e228.firebaseapp.com",
  projectId: "formularios-4e228",
  storageBucket: "formularios-4e228.firebasestorage.app",
  messagingSenderId: "513419933626",
  appId: "1:513419933626:web:829af57b911aae43544f83",
  measurementId: "G-7GYSWGPFDR"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Obtén una referencia a Firestore
const db = firebase.firestore();

// --- Función para guardar los datos en Firestore ---
async function guardarDatosFormulario(datos) {
    try {
        const docRef = await db.collection("evaluaciones").add({
            ...datos,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Documento escrito con ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error añadiendo documento: ", e);
        alert("Hubo un error al enviar tu evaluación. Por favor, revisa la consola para más detalles.");
        return false;
    }
}

// --- Lógica principal del DOM y manejo del formulario ---
document.addEventListener('DOMContentLoaded', () => {
    const bloques = Array.from(document.querySelectorAll('.bloque-evaluacion'));
    const btnSiguiente = document.getElementById('btn-siguiente');
    const bloqueFinal = document.getElementById('bloque-final');
    const bloque1 = document.getElementById('bloque-1');
    const bloqueSeleccion = document.querySelector('.bloque-seleccion');
    const formulario = document.getElementById('evaluacion-form');
    const mensajeConfirmacion = document.getElementById('mensaje-confirmacion');
    const modalidadSelect = document.getElementById('modalidad');
    const turnoSelect = document.getElementById('turno');
    const tallerSelect = document.getElementById('taller');
    const bloqueTurno = document.getElementById('bloque-turno');
    const bloqueTaller = document.getElementById('bloque-taller');
    let indiceActual = 0;

    const talleres = {
        presencial: {
            matutino: [
                { clave: "TA12", nombre: "Gestión y liderazgo en el proceso de mejora educativa en la NEM." },
                { clave: "TA18", nombre: "La Educación Física y el Juego." }
            ],
            vespertino: [
                { clave: "TA12", nombre: "Gestión y liderazgo en el proceso de mejora educativa en la NEM." },
                { clave: "TA18", nombre: "La Educación Física y el Juego." }
            ]
        },
        distancia: {
            matutino: [
                { clave: "TA14", nombre: "Tik Tokero Pedagógico" },
                { clave: "TA15", nombre: "Estrategias para el uso de la realidad virtual y aumentada en el aula" },
                { clave: "TA16", nombre: "Plataformas Virtuales de Aprendizaje-Práctica con Google Classroom" },
                { clave: "TA17", nombre: "Jugando con el gato scratch" },
                { clave: "TA19", nombre: "Atmosferas Creativas. Movilizando Saberes para la Mejora de los Aprendizajes" },
                { clave: "TA20", nombre: "El docente con conocimiento legal" },
                { clave: "TA22", nombre: "Herramientas Digitales para un Aprendizaje Colaborativo" },
                { clave: "TA23", nombre: "Gestión y regulación de emociones para docentes de Educación Básica" }
            ],
            vespertino: [
                { clave: "TA14", nombre: "Tik Tokero Pedagógico" },
                { clave: "TA15", nombre: "Estrategias para el uso de la realidad virtual y aumentada en el aula" },
                { clave: "TA16", nombre: "Plataformas Virtuales de Aprendizaje-Práctica con Google Classroom" },
                { clave: "TA17", nombre: "Jugando con el gato scratch" },
                { clave: "TA19", nombre: "Atmosferas Creativas. Movilizando Saberes para la Mejora de los Aprendizajes" },
                { clave: "TA20", nombre: "El docente con conocimiento legal" },
                { clave: "TA22", nombre: "Herramientas Digitales para un Aprendizaje Colaborativo" },
                { clave: "TA24", nombre: "La inteligencia emocional dentro y fuera del aula" }
            ]
        }
    };

    function mostrarBloque(indice) {
        bloques.forEach((bloque, i) => {
            bloque.style.display = (i === indice) ? 'block' : 'none';
        });

        if (bloques[indice]) {
            btnSiguiente.style.display = verificarRespuestas(bloques[indice]) ? 'inline-block' : 'none';
        }
    }

    function verificarRespuestas(bloque) {
        const allInputs = bloque.querySelectorAll('input[type="radio"]');
        const entradas = Array.from(allInputs).filter(input => input.tagName === 'INPUT' && input.type === 'radio' && input.name);
        const nombres = new Set();
        entradas.forEach(input => nombres.add(input.name));

        const contestadas = new Set();
        entradas.forEach(input => {
            if (input.checked) {
                contestadas.add(input.name);
            }
        });
        return contestadas.size === nombres.size;
    }

    function actualizarTallerSelect() {
        const modalidad = modalidadSelect.value;
        const turno = turnoSelect.value;
        
        if (modalidad && turno && talleres[modalidad] && talleres[modalidad][turno]) {
            const opciones = talleres[modalidad][turno];
            tallerSelect.innerHTML = '<option value="">Seleccione un taller</option>';
            opciones.forEach(taller => {
                const option = document.createElement('option');
                option.value = taller.clave;
                option.textContent = taller.nombre;
                tallerSelect.appendChild(option);
            });
            bloqueTaller.classList.remove('oculto');
            tallerSelect.focus();
        } else {
            tallerSelect.innerHTML = '<option value="">Seleccione un taller</option>';
            bloqueTaller.classList.add('oculto');
        }
    }

    modalidadSelect.addEventListener('change', () => {
        turnoSelect.value = "";
        tallerSelect.value = "";
        bloqueTaller.classList.add('oculto');
        bloque1.style.display = 'none';

        if (modalidadSelect.value) {
            bloqueTurno.classList.remove('oculto');
            turnoSelect.focus();
        } else {
            bloqueTurno.classList.add('oculto');
        }
        btnSiguiente.style.display = 'none';
    });

    turnoSelect.addEventListener('change', () => {
        tallerSelect.value = "";
        bloque1.style.display = 'none';
        actualizarTallerSelect();
        btnSiguiente.style.display = 'none';
    });

    tallerSelect.addEventListener('change', () => {
        if (tallerSelect.value) {
            bloqueSeleccion.style.display = 'none';
            bloque1.style.display = 'block';
            indiceActual = 0;
            mostrarBloque(indiceActual);
        } else {
            bloque1.style.display = 'none';
            btnSiguiente.style.display = 'none';
        }
    });

    document.getElementById('evaluacion-form').addEventListener('input', (event) => {
        if (event.target.tagName === 'INPUT' && event.target.type === 'radio') {
            const bloqueActual = bloques[indiceActual];
            if (verificarRespuestas(bloqueActual)) {
                btnSiguiente.style.display = 'inline-block';
                btnSiguiente.focus();
            } else {
                btnSiguiente.style.display = 'none';
            }
        }
    });

    btnSiguiente.addEventListener('click', () => {
        const bloqueActual = bloques[indiceActual];
        if (!verificarRespuestas(bloqueActual)) {
            alert('Por favor, conteste todas las preguntas antes de avanzar.');
            return;
        }

        indiceActual++;
        if (indiceActual < bloques.length) {
            mostrarBloque(indiceActual);
        } else {
            bloque1.style.display = 'none';
            btnSiguiente.style.display = 'none';
            bloqueFinal.style.display = 'block';
        }
    });

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const datosFormulario = {};
        datosFormulario.modalidad = modalidadSelect.value;
        datosFormulario.turno = turnoSelect.value;
        datosFormulario.taller = tallerSelect.value;

        const radioGroups = [
            'interaccion-grupo', 'dominio-contenido', 'claridad-tema',
            'presentacion-propositos', 'cumplimiento-programa', 'resolver-dudas',
            'estrategias-pedagogicas', 'conduccion-estrategia', 'evaluacion-estrategia',
            'recursos-utilizados', 'participacion-grupal', 'relevancia-informacion',
            'expectativas-cumplidas', 'conocimiento-incrementado', 'actitudes-modificadas'
        ];
        
        radioGroups.forEach(name => {
            const checkedRadio = document.querySelector(`input[name="${name}"]:checked`);
            datosFormulario[name.replace(/-/g, '')] = checkedRadio ? checkedRadio.value : null;
        });
        
        datosFormulario.comentario1 = document.getElementById('comentario1').value;
        datosFormulario.comentario2 = document.getElementById('comentario2').value;
        datosFormulario.comentario3 = document.getElementById('comentario3').value;

        console.log("Datos a enviar:", datosFormulario);

        const exito = await guardarDatosFormulario(datosFormulario);

        if (exito) {
            formulario.style.display = 'none';
            mensajeConfirmacion.style.display = 'block';
        }
    });

    bloque1.style.display = 'none';
    btnSiguiente.style.display = 'none';
});