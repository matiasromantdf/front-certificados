// Inicializar el almacenamiento de alumnos si no existe

// Función para cargar la lista de alumnos
async function cargarAlumnos() {
  let res = await fetch(apiUrl + "/alumnos");
  let alumnos = await res.json();
  const tbody = document.getElementById("alumnosTableBody");
  tbody.innerHTML = "";

  alumnos.forEach((alumno) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${alumno.dni}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.apellido}</td>
        `;
    tbody.appendChild(tr);
  });
}

// Función para buscar un alumno por DNI
function buscarAlumno() {
  const dni = document.getElementById("searchDni").value;
  const alumnos = JSON.parse(localStorage.getItem("alumnos"));
  const alumno = alumnos.find((a) => a.dni === dni);

  if (alumno) {
    document.getElementById("dni").value = alumno.dni;
    document.getElementById("nombre").value = alumno.nombre;
    document.getElementById("apellido").value = alumno.apellido;
  } else {
    alert("Alumno no encontrado");
  }
}

// Función para guardar un alumno
document.getElementById("alumnoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const alumno = {
    dni: document.getElementById("dni").value,
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
  };

  const alumnos = JSON.parse(localStorage.getItem("alumnos"));
  const index = alumnos.findIndex((a) => a.dni === alumno.dni);

  if (index >= 0) {
    alumnos[index] = alumno;
    alert("Alumno actualizado correctamente");
  } else {
    alumnos.push(alumno);
    alert("Alumno registrado correctamente");
  }

  localStorage.setItem("alumnos", JSON.stringify(alumnos));
  this.reset();
  cargarAlumnos();
});

// Función para eliminar un alumno
function eliminarAlumno(dni) {
  if (confirm("¿Está seguro de eliminar este alumno?")) {
    const alumnos = JSON.parse(localStorage.getItem("alumnos"));
    const nuevosAlumnos = alumnos.filter((a) => a.dni !== dni);
    localStorage.setItem("alumnos", JSON.stringify(nuevosAlumnos));
    cargarAlumnos();
  }
}

// Cargar la lista de alumnos al iniciar
cargarAlumnos();
