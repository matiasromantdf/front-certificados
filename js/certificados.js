// Función para buscar un alumno por DNI
function buscarAlumnoCertificado() {
    const dni = document.getElementById('dniAlumno').value;
    const alumnos = JSON.parse(localStorage.getItem('alumnos') || '[]');
    const alumno = alumnos.find(a => a.dni === dni);

    if (alumno) {
        document.getElementById('datosAlumno').style.display = 'block';
        document.getElementById('nombreCompletoAlumno').textContent = 
            `${alumno.nombre} ${alumno.apellido}`;
        
        cargarCapacidadesParaCertificado();
        document.getElementById('capacidadesContainer').style.display = 'block';
        document.getElementById('btnGenerar').style.display = 'block';
    } else {
        alert('Alumno no encontrado');
        document.getElementById('datosAlumno').style.display = 'none';
        document.getElementById('capacidadesContainer').style.display = 'none';
        document.getElementById('btnGenerar').style.display = 'none';
    }
}

// Función para cargar las capacidades disponibles
function cargarCapacidadesParaCertificado() {
    const capacidades = JSON.parse(localStorage.getItem('capacidades') || '[]');
    const container = document.getElementById('listaCapacidades');
    container.innerHTML = '';

    capacidades.forEach(capacidad => {
        const div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${capacidad.id}" 
                   id="cap${capacidad.id}">
            <label class="form-check-label" for="cap${capacidad.id}">
                ${capacidad.nombre}
            </label>
        `;
        container.appendChild(div);
    });
}

// Función para generar el certificado
document.getElementById('certificadoForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const dni = document.getElementById('dniAlumno').value;
    const alumnos = JSON.parse(localStorage.getItem('alumnos') || '[]');
    const capacidades = JSON.parse(localStorage.getItem('capacidades') || '[]');
    const alumno = alumnos.find(a => a.dni === dni);

    if (!alumno) {
        alert('Alumno no encontrado');
        return;
    }

    const capacidadesSeleccionadas = capacidades.filter(cap => 
        document.getElementById(`cap${cap.id}`).checked
    );

    if (capacidadesSeleccionadas.length === 0) {
        alert('Debe seleccionar al menos una capacidad');
        return;
    }

    generarCertificado(alumno, capacidadesSeleccionadas);
});

// Función para generar el contenido del certificado
function generarCertificado(alumno, capacidades) {
    const fecha = new Date().toLocaleDateString();
    const certificadoContent = document.getElementById('certificadoContent');
    
    certificadoContent.innerHTML = `
        <div class="text-center">
            <h2 class="mb-4">Certificado de Capacidades</h2>
            <p class="mb-4">Se certifica que el alumno/a:</p>
            <h3 class="mb-4">${alumno.nombre} ${alumno.apellido}</h3>
            <p class="mb-4">DNI: ${alumno.dni}</p>
            <p class="mb-4">Ha aprobado las siguientes capacidades:</p>
            <ul class="list-unstyled">
                ${capacidades.map(cap => `<li>${cap.nombre}</li>`).join('')}
            </ul>
            <p class="mt-4">Fecha de emisión: ${fecha}</p>
        </div>
    `;

    document.getElementById('certificadoGenerado').style.display = 'block';
}

// Función para imprimir el certificado
function imprimirCertificado() {
    const contenido = document.getElementById('certificadoContent').innerHTML;
    const ventana = window.open('', 'PRINT', 'height=600,width=800');
    
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
    
    setTimeout(function() {
        ventana.print();
        ventana.close();
    }, 250);
}