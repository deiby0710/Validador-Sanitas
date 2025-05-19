const obtenerToken = async () => {
    try {
        const params = new URLSearchParams();
        params.append("grant_type", "password");
        params.append("username", "CO11VG60AMPGENHOSPI");
        params.append("password", "Tyg4QMTLBivW3iyB6oVox");

        const response = await fetch("https://papi.colsanitas.com/token", {
            method: "POST",
            headers: {
                'Authorization': 'Basic YzVhTklYc1NtSm9ZTERmY2tHX25KUThKZXNzYTprN19ncm5zcGtWOUZQOWY3X1FBNk52aHQzSXdh',
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error(`Error obteniendo el token: ${response.status}`);
        }
        const data = await response.json(); // Extraer el JSON de la respuesta
        return { access_token: data.access_token, expires_in: data.expires_in }
    } catch (error) {
        console.error(" ❌ Error al obtener el token:", error);
        return null;
    }
};

export default obtenerToken;