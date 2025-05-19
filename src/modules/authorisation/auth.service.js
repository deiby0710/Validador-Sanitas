export const consultAuthorisation = async (requestBody, authHeader) => {
    try {
        const response = await fetch(
            'https://papi.colsanitas.com/osi/api/insurance/operationsSupport/medicalServicesAuthorization/V1.0.0/autorizathion/consultAuthorization',
            {
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Authorization": authHeader,
                    "tipoConsulta": "1",
                    "idPeticion": "poQEE46M98",
                    "codAplicacion": "PSA000199903",
                    "idTerminal": "123.451.7.123",
                    "usuario": "CO11VG60AMPGENHOSPI",
                    "fechaPeticion": "2024-06-18",
                    "funcionNegocio": "Dispensacion Medicamentos"
                },
                body: JSON.stringify(requestBody)
            }
        );
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`)
        };
        return await response.json()
    } catch (error) {
        console.log("Error en consultAuthorisation: ", error);
        throw error; // Lanza el error para que el controlador lo maneje
    }
}

export const consumirAuth = async (numeroAutorizacion, codigo, sucursal, authHeader) => {
    // const currentDay = new Date().toISOString().split(".")[0]
    const fecha = new Date();
    const currentDay = fecha.getFullYear() + '-' +
      String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
      String(fecha.getDate()).padStart(2, '0') + 'T' +
      String(fecha.getHours()).padStart(2, '0') + ':' +
      String(fecha.getMinutes()).padStart(2, '0') + ':' +
      String(fecha.getSeconds()).padStart(2, '0');
    const body = {
        "resourceType": "Bundle",
        "type": "transaction",
        "entry": [
          {
            "fullUrl": `ServiceRequest/${numeroAutorizacion}`,
            "resource": {
              "resourceType": "Parameters",
              "parameter": [
                {
                  "name": "operation",
                  "part": [
                    {
                      "name": "type",
                      "valueCode": "add"
                    },
                    {
                      "name": "path",
                      "valueString": "ServiceRequest"
                    },
                    {
                      "name": "name",
                      "valueString": "status"
                    },
                    {
                      "name": "value",
                      "valueString": "completed"
                    }
                  ]
                },
                {
                  "name": "operation",
                  "part": [
                    {
                      "name": "type",
                      "valueCode": "add"
                    },
                    {
                      "name": "path",
                      "valueString": "ServiceRequest"
                    },
                    {
                      "name": "name",
                      "valueString": "orderDetail"
                    },
                    {
                      "name": "value",
                      "valueCodeableConcept": {
                        "coding": [
                          {
                            "system": "BH/Origen",
                            "code": "13"
                          }
                        ]
                      }
                    }
                  ]
                }
              ]
            },
            "request": {
              "method": "PATCH",
              "url": `ServiceRequest/${numeroAutorizacion}`
            }
          },
          {
            "request": {
              "method": "POST",
              "url": "Encounter/GUID7043520"
            },
            "resource": {
              "resourceType": "Encounter",
              "id": "GUID7043520",
              "status": "finished",
              "class": "1",
              "period": {
              "start": currentDay
              },
              "serviceProvider": {
                "reference": `Organization/${codigo}`,
                "display": "Producto Colsanitas"
              },
              "basedOn": {
                "reference": `ServiceRequest/${numeroAutorizacion}`,
                "display": "Numero de autorizacion"
              },
              "participant": [
                {
                  "type": [
                    {
                      "text": "Practitioner"
                    }
                  ],
                  "individual": {
                    "reference": `Practitioner/${sucursal}`
                  }
                }
              ],
              "extension": [
                {
                  "url": "typeVirtualEncounter",
                  "valueInteger": null
                },
                {
                  "url": "additionalCareInformation",
                  "valueInteger": null
                },
                {
                  "url": "additionalCareInformation",
                  "valueInteger": null
                },
                {
                  "url": "typeVirtualEncounter",
                  "valueInteger": null
                },
                {
                  "url": "typeVirtualEncounter",
                  "valueInteger": null
                }
              ]
            }
          }
        ]
      }
    try {
        const response = await fetch(
            "https://papi.colsanitas.com/osi/api/insurance/operationsSupport/medicalServicesAuthorization/V1.0.0/serviceRequest/fullyPerformed",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": authHeader,
                    "petitionId": "SEC123-20240219",
                    "aplicationCod": "PSA000199903",
                    "terminalId": "192.1.12.22",
                    "user": "CO11VG60AMPGENHOSPI",
                    "dateRequest": "2024-06-18",
                    "businessFunction": "Dispensacion Medicamentos"
                },
                body: JSON.stringify(body)
            }
        );

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`)
        }
        return await response.json()
    } catch (error){
        console.log("Error en consumirAuth: ", error)
        throw error
    }
}


export const copayAmount1 = async (numeroAutorizacion,authHeader) => {
  const currentDay = new Date().toISOString().split("T")[0]
  const requestBody = {
    "resourceType": "Bundle",
    "id": "bundle-request-copayAmount",
    "type": "transaction",
    "entry": [
      {
        "resource": {
          "resourceType": "Patient",
          "id": "GUID",
          "meta": {
            "lastUpdated": currentDay
          },
          "identifier": [
            {
              "system": "BH/NUMERO_AUTORIZACION",
              "value": `${numeroAutorizacion}`
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
            "typeQuery": 1
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