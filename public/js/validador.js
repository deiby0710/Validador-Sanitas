document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo");
    const cedula = params.get("cedula");
    const codigoProducto = params.get("cod");

    if (!tipo || !cedula) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Faltan datos para realizar la validación."
        });
        return;
    }

    const requestBody = {
        subject: {
            identifier: [
                { type: tipo.toUpperCase(), value: cedula },
                { type: "NUMERO_IDENTIFICACION", value: cedula }
            ]
        },
        coverage: {
            insurancePlan: { type: "CODIGO_PRODUCTO", value: codigoProducto },
            contract: [
                { type: "PLAN", value: "" },
                { type: "CONTRATO", value: "" },
                { type: "FAMILIA", value: "" }
            ]
        },
        swFamily: false,
        lastValid: true,
        date: ""
    };
    

    try {
        const response = await fetch("http://localhost:3000/patient/consultaAfiliado", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const responseCopay = await fetch("http://localhost:3000/patient/copago", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                numIden: cedula,
                tipoIden: tipo
            })
        });

        if (!response.ok) throw new Error("Error en la solicitud");

        const data = await response.json();
        const dataCopay = await responseCopay.json();

        // Datos coverHeader
        const patientData = data.coverFamilyResponse?.[0];

        const insuranceIdentifiers = patientData.insurancePlan?.identifier || [];
        const contractIdentifiers = patientData.contract?.identifier || [];
        const patientIdentifiers = patientData.contract?.subject?.patient?.[0]?.identifier || [];
        const patient = patientData.contract?.subject?.patient?.[0];
        const identifiers = patient?.identifier || [];
        const contract = patientData.contract;
        const telecom = contract?.address?.[0]?.telecom || [];
        const patientRole = patientData.contract?.subject?.patient?.[0]?.role || [];

        const nombre = data.coverFamilyResponse?.[0]?.contract?.subject?.patient?.[0]?.name || "";
        const codigoProducto = insuranceIdentifiers.find(item => item.type === "CODIGO_PRODUCTO")?.value;
        const nombreProducto = insuranceIdentifiers.find(item => item.type === "NOMBRE_PRODUCTO")?.value;
        const codigoPlan = contractIdentifiers.find(item => item.type === "PLAN")?.value;
        const nombrePlan = contractIdentifiers.find(item => item.type === "NOMBRE_PLAN")?.value;
        const contrato = contractIdentifiers.find(item => item.type === "CONTRATO")?.value;
        const familia = contractIdentifiers.find(item => item.type === "FAMILIA")?.value;
        const numUsuario = patientIdentifiers.find(item => item.type === "NUM_USR")?.value;
        const estado = patient?.status;
        const tipoDocumento = identifiers.find(item => item.type === "TIPO_IDENTIFICACION")?.value;
        const numeroDocumento = identifiers.find(item => item.type === "NUMERO_IDENTIFICACION")?.value;
        const telefonoPrincipal = telecom.find(item => item.system === "TELEFONO_CONTACTO_PRINCIPAL")?.value;
        const segundoTelefono = telecom.find(item => item.system === "CELULAR")?.value;
        const correo = telecom.find(item => item.system === "CORREO_ELECTRONICO")?.value;

        const numCotizante = contractIdentifiers.find(item => item.type === "NUMERO_IDENT_CONTRATANTE")?.value;
        const tipoAfilidado = patientRole.find(item => item.type === "DESC_TIPO_USUARIO")?.value;
        const sgsss = patient?.supportingInfo?.generalSystemSocialSecurityHealth ?? null;
        const tipoDocumentoContratante = contractIdentifiers.find(item => item.type === "TIPO_IDENT_CONTRATANTE")?.value;

        console.log("Datacopay:", dataCopay.total)

        // const categoria = contract?.subType ?? null;
        // const motivoEstado = contract?.scope ?? null;
        let categoria = '';
        let motivoEstado = '';  
        console.log("Data total: ",dataCopay.total)
        if(dataCopay.total == 0) {
            categoria = contract?.subType ?? null;
            motivoEstado = contract?.scope ?? null;
            console.log("Categoria: ",categoria)
            console.log("Estado: ",motivoEstado)
            document.getElementById("divAutorizaciones").classList.add('d-none');
        } else {
            // Datos copayAmoun (Copago)
            categoria = dataCopay.entry[0].resource.costToBeneficiary[0].class[1].value ?? '';
            motivoEstado = dataCopay.entry[0].resource.costToBeneficiary[0].class[0].value ?? '';  
            document.getElementById("divAutorizaciones").classList.remove('d-none');
        } 
        // 📌 Insertar datos en el DOM
        document.getElementById("nombre").textContent = nombre;
        document.getElementById("productoInfo").textContent = `${codigoProducto || "N/A"} ${nombreProducto || "N/A"}`;
        document.getElementById("planInfo").textContent = `${codigoPlan || "N/A"} ${nombrePlan || "N/A"}`;;
        document.getElementById("contrato").textContent = contrato;
        document.getElementById("familia").textContent = familia;
        document.getElementById("numUsuario").textContent = numUsuario;
        document.getElementById("estado").textContent = estado;
        document.getElementById("tipoDocumento").textContent = tipoDocumento;
        document.getElementById("numeroDocumento").textContent = numeroDocumento;
        document.getElementById("telefonoPrincipal").textContent = telefonoPrincipal;
        document.getElementById("segundoTelefono").textContent = segundoTelefono;
        document.getElementById("correo").textContent = correo;

        document.getElementById("identificacionCotizante").textContent = numCotizante;
        document.getElementById("tipoAfilidado").textContent = tipoAfilidado;
        document.getElementById("sgsss").textContent = sgsss;
        document.getElementById("categoria").textContent = categoria;
        document.getElementById("tipoDocumentoContratante").textContent = tipoDocumentoContratante;
        document.getElementById("motivoEstado").textContent = motivoEstado;

        // ----------------------------------------------------------------
        const responseBasicData = await fetch(`http://localhost:3000/patient/basicData?identificationNumber=${cedula}&identificationType=${tipo.toUpperCase()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const dataBasicData = await responseBasicData.json();
            console.log("Datos recibidos Basic Data:", dataBasicData);

            const genero = dataBasicData?.data?.[0]?.gender || '';
            const fechaNacimiento = dataBasicData?.data?.[0]?.birthDate.split("T")[0] || '';
            const edad = dataBasicData?.data?.[0]?.age || '';

            document.getElementById("fechaNacimiento").textContent = fechaNacimiento;
            document.getElementById("edad").textContent = edad;
            document.getElementById("sexo").textContent = genero;
        // Autorizaciones
        // dataCopay
        const tbody = document.getElementById("tableAuthBody");
        dataCopay.entry.forEach((item, index) => {
            const numero = item.resource.identifier.find(id => id.system === "BH/NUMERO_AUTORIZACION").value;
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${index+1}</td>
                <td>${numero}</td>
                <td>
                <button class="btn btn-primary btn-sm" onclick="consultar(${numero})">Consultar</button>
                </td>
            `
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo obtener la información del paciente."
        });
    }
});

function consultar(numero){
    window.location.href = `autorizacion.html?numAuth=${encodeURIComponent(numero)}`;
}
