// Inicializar el almacenamiento de capacidades si no existe

console.log("script cargado");

if (!localStorage.getItem("capacidades")) {
  localStorage.setItem("capacidades", JSON.stringify([]));
}

// Función para generar un ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Función para cargar la lista de capacidades
async function cargarCapacidades() {
  console.log("Cargando capacidades...");
  const req = await fetch(apiUrl + "/capacidades");
  const capacidades = await req.json();
  localStorage.setItem("capacidades", JSON.stringify(capacidades));

  const tbody = document.getElementById("capacidadesTableBody");
  tbody.innerHTML = "";

  capacidades.forEach((capacidad) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${capacidad.id}</td>
        <td>${capacidad.nombre}</td>
        <td>
            <button class="btn btn-sm btn-primary me-2" id="btn-editar">Editar</button>
            <button class="btn btn-sm btn-danger" id="btn-eliminar">Eliminar</button>
        </td>
    `;

    // Obtener los botones y agregar eventos de forma programática
    const editButton = tr.querySelector("#btn-editar");
    const deleteButton = tr.querySelector("#btn-eliminar");

    editButton.addEventListener("click", () => editarCapacidad(capacidad));
    deleteButton.addEventListener("click", () =>
      eliminarCapacidad(capacidad.id)
    );

    tbody.appendChild(tr);
  });
}

// Función para guardar una capacidad
document
  .getElementById("capacidadForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreCapacidad = document.getElementById("nombreCapacidad").value;
    const capacidades = JSON.parse(localStorage.getItem("capacidades"));

    if (this.dataset.editando) {
      // Modo edición
      const index = capacidades.findIndex(
        (c) => c.id === this.dataset.editando
      );
      if (index >= 0) {
        capacidades[index].nombre = nombreCapacidad;
        alert("Capacidad actualizada correctamente");
      }
      delete this.dataset.editando;
    } else {
      // Nueva capacidad
      capacidades.push({
        id: generateId(),
        nombre: nombreCapacidad,
      });
      alert("Capacidad registrada correctamente");
    }

    localStorage.setItem("capacidades", JSON.stringify(capacidades));
    this.reset();
    document.querySelector('button[type="submit"]').textContent = "Guardar";
    cargarCapacidades();
  });

// Función para editar una capacidad
function editarCapacidad(capacidad) {
  console.log(capacidad);
  var myModal = new bootstrap.Modal(document.getElementById("modal"));
  document.getElementById("txt_editarTexto").value = capacidad.nombre;
  document.getElementById("id_capacidad").value = capacidad.id;
  myModal.show();
}
function actualizarTextoCapacidad() {
  let nuevoTexto = document.getElementById("txt_editarTexto").value;
  let idEditando = document.getElementById("id_capacidad").value;

  fetch(apiUrl + "/capacidades/" + idEditando, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre: nuevoTexto, id: idEditando }),
  }).then((res) => {
    cargarCapacidades();
    document.getElementById("btn-cerrar-modal").click();
  });
}

// Función para eliminar una capacidad
function eliminarCapacidad(id) {
  if (confirm("¿Está seguro de eliminar esta capacidad?")) {
    const capacidades = JSON.parse(localStorage.getItem("capacidades"));
    const nuevasCapacidades = capacidades.filter((c) => c.id !== id);
    localStorage.setItem("capacidades", JSON.stringify(nuevasCapacidades));
    cargarCapacidades();
  }
}

// Cargar la lista de capacidades al iniciar
// await cargarCapacidades();
