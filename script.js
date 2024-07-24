// Definir la lista de alumnos y grupos
let alumnos = [];
let grupos = {};

// Clase Alumno
class Alumno {
    constructor(nombre, apellidos, edad) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.edad = edad;
        this.materiasInscritas = [];
        this.calificaciones = {};
    }

    inscribirMateria(materia) {
        this.materiasInscritas.push(materia);
    }

    asignarCalificacion(materia, calificacion) {
        this.calificaciones[materia] = calificacion;
    }

    obtenerPromedio() {
        let sum = 0;
        let count = 0;
        for (let materia in this.calificaciones) {
            sum += this.calificaciones[materia];
            count++;
        }
        return count === 0 ? 0 : sum / count;
    }
}

// Cargar datos desde localStorage al iniciar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    cargarDatosDesdeLocalStorage();
    actualizarOperaciones();
});

// Función para cargar datos desde localStorage
function cargarDatosDesdeLocalStorage() {
    if (localStorage.getItem('alumnos')) {
        alumnos = JSON.parse(localStorage.getItem('alumnos')).map(alumnoData => new Alumno(...alumnoData));
    }
    if (localStorage.getItem('grupos')) {
        grupos = JSON.parse(localStorage.getItem('grupos'));
    }
}

// Función para guardar datos en localStorage
function guardarDatosEnLocalStorage() {
    localStorage.setItem('alumnos', JSON.stringify(alumnos.map(alumno => [alumno.nombre, alumno.apellidos, alumno.edad])));
    localStorage.setItem('grupos', JSON.stringify(grupos));
}

// Función para dar de alta un alumno desde el formulario
function altaAlumno() {
    let nombre = document.getElementById('nombre').value;
    let apellidos = document.getElementById('apellidos').value;
    let edad = parseInt(document.getElementById('edad').value);

    if (nombre && apellidos && !isNaN(edad)) {
        let alumno = new Alumno(nombre, apellidos, edad);
        alumnos.push(alumno);
        guardarDatosEnLocalStorage(); // Guardar
        console.log('Alumno dado de alta:', alumno);

        // Limpiar 
        document.getElementById('nombre').value = '';
        document.getElementById('apellidos').value = '';
        document.getElementById('edad').value = '';

        actualizarOperaciones();
    } else {
        alert('Por favor ingresa nombre, apellidos y edad válida.');
    }
}
// Función para eliminar un alumno
function eliminarAlumno() {
    let nombreAlumno = prompt('Ingrese el nombre del alumno a eliminar:');
    if (nombreAlumno) {
        let indice = alumnos.findIndex(alumno => alumno.nombre.toLowerCase() === nombreAlumno.toLowerCase());
        if (indice !== -1) {
            alumnos.splice(indice, 1); // Eliminar el alumno del array
            guardarDatosEnLocalStorage(); // Guardar cambios en localStorage
            console.log('Alumno eliminado:', nombreAlumno);
            actualizarOperaciones(); // Actualizar la lista de operaciones
        } else {
            alert('Alumno no encontrado.');
        }
    }
}
//asignar calificaciones a un alumno
function asignarCalificaciones() {
    let nombreAlumno = prompt('Ingrese el nombre del alumno para asignar calificaciones:');
    if (nombreAlumno) {
        let alumno = alumnos.find(alumno => alumno.nombre.toLowerCase() === nombreAlumno.toLowerCase());
        if (alumno) {
            let materias = prompt('Ingrese las materias separadas por coma:');
            if (materias) {
                let materiasArray = materias.split(',').map(materia => materia.trim());
                materiasArray.forEach(materia => {
                    let calificacion = parseFloat(prompt(`Ingrese la calificación para ${materia}:`));
                    if (!isNaN(calificacion)) {
                        alumno.asignarCalificacion(materia, calificacion);
                    }
                });
                guardarDatosEnLocalStorage(); // Guardar datos después de asignar calificaciones
                console.log('Calificaciones asignadas:', alumno.calificaciones);
                actualizarOperaciones();
            } else {
                alert('Debe ingresar al menos una materia.');
            }
        } else {
            alert('Alumno no encontrado.');
        }
    }
}

// Función para crear un grupo y asignar alumnos
function crearGrupo() {
    let nombreGrupo = prompt('Ingrese el nombre del grupo:');
    if (nombreGrupo) {
        let alumnosSeleccionados = [];
        while (true) {
            let nombreAlumno = prompt('Ingrese el nombre del alumno a añadir al grupo (o deje vacío para terminar):');
            if (!nombreAlumno) break;
            let alumno = alumnos.find(alumno => alumno.nombre.toLowerCase() === nombreAlumno.toLowerCase());
            if (alumno) {
                alumnosSeleccionados.push(alumno);
            } else {
                alert('Alumno no encontrado.');
            }
        }
        grupos[nombreGrupo] = alumnosSeleccionados;
        guardarDatosEnLocalStorage(); // Guardar datos después de crear grupo
        console.log('Grupo creado:', grupos);
        actualizarOperaciones();
    }
}

// Función para mostrar las calificaciones de un alumno
function mostrarCalificaciones() {
    let nombreAlumno = prompt('Ingrese el nombre del alumno para ver sus calificaciones:');
    if (nombreAlumno) {
        let alumno = alumnos.find(alumno => alumno.nombre.toLowerCase() === nombreAlumno.toLowerCase());
        if (alumno) {
            let calificacionesHTML = `<h2>Calificaciones de ${alumno.nombre} ${alumno.apellidos}</h2>`;
            if (Object.keys(alumno.calificaciones).length > 0) {
                calificacionesHTML += '<ul>';
                for (let materia in alumno.calificaciones) {
                    calificacionesHTML += `<li>${materia}: ${alumno.calificaciones[materia]}</li>`;
                }
                calificacionesHTML += '</ul>';
            } else {
                calificacionesHTML += '<p>Aún no se han asignado calificaciones.</p>';
            }
            mostrarResultados([calificacionesHTML]);
        } else {
            alert('Alumno no encontrado.');
        }
    }
}

// Función para actualizar las operaciones disponibles en la interfaz
function actualizarOperaciones() {
    let operacionesDiv = document.getElementById('operaciones');
    operacionesDiv.innerHTML = ''; // Limpiar contenido anterior


    // Botones de operaciones
    operacionesDiv.innerHTML += `
        <h2>Operaciones</h2>
        <button onclick="altaAlumno()">Dar de Alta Alumno</button>
        <button onclick="asignarCalificaciones()">Asignar Calificaciones</button>
        <button onclick="crearGrupo()">Crear Grupo</button>
        <button onclick="buscarPorNombre()">Buscar por Nombre</button>
        <button onclick="buscarPorApellido()">Buscar por Apellido</button>
        <button onclick="calcularPromedioAlumno()">Promedio de un Alumno</button>
        <button onclick="calcularPromedioGrupo()">Promedio del Grupo</button>
        <button onclick="ordenarPorCalificacion('asc')">Ordenar por Calificación Ascendente</button>
        <button onclick="ordenarPorCalificacion('desc')">Ordenar por Calificación Descendente</button>
        <button onclick="mostrarCalificaciones()">Mostrar Calificaciones</button>
        <button onclick="eliminarAlumno()">Eliminar Alumno</button>
    `;

    // División para mostrar resultados
    operacionesDiv.innerHTML += '<div id="resultado"></div>';
}

// Función para buscar un alumno por nombre
function buscarPorNombre() {
    let nombre = prompt('Ingrese el nombre del alumno a buscar:');
    if (nombre) {
        let resultadoBusqueda = alumnos.filter(alumno => alumno.nombre.toLowerCase() === nombre.toLowerCase());
        if (resultadoBusqueda.length > 0) {
            mostrarResultados(resultadoBusqueda.map(alumno => `${alumno.nombre} ${alumno.apellidos}: Edad ${alumno.edad}`));
        } else {
            alert('Alumno no encontrado.');
        }
    }
}

// Función para buscar un alumno por apellido
function buscarPorApellido() {
    let apellido = prompt('Ingrese el apellido del alumno a buscar:');
    if (apellido) {
        let resultadoBusqueda = alumnos.filter(alumno => alumno.apellidos.toLowerCase() === apellido.toLowerCase());
        if (resultadoBusqueda.length > 0) {
            mostrarResultados(resultadoBusqueda.map(alumno => `${alumno.nombre} ${alumno.apellidos}: Edad ${alumno.edad}`));
        } else {
            alert('Alumno no encontrado.');
        }
    }
}

// Función para calcular el promedio de un alumno
function calcularPromedioAlumno() {
    let nombreAlumno = prompt('Ingrese el nombre del alumno para calcular su promedio:');
    if (nombreAlumno) {
        let alumno = alumnos.find(alumno => alumno.nombre.toLowerCase() === nombreAlumno.toLowerCase());
        if (alumno) {
            let promedio = alumno.obtenerPromedio().toFixed(2);
            mostrarResultados([`${alumno.nombre} ${alumno.apellidos}: Promedio ${promedio}`]);
        } else {
            alert('Alumno no encontrado.');
        }
    }
}

// Función para calcular el promedio de un grupo de alumnos
function calcularPromedioGrupo() {
    let nombreGrupo = prompt('Ingrese el nombre del grupo para calcular su promedio:');
    if (nombreGrupo) {
        let alumnosDelGrupo = grupos[nombreGrupo];
        if (alumnosDelGrupo) {
            let sumatoria = alumnosDelGrupo.reduce((total, alumno) => total + alumno.obtenerPromedio(), 0);
            let promedioGrupo = (sumatoria / alumnosDelGrupo.length).toFixed(2);
            mostrarResultados([`Promedio del Grupo ${nombreGrupo}: ${promedioGrupo}`]);
        } else {
            alert('Grupo no encontrado.');
        }
    }
}

// Función para ordenar alumnos por calificación (ascendente o descendente)
function ordenarPorCalificacion(orden) {
    let sortedAlumnos = [...alumnos];
    sortedAlumnos.sort((a, b) => {
        let promedioA = a.obtenerPromedio();
        let promedioB = b.obtenerPromedio();
        return orden === 'asc' ? promedioA - promedioB : promedioB - promedioA;
    });
    mostrarResultados(sortedAlumnos.map(alumno => `${alumno.nombre} ${alumno.apellidos}: Promedio ${alumno.obtenerPromedio().toFixed(2)}`));
}

// Función para mostrar resultados en la interfaz
function mostrarResultados(resultados) {
    let resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = ''; // Limpiar contenido anterior
    resultados.forEach(resultado => {
        resultadoDiv.innerHTML += `<p>${resultado}</p>`;
    });
}
