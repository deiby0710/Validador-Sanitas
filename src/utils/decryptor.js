// decryptor.js

const atob = (base64) => Buffer.from(base64, 'base64').toString('utf-8');

// Función para decodificar un objeto con campos base64
function decodeMedicamento(med) {
  return {
    cantidad: atob(med.cantidad),
    codigoATC: atob(med.codigoATC),
    codigoBarras: med.codigoBarras ? atob(med.codigoBarras) : '',
    codigoSophia: med.codigoSophia ? atob(med.codigoSophia) : '',
    numeroEntregas: atob(med.numeroEntregas),
    prescripcion: atob(med.prescripcion),
    unidadDeMedida: atob(med.unidadDeMedida),
  };
}

// Ejemplo de uso (simulación)
function procesarRespuestaAPI(respuesta) {
  const medicamentos = respuesta.medicamentos.map(decodeMedicamento);
  console.log("Medicamentos decodificados:");
  console.table(medicamentos);
}

// Simula la respuesta (pegarás aquí la respuesta real parseada)
const respuestaEjemplo = {
  medicamentos: [
    {
      cantidad: "Uix7XTjotRIP1uQpGZXdNSTQfq+ljhDJAAAAAAAAAAA=",
      codigoATC: "3X5tJ/id6paMoWt932fAwK93bGH6SlTxAAAAAAAAAAA=",
      codigoBarras: "",
      codigoSophia: "",
      numeroEntregas: "msJeC4Jj4fYOoKotWXxtMuZ3givymbiqAAAAAAAAAAA=",
      prescripcion: "xkuZsBg858WJtRmlJxCIKfCjOiJ+NXMuIG1MIGNhZGECrwwSk0KhQ/xORC+lMqfEvk3jRkRgwD5hKHMpAAAAAA==",
      unidadDeMedida: "6WGidnH1skh4idJSXg9+tvYYNk6aLP+0AAAAAAAAAAA=",
    },
    // Agrega más si quieres
  ],
};

// Ejecutar
procesarRespuestaAPI(respuestaEjemplo);
