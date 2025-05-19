document.addEventListener("DOMContentLoaded", () => {
    const botonEnviar = document.getElementById("btnEnviar");
    const responseContainer = document.getElementById("response");
    const responseData = document.getElementById("responseData");
    const errorMessage = document.getElementById("errorMessage");
    const botonContinuar = document.getElementById("btnContinuar");


    // VALIDACIONES 
    document.getElementById("cedula").addEventListener("input", function (e) {
        this.value = this.value.replace(/\D/g, ''); // Solo numeros
    });

    // LOGICA
    botonEnviar.addEventListener("click", async (event) => {
        botonEnviar.disabled = true;
        event.preventDefault()

        const cedula = document.getElementById("cedula").value;
        const tipo = document.getElementById("tipo").value;

        if (!cedula || !tipo) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor ingresa el tipo de documento y número de cédula.",
                heightAuto: false
            });
            botonEnviar.disabled = false;
            return;
        }

        const requestBody = {
            patient: {
                identifier: [
                    { type: 'TIPO_IDENTIFICACION', value: tipo },
                    { type: "NUMERO_IDENTIFICACION", value: cedula }
                ],
                minAge: null,
                maxAge: null,
                relationship: null
            },
            coverage: {
                insurancePlan: { type: "CODIGO_PRODUCTO", value: "" },
                contract: [
                    { type: "PLAN", value: "" },
                    { type: "CONTRATO", value: "" },
                    { type: "FAMILIA", value: "" }
                ]
            },
            swFamily: false,
            lastValid: false, // Lo podemos cambiar a true y solo aparecen los habilitados
            date: ""
        };

        try {
            responseData.innerHTML = '';
            const response = await fetch("http://localhost:3000/patient/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status}`);
            }

            const data = await response.json();
            console.log(data)

            const fragment = document.createDocumentFragment();
            
            if (data && data.data && data.data.length > 0) {

                data.data.forEach((item, index) => {
                    const producto = item.insurancePlan.identifier.find(i => i.type === "NOMBRE_PRODUCTO")?.value || "N/A";
                    const nombrePlan = item.contract.identifier.find(i => i.type === "NOMBRE_PLAN")?.value || "N/A";
                    const familia = item.contract.identifier.find(i => i.type === "FAMILIA")?.value || "N/A";
                    const contrato = item.contract.identifier.find(i => i.type === "CONTRATO")?.value || "N/A";
                    const estadoCodigo = item.coverage[0]?.status?.code || "N/A";
                    const codigoProducto = item.insurancePlan.identifier.find(i => i.type === "CODIGO_PRODUCTO")?.value || "30";

                    const valueRadio = `${producto} - Plan ${nombrePlan} - Contrato ${contrato} - Familia ${familia} - ${estadoCodigo}`


                    // Crear el input radio
                    const radioInput = document.createElement("input");
                    radioInput.type = "radio";
                    radioInput.name = "opcionPlan";
                    radioInput.value = valueRadio;
                    radioInput.id = `opcion${index}`;
                    radioInput.setAttribute("data-codigo", codigoProducto); // Guardamos el código aquí

                    // Crear la etiqueta (label)
                    const label = document.createElement("label");
                    label.className = 'LabelRadioButton';
                    label.htmlFor = `opcion${index}`;
                    label.textContent = valueRadio;

                    // Crear un contenedor div para cada opción
                    const divItem = document.createElement("div");
                    divItem.classList.add("radio-item"); // Para agregar estilos con CSS
                    divItem.appendChild(radioInput);
                    divItem.appendChild(label);

                    fragment.appendChild(divItem);
                });
            } else {
                throw new Error("Paciente no encontrado.");
            }

            responseData.appendChild(fragment);
            responseContainer.classList.remove('d-none');
            errorMessage.textContent = "";

        } catch (error) {
            console.error("Error al obtener los datos:", error);
            // responseContainer.hidden = false;
            responseContainer.classList.remove('d-none')
            responseData.textContent = "";
            errorMessage.textContent = "❌ Paciente no encontrado. Verifique los datos ingresados.";
            errorMessage.hidden = false;
            botonContinuar.hidden = true;

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
                heightAuto: false
            });
        };
        botonEnviar.disabled = false;
    });

    document.getElementById("btnContinuar").addEventListener("click", () => {

        const radioButton = document.querySelector('input[name="opcionPlan"]:checked');

        if (radioButton == null){
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor Seleccione un Contrato.",
                heightAuto: false
            });
            return
        }

        const cedula = document.getElementById("cedula").value;
        const tipo = document.getElementById("tipo").value;
        const codigoProducto = radioButton.dataset.codigo;

        window.location.href = `validador.html?tipo=${encodeURIComponent(tipo)}&cedula=${encodeURIComponent(cedula)}&cod=${codigoProducto}`;
    });
});
