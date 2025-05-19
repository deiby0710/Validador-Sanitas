export const validatePatient = async (requestBody, authHeader) => {
    try {
        const response = await fetch(
            "https://papi.colsanitas.com/osi/api/articulation/articulationOfHealthCare/coverage/v1.0.0/coverageHeader",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authHeader, 
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        return await response.json(); // Devuelve los datos al controlador
    } catch (error) {
        console.error("Error en validatePatient:", error);
        throw error; // Lanza el error para que el controlador lo maneje
    }
};

export const validatorPatient = async (requestBody, authHeader) => {
    try {
        const response = await fetch(
            "https://papi.colsanitas.com/osi/api/assurance/affiliations/affiliationsAndNewsManagements/contract/v1.0.0/cover",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authHeader, 
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        return await response.json(); // Devuelve los datos al controlador
    } catch (error) {
        console.error("Error en validatorPatient:", error);
        throw error; // Lanza el error para que el controlador lo maneje
    }
};

export const getPatientBasicData = async (identificationNumber, identificationType, authHeader) => {
    try {
        const url = `https://papi.colsanitas.com/osi/api/user/userManagement/patient/v1.0.0/basicData?identificationNumber=${identificationNumber}&identificationType=${identificationType}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": authHeader,
                "IdPeticion": "UREAF19ISAFG987",
                "IdTerminal": "10.251.107.195",
                "Usuario": "CO11VG60AMPGENHOSPI",
                "FechaPeticion": "2024-09-20T15:00:00",
                "funcionNegocio": "Dispensacion",
                "codAplicacion": "PSA000199903",
                "tipoConsulta": "1",
            },
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        return await response.json(); // Devuelve los datos al controlador
    } catch (error) {
        console.error("Error en getPatientBasicData:", error);
        throw error; // Lanza el error para que el controlador lo maneje
    }
};


// Consumimos la couta moderadora.

export const copayAmount2 = async (numIden, tipoIden,authHeader) => {
    const currentDay = new Date().toISOString().split("T")[0]
    const requestBody = {
      "resourceType": "Bundle",
      "id": "bundle-request-copayAmount",
      "type": "transaction",
      "entry": [
        {
          "request": {
            "method": "GET",
            "url": "Patient"
          },
          "resource": {
            "resourceType": "Patient",
            "id": "GUID",
            "meta": {
              "lastUpdated": currentDay
            },
            "identifier": [
              {
                "type": {
                  "coding": [
                    {
                      "code": tipoIden
                    }
                  ]
                },
                "system": "BH/NUMERO_IDENTIFICACION",
                "value": numIden
              }
            ]
          }
        }
      ]
    }
    try {
      const response = await fetch(
        "https://papi.colsanitas.com/osi/api/financialResourcesManagement/payment/coverage/v1.0.0/copayAmount",
        {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": authHeader,
              "user": "CO11VG60AMPGENHOSPI",
              "dateRequest": '2024-01-22',
              "businessFunction": "Dispensacion Medicamentos",
              "aplicationCod": "PSA000199903",
              "typeQuery": 2
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok){
        throw new Error(`Error en la solicitud: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.log("Error en copayAmount:", error)
      throw error
    }
}