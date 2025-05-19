document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const numAutorizacion = params.get("numAuth");
    console.log(numAutorizacion) 
    const requestBody = {
        "identifier": [
          {
            "type": "AUTORIZACION",
            "value": `${numAutorizacion}`
          }
        ]
    }   
    try {
        // Cargamos un letrero de carga
        Swal.fire({
            title: 'Buscando...',
            text: 'Por favor espera un momento',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            heightAuto: false
        });
        const response = await fetch('http://localhost:3000/authorisation/consultar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        const responseCopago = await fetch('http://localhost:3000/authorisation/copago', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                numeroAutorizacion: numAutorizacion
            })
        });

        if (!response.ok || !responseCopago.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`)
        }
        
        const data = await response.json();
        const dataCopago = await responseCopago.json();

        // Cerrar el modal de carga
        Swal.close();
        
        if (data.code == 'RAU02') {
            Swal.fire({
                icon: "warning",
                title: "Registro no existe.",
                text: "La Autorizacion no Existe",
                heightAuto: false
            });
            return ;
        }

        
        // Capturamos la informacion
        const autorizacion = data.authorization[0]
        const autorizacionFechaCorreccion = data?.authorization?.[0] ?? {};
        // Autorizacion
        const numAuth = autorizacion.identifier[0].value
        const codAuth = autorizacion.status.code
        const estAuth = autorizacion.status.description
        const catAuth = autorizacion.category.description
        const occurrenceStart = autorizacion.occurrence.start
        const occurrenceEnd = autorizacion.occurrence.end
        const fechNotificacion = autorizacionFechaCorreccion?.notificationOn ?? '';
        const fechSolicitud = autorizacion.applicationDate
        const codServicio = autorizacion.category.code
        const nomServicio = autorizacion.category.description
        const codTipoAtencion = autorizacion.encounter.class.code
        const nomTipoAtencion = autorizacion.encounter.class.value
        const consumida = autorizacion.isConsumed
        const renovada = autorizacion.isRenewed
        const apta = autorizacion.isSuitableRenewal
        //Orden Medica
        const numOrdenMed = autorizacion.serviceRequest.identifier.code
        const fechOrdenMed = autorizacion.serviceRequest.authoredOn
        const codOrigenAuth = autorizacion.serviceRequest.reasonReference.condition.code
        const desOrigenAuth = autorizacion.serviceRequest.reasonReference.condition.value
        const numEntregaAuth = autorizacion.serviceRequest.basedOn.MedicationRequest.code
        const totalEntregas = autorizacion.serviceRequest.basedOn.MedicationRequest.dispenseRequest.numberOfRepeatsAllowed
        const periodicidad = autorizacion.serviceRequest.basedOn.MedicationRequest.dispenseRequest.dispenseInterval
        // Prestador Remitente
        const codTipoIdePrestadorOrdenante = autorizacion.serviceRequest.requester.practitioner.identifier[0].value
        const numTipoIdePrestadorOrdenante = autorizacion.serviceRequest.requester.practitioner.identifier[1].value
        const codSucursalPrestadorOrdenante = autorizacion.serviceRequest.requester.practitioner.identifier[2].value
        const nomSucursalPrestadorOrdenante = autorizacion.serviceRequest.requester.practitioner.name
        const nomLegalEspecialidad = autorizacion.serviceRequest.requester.practitioner.specialty.value
        // Medicamento
        if (autorizacion.medicationRequest.length === 1) {
            console.log("Solo vamos a poner 1 medicamento")
            const codLegMedicamento = autorizacion.medicationRequest[0].identifier[0].value
            const nomMed = autorizacion.medicationRequest[0].identifier[1].value
            const desFormFarmaceutica = autorizacion.medicationRequest[0].medication.form[1].name
            const sucursal = autorizacion.performer.practitioner.identifier[2].value
            const controlado = autorizacion.medicationRequest[0].checked
            const cantDispensada = autorizacion.medicationRequest[0].medicationDispense.quantity
            
            // const cobro = autorizacion.costToBeneficiary.valueMoney
            const cobro = dataCopago?.entry?.[0]?.resource?.costToBeneficiary?.[0]?.valueMoney?.value ?? '';
            // const cobro = dataCopago.entry[0].resource.costToBeneficiary[0].extension[0].valueDecimal
            const tipoCopago = autorizacion.costToBeneficiary.type
            const codProducto = autorizacion.insurance.coverage.insurancePlan.identifier[0].value

            // let cobro = dataCopago?.entry?.[0]?.resource?.costToBeneficiary?.[0]?.valueMoney?.value ?? '';
            // let texto = dataCopago?.entry?.[0]?.resource?.costToBeneficiary?.[0]?.exception?.[0]?.type?.text ?? '';
            // if (cobro == 0 && texto == 'Sin cobro de cuota moderadora') {
            //     console.log('Le asignamos el nuevo valor')
            // }
            document.getElementById("codLegMedicamento").textContent = codLegMedicamento; 
            document.getElementById("nomMed").textContent = nomMed;
            document.getElementById("desFormFarmaceutica").textContent = desFormFarmaceutica;
            document.getElementById("controlado").textContent = controlado;
            document.getElementById("cantDispensada").textContent = cantDispensada;
            document.getElementById("sucursal").textContent = sucursal;
            document.getElementById("cobro").textContent = cobro;
            document.getElementById("tipoCopago").textContent = tipoCopago;
            document.getElementById("codProducto").textContent = codProducto;
        } else {
            document.getElementById("medicamentoContainer").classList.add("d-none")
            const container = document.getElementById("medicamentosContainer");
            container.innerHTML = ""; // Limpiar por si ya había contenido

            autorizacion.medicationRequest.forEach((med, index) => {
                const codLegMedicamento = med?.identifier?.[0]?.value ?? '';
                const nomMed = med?.identifier?.[1]?.value ?? '';
                const desFormFarmaceutica = med?.medication?.form?.[1]?.name ?? '';
                const controlado = med?.checked ?? '';
                const cantDispensada = med?.medicationDispense?.quantity ?? '';
                const tipoCopago = autorizacion?.costToBeneficiary?.type ?? '';
                const sucursal = autorizacion?.performer?.practitioner?.identifier?.[2]?.value ?? '';
                const cobro = dataCopago?.entry?.[0]?.resource?.costToBeneficiary?.[0]?.valueMoney?.value ?? '';
                const codProducto = autorizacion?.insurance?.coverage?.insurancePlan?.identifier?.[0]?.value ?? '';

                const html = `
                    <div class="container border rounded p-4 mt-2 bg-white">
                        <div class="d-flex justify-content-center align-items-center">
                            <h4>Medicamento ${index + 1}</h4>
                        </div>
                        <div class="row">
                            <div class="col fw-bold">Codigo legal medicamento OSI:</div>
                            <div class="col">${codLegMedicamento}</div>
                            <div class="col fw-bold">Controlado:</div>
                            <div class="col">${controlado}</div>
                        </div>
                        <div class="row">
                            <div class="col fw-bold">Nombre medicamento OSI:</div>
                            <div class="col">${nomMed}</div>
                            <div class="col fw-bold">Cantidad Dispensada:</div>
                            <div class="col">${cantDispensada}</div>
                        </div>
                        <div class="row">
                            <div class="col fw-bold">Descripción Forma Farmaceutica:</div>
                            <div class="col">${desFormFarmaceutica}</div>
                            <div class="col fw-bold">Tipo Copago: </div>
                            <div class="col">${tipoCopago}</div>
                        </div>
                        <div class="row">
                            <div class="col fw-bold">Sucursal:</div>
                            <div class="col sucursalClase">${sucursal}</div>
                            <div class="col fw-bold">Cobro:</div>
                            <div class="col">${cobro}</div>
                        </div>
                        <div class="row">
                            <div class="col fw-bold">Código Producto:</div>
                            <div class="col codigoProductoClase">${codProducto}</div>
                            <div class="col fw-bold"></div>
                            <div class="col"></div>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
        }

        // Asignamos valores
        document.getElementById("numAuth").textContent = numAuth;
        document.getElementById("codEstAuth").textContent = codAuth;
        document.getElementById("desEstAuth").textContent = estAuth;
        document.getElementById("vigencia").textContent = `${occurrenceStart.split("T")[0]} hasta ${occurrenceEnd.split("T")[0]}`;
        document.getElementById("categoria").textContent = catAuth;
        document.getElementById("fechNotificacion").textContent = fechNotificacion.split("T")[0] ?? '';
        document.getElementById("fechSolicitud").textContent = fechSolicitud.split("T")[0];
        document.getElementById("codServicio").textContent = codServicio;
        document.getElementById("desServicio").textContent = nomServicio;
        document.getElementById("codTipoAtencion").textContent = codTipoAtencion;
        document.getElementById("desTipoAtencion").textContent = nomTipoAtencion;
        document.getElementById("authConsumida").textContent = consumida;
        document.getElementById("authRenovada").textContent = renovada;
        document.getElementById("authApta").textContent = apta;

        document.getElementById("numOrdenMed").textContent = numOrdenMed;
        document.getElementById("fechOrdenMed").textContent = fechOrdenMed.split("T")[0];
        document.getElementById("codOrigenAuth").textContent = codOrigenAuth;
        document.getElementById("desOrigenAuth").textContent = desOrigenAuth;
        document.getElementById("numEntregaAuth").textContent = numEntregaAuth;
        document.getElementById("totalEntregas").textContent = totalEntregas;
        document.getElementById("periodicidad").textContent = periodicidad;

        document.getElementById("codTipoIdePrestadorOrdenante").textContent = codTipoIdePrestadorOrdenante;
        document.getElementById("numTipoIdePrestadorOrdenante").textContent = numTipoIdePrestadorOrdenante;
        document.getElementById("codSucursalPrestadorOrdenante").textContent = codSucursalPrestadorOrdenante;
        document.getElementById("nomSucursalPrestadorOrdenante").textContent = nomSucursalPrestadorOrdenante;
        document.getElementById("nomLegalEspecialidad").textContent = nomLegalEspecialidad;

    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }

    // Boton de consumir
    const btnConsumir = document.getElementById("btnConsumir")
    btnConsumir.addEventListener("click", async () => {
        const alerta = await Swal.fire({
            icon: "question",
            title: "Consumir",
            text: "¿Está Seguro de Consumir la Autorización?",
            showCancelButton: true,
            confirmButtonText: "Sí, consumir",
            cancelButtonText: "No, cancelar",
            heightAuto: false
        });

        if (alerta.isConfirmed){
            try{
                Swal.fire({
                    title: 'Buscando...',
                    text: 'Por favor espera un momento',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    heightAuto: false
                });
                const numeroAutorizacionBody = parseInt(numAutorizacion)
                let valorCodProducto = document.getElementById("codProducto").innerText;
                let valorSucursal = document.getElementById("sucursal").innerText;
                let codigoBody = parseInt(valorCodProducto)
                let sucursalBody = parseInt(valorSucursal)

                console.log(valorSucursal)
                console.log(valorCodProducto)

                if (valorSucursal == ""){
                    console.log("Okeyyyy")
                    valorSucursal = document.querySelector('.sucursalClase');
                    sucursalBody = parseInt(valorSucursal.textContent);
                    valorCodProducto = document.querySelector('.codigoProductoClase');
                    codigoBody = parseInt(valorCodProducto.textContent);
                    console.log(codigoBody)
                    console.log(sucursalBody)
                }
                
                const response = await fetch("http://localhost:3000/authorisation/consumir",{
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "numeroAutorizacion": numeroAutorizacionBody, 
                        "codigo": codigoBody, 
                        "sucursal": sucursalBody
                    })
                });

                if (!response.ok) throw new Error("Error en la solicitud");

                const data = await response.json();

                Swal.close()

                if(data.resourceType == "Bundle") {
                    Swal.fire({
                        icon: "success",
                        title: "Éxito",
                        text: "La autorización ha sido consumida correctamente.",
                        heightAuto: false
                    });
                    // location.reload();
                } else {
                    Swal.fire({
                        icon: "info",
                        text: "La autorización ya ha sido consumida anteriormente.",
                        heightAuto: false
                    });
                }
            } catch (error){
                console.error("La autorizacion no ha sido consumida debido a un error.")
            }
        } else if (alerta.isDismissed) {
            Swal.fire({
                icon: "info",
                title: "Cancelado",
                text: "El consumo de la autorización fue cancelado.",
                heightAuto: false
            });
        }

    });
});