function validarNumeros(event){
    let input = event.target; // Accedemos al elemento que disparo el evento
    let value = input.value; // Obtenemos el valor actual del input
    input.value = value.replace(/\D/g,""); // \D= Cualquier cosa que no sea numero
};


function mostrarMedicamentos(medicamentos){
    const tbody = document.getElementById('listaMedicamentos');
    tbody.innerHTML = "";

    medicamentos.forEach(med => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${med.nombre}</td>
            <td>${med.cantidad}</td>
            <td>${med.unidad}</td>
            <td>${med.dosis}</td>
            <td>${med.frecuencia}</td>
            <td>${med.duracion}</td>
            <td>${med.via}</td>
        `;
        tbody.appendChild(fila);
    });   
}

// Simulación de la respuesta de la API
const respuestaAPI = [
    {
      nombre: "Paracetamol",
      cantidad: "20",
      unidad: "mg",
      dosis: "500",
      frecuencia: "8h",
      duracion: "5 días",
      via: "Oral"
    },
    {
      nombre: "Ibuprofeno",
      cantidad: "10",
      unidad: "mg",
      dosis: "200",
      frecuencia: "12h",
      duracion: "3 días",
      via: "Oral"
    }
  ];
  
  // Llamar a la función
  mostrarMedicamentos(respuestaAPI);
  