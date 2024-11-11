// Función para buscar un alumno por DNI
async function buscarAlumnoCertificado() {
  const dni = document.getElementById("dniAlumno").value;
  
  const res = await fetch(apiUrl+'/alumnos/'+dni)
  const alumno = await res.json();

  if (alumno.dni) {
    document.getElementById("datosAlumno").style.display = "block";
    document.getElementById("dniAlumno").disabled = true;
    document.getElementById(
      "nombreCompletoAlumno"
    ).textContent = `${alumno.nombre} ${alumno.apellido}`;

    cargarCapacidadesParaCertificado();
    document.getElementById("capacidadesContainer").style.display = "block";
    document.getElementById("btnGenerar").style.display = "block";
  } else {
    alert("Alumno no encontrado");
    document.getElementById("datosAlumno").style.display = "none";
    document.getElementById("capacidadesContainer").style.display = "none";
    document.getElementById("btnGenerar").style.display = "none";
  }
}

// Función para cargar las capacidades disponibles
async function cargarCapacidadesParaCertificado() {
  const req = await fetch(apiUrl + "/capacidades");
  const capacidades = await req.json();
  const container = document.getElementById("listaCapacidades");

  capacidades.forEach((capacidad) => {
    const div = document.createElement("div");
    div.className = "form-check";
    div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${capacidad.id}" 
                   id="cap${capacidad.id}">
            <label class="form-check-label" for="cap${capacidad.id}">
                C${capacidad.id} ${capacidad.nombre}
            </label>
        `;
    container.appendChild(div);
  });
}

// Función para relacionar las capacidades a un alumno
document
  .getElementById("certificadoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const dni = document.getElementById("dniAlumno").value;
    const capacidades = document.querySelectorAll('input[type="checkbox"]:checked');
    const capacidadesSeleccionadas = [];

    capacidades.forEach((capacidad) => {
      capacidadesSeleccionadas.push(capacidad.value);
    }
    );
    const res = await fetch(apiUrl + "/alumnos/" + dni + "/certificado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ capacidades: capacidadesSeleccionadas }),
    });
    const data = await res.json();
    if(data.id){
      alert("Capacidades asignadas correctamente");
      generarCertificadoPorIdCertificado(data.id);//id del certificado
    }

    
    // generarCertificado(alumno, capacidadesSeleccionadas);
  });

// Función para generar el contenido del certificado
function generarCertificadoPorIdCertificado(certificadoId) {
  let fechaEmision= document.getElementById("fechaEmision").value;
  let url = apiUrl + "/certificados/" + certificadoId + "?fecha="+fechaEmision;
  window.open(url);

 
}

// Función para imprimir el certificado
function imprimirCertificado() {
  const contenido = document.getElementById("certificadoContent").innerHTML;
  const ventana = window.open("", "PRINT", "height=600,width=800");

  ventana.document.write(`
        <html>
            <head>
                <title>Certificado</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body { padding: 20px; }
                    @media print {
                        body { padding: 0; }
                    }
                </style>
            </head>
            <body>
                ${contenido}
            </body>
        </html>
    `);

  ventana.document.close();
  ventana.focus();

  setTimeout(function () {
    ventana.print();
    ventana.close();
  }, 250);
}
